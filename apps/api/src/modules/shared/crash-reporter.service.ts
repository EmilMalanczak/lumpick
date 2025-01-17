import * as Sentry from "@sentry/node";

export class CrashReporterService {
  report(error: any): string {
    return Sentry.captureException(error);
  }
}
