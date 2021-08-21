import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing'; // eslint-disable-line @typescript-eslint/no-unused-vars

import { PhaseFunction } from '../components';
import { appConfig, sentryConfig } from '../config';

export const phase: PhaseFunction = (app, next) => {
  const { dsn } = sentryConfig;

  dsn && Sentry.init({ dsn, release: appConfig.release });

  next();
};
