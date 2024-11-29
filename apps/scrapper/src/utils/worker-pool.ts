import { EventEmitter } from "node:events";
import { Worker } from "worker_threads";
import type { WorkerOptions } from "worker_threads";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TInputData = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TOutputData = Record<string, any>;

export type WorkerTask<TInput extends TInputData> = {
  id: string;
  data: TInput;
};

export type WorkerResult<
  TInput extends TInputData,
  TOutput extends TOutputData,
> =
  | {
      id: string;
      data: TOutput;
      success: true;
    }
  | {
      id: string;
      error: Error;
      input: TInput;
      success: false;
    };

type TRetryConfig = {
  maxRetries: number;
  shouldRetry: (error: Error) => boolean;
  delayMs: number | ((attempt: number) => number);
};

type TWorkerPoolConfig = {
  numberOfThreads: number;
  workerOptions?: WorkerOptions;
  retry?: Partial<TRetryConfig>;
};

type TProgressStats<TInput extends TInputData> = {
  total: number;
  finished: number;
  failed: number;
  activeJobs: TInput[];
};

type QueueItem<TInput extends TInputData, TOutput extends TOutputData> = {
  task: WorkerTask<TInput>;
  resolve: (result: TOutput) => void;
  reject: (error: Error) => void;
  retriesLeft: number;
};

export class WorkerPool<
  TInput extends TInputData,
  TOutput extends TOutputData,
> extends EventEmitter<{
  progress: [TProgressStats<TInput>];
  success: [Extract<WorkerResult<TInput, TOutput>, { success: true }>];
  failed: [Extract<WorkerResult<TInput, TOutput>, { success: false }>];
}> {
  private workers: Worker[] = [];
  private queue: QueueItem<TInput, TOutput>[] = [];
  private activeWorkers = new Map<Worker, QueueItem<TInput, TOutput>>();
  private retryConfig: TRetryConfig;

  public stats: TProgressStats<TInput> = {
    total: 0,
    finished: 0,
    failed: 0,
    activeJobs: [],
  };

  constructor(
    private workerScript: string,
    config: TWorkerPoolConfig,
  ) {
    super();

    this.retryConfig = {
      maxRetries: 3,
      shouldRetry: () => true,
      delayMs: 1000,
      ...config.retry,
    };

    for (let i = 0; i < config.numberOfThreads; i++) {
      this.addNewWorker(config.workerOptions);
    }
  }

  private async delay(attempt: number): Promise<void> {
    const delayMs =
      typeof this.retryConfig.delayMs === "function"
        ? this.retryConfig.delayMs(attempt)
        : this.retryConfig.delayMs;

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  private async handleError(
    worker: Worker,
    error: Error,
    queueItem: QueueItem<TInput, TOutput>,
  ): Promise<void> {
    const shouldRetry =
      this.retryConfig.shouldRetry(error) && queueItem.retriesLeft > 0;

    if (shouldRetry) {
      queueItem.retriesLeft--;
      await this.delay(this.retryConfig.maxRetries - queueItem.retriesLeft);

      this.queue.unshift(queueItem);
    } else {
      queueItem.reject(error);
    }

    this.activeWorkers.delete(worker);
    this.processNextTask(worker);
  }

  private addNewWorker(options?: WorkerOptions): Worker {
    const worker = new Worker(this.workerScript, options);

    worker.on("message", (result: WorkerResult<TInput, TOutput>) => {
      const queueItem = this.activeWorkers.get(worker);
      if (!queueItem) return;

      this.updateStats({
        finished: this.stats.finished + 1,
        activeJobs: this.stats.activeJobs.filter(
          (job) => job !== queueItem.task.data,
        ),
      });

      this.activeWorkers.delete(worker);

      if (result.success) {
        queueItem.resolve(result.data);
        void this.processNextTask(worker);
      } else {
        void this.handleError(worker, result.error, queueItem);
      }
    });

    worker.on("error", (error: Error) => {
      const queueItem = this.activeWorkers.get(worker);
      if (!queueItem) return;

      if (queueItem.retriesLeft === 0) {
        this.updateStats({
          failed: this.stats.failed + 1,
          activeJobs: this.stats.activeJobs.filter(
            (job) =>
              JSON.stringify(job) !== JSON.stringify(queueItem.task.data),
          ),
        });
      }

      void this.handleError(worker, error, queueItem);
    });

    worker.on("exit", (code) => {
      const queueItem = this.activeWorkers.get(worker);
      if (!queueItem) return;

      if (code !== 0) {
        void this.handleError(
          worker,
          new Error(`Worker stopped with exit code ${code}`),
          queueItem,
        );
      }
    });

    this.workers.push(worker);
    return worker;
  }

  private updateStats(update: Partial<TProgressStats<TInput>>) {
    this.stats = { ...this.stats, ...update };
    this.emit("progress", this.stats);
  }

  private processNextTask(worker: Worker): void {
    if (this.queue.length > 0) {
      const queueItem = this.queue.shift();

      if (queueItem) {
        this.runTask(worker, queueItem);
      }
    }
  }

  private runTask(worker: Worker, queueItem: QueueItem<TInput, TOutput>): void {
    this.activeWorkers.set(worker, queueItem);

    this.updateStats({
      activeJobs: [...this.stats.activeJobs, queueItem.task.data],
    });

    worker.postMessage(queueItem.task);
  }

  async execute(taskData: TInput): Promise<TOutput> {
    const task: WorkerTask<TInput> = {
      id: crypto.randomUUID(),
      data: taskData,
    };

    return new Promise<TOutput>((resolve, reject) => {
      const queueItem: QueueItem<TInput, TOutput> = {
        task,
        resolve: (result) => {
          resolve(result);

          this.emit("success", { id: task.id, data: result, success: true });
        },
        reject: (error) => {
          reject(error);

          this.emit("failed", {
            id: task.id,
            error,
            input: task.data,
            success: false,
          });
        },
        retriesLeft: this.retryConfig.maxRetries,
      };

      const availableWorker = this.workers.find(
        (worker) => !this.activeWorkers.has(worker),
      );

      if (availableWorker) {
        this.runTask(availableWorker, queueItem);
      } else {
        this.queue.push(queueItem);
      }
    });
  }

  async executeAll(tasks: TInput[]): Promise<TOutput[]> {
    this.updateStats({
      total: tasks.length,
      finished: 0,
      failed: 0,
      activeJobs: [],
    });

    return Promise.all(tasks.map((task) => this.execute(task)));
  }

  async terminate(): Promise<void> {
    await Promise.all(this.workers.map((worker) => worker.terminate()));
    this.workers = [];
    this.queue = [];
    this.activeWorkers.clear();
  }

  get activeTasksCount(): number {
    return this.activeWorkers.size;
  }

  get queueSize(): number {
    return this.queue.length;
  }
}

export type WorkerFunction<
  TInput extends TInputData,
  TOutput extends TOutputData,
> = (task: WorkerTask<TInput>) => Promise<TOutput> | TOutput;
