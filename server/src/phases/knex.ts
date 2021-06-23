import knex from 'knex';
import { Model } from 'objection';

import knexConfig from '../../database/knexfile';
import { PhaseFunction } from '../components';

export const phase: PhaseFunction = (app, next) => {
  Model.knex(knex(knexConfig));

  next();
};
