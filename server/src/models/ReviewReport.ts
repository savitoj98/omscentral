import { Domain } from './Domain';
import { withDates } from './utils';

export class ReviewReport extends withDates(Domain) {
  id!: string;
  review_id!: string;
  user_id!: string;

  static tableName = 'omscentral_review_report';

  static jsonSchema = {
    type: 'object',
    required: ['id', 'review_id', 'user_id'],
    properties: {
      id: { type: 'string' },
      course_id: { type: 'string' },
      user_id: { type: 'string' },
      created: { type: 'number' },
      updated: { type: ['number', 'null'] },
    },
  };
}
