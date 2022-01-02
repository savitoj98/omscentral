import Knex from 'knex';

import { Review, ReviewReport, User } from '../../src/models';
import { createTable, dropTable } from '../utils';

exports.up = async (knex: Knex) => {
  await createTable(knex, ReviewReport.tableName, (tb) => {
    tb.string('id').notNullable().primary();

    tb.string('review_id')
      .notNullable()
      .references('id')
      .inTable(Review.tableName)
      .index(`index_${ReviewReport.tableName}_review_id`)
      .onDelete('CASCADE');

    tb.string('user_id')
      .notNullable()
      .references('id')
      .inTable(User.tableName)
      .index(`index_${ReviewReport.tableName}_user_id`)
      .onDelete('CASCADE');

    tb.unique(['review_id', 'user_id']);

    tb.bigInteger('created').notNullable();
    tb.bigInteger('updated').nullable();
  });
};

exports.down = async (knex: Knex) => {
  await dropTable(knex, ReviewReport.tableName);
};
