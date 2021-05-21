import knex, { Config } from 'knex';
import { Model } from 'objection';

import { PhaseFunction } from '../components';
import { postgresConfig } from '../config';

export const phase: PhaseFunction = (app, next) => {
  const knexConfig: Config = {
    client: 'pg',
    connection: {
      connectionString: postgresConfig.connection,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };

  Model.knex(knex(knexConfig));

  next();
};
