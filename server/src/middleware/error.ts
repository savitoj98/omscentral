import { Boom, boomify, unauthorized } from '@hapi/boom';
import * as Sentry from '@sentry/node';
import { ErrorRequestHandler } from 'express';

import { logger } from '../components';
import { appConfig } from '../config';
import { Request } from '../types';

const parseError = (error: Error | Boom | any): Boom =>
  error instanceof Boom
    ? error
    : boomify(new Error(error), {
        statusCode: error.status || error.statusCode || 500,
      });

export const middleware =
  (): ErrorRequestHandler => (error: Error | Boom | any, req, res, next) => {
    if (!error) {
      return next();
    }

    logger.error('middleware(error):', error);

    if (error?.message === 'CORS') {
      error = unauthorized('CORS');
    }

    Sentry.captureException(error, {
      extra: {
        req: JSON.parse(JSON.stringify(req)),
      },
    });

    const { output } = parseError(error);

    return res.status(output.statusCode).json({
      ...output.payload,
      stack:
        appConfig.environment === 'local'
          ? (error.stack || '').split(/\n\s+/g)
          : undefined,
    });
  };
