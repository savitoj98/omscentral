/* eslint-disable simple-import-sort/imports */

import { argv } from 'yargs';

import { init } from './utils';
import { logger } from '../components';
import { Domain } from '../models';

const FROM_ID = argv['from'];
const TO_ID = argv['to'];

async function main(): Promise<void> {
  try {
    if (!FROM_ID) {
      logger.error('FROM_ID missing.');
      return;
    }
    if (!TO_ID) {
      logger.error('TO_ID missing.');
      return;
    }

    logger.info('inserting new course...');
    await Domain.knex().raw(
      `
        insert into
          omscentral_course(
            id, department, number, name, foundational, deprecated, link, aliases
          )
        select
          ? as "id", ? as "department", ? as "number", name, foundational, deprecated, link, aliases
        from
          omscentral_course
        where
          id = ?
      `,
      [TO_ID, TO_ID.split('-').shift(), TO_ID.split('-').pop(), FROM_ID],
    );

    logger.info('updating reviews...');
    await Domain.knex().raw(
      `
        update
          omscentral_review
        set
          course_id = ?
        where
          course_id = ?
      `,
      [TO_ID, FROM_ID],
    );

    logger.info('deleting old course...');
    await Domain.knex().raw(
      `
        delete from
          omscentral_course
        where
          id = ?
      `,
      [FROM_ID],
    );
  } catch (error: any) {
    logger.error(error);
  }
}

init(main);
