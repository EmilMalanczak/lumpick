import * as Sentry from "@sentry/node";

type SpanOptions = {
  name: string;
  op?: string;
  attributes?: Record<string, any>;
};

export class InstrumentationService {
  startSpan<T>(options: SpanOptions, callback: () => T): T {
    return Sentry.startSpan(options, callback);
  }
}
