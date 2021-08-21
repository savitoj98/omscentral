import { BrowserOptions } from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

export interface SentryConfig extends BrowserOptions {
  dsn: string;
}

const name = process.env.REACT_APP_NAME || 'omscentral-client';
const version = process.env.REACT_APP_VERSION || '0.0.0';

export const config: SentryConfig = {
  release: `${name}@${version}`,
  dsn: process.env.REACT_APP_SENTRY_DSN!,
  enabled: Boolean(process.env.REACT_APP_SENTRY_DSN),
  integrations: [new Integrations.BrowserTracing()],
};
