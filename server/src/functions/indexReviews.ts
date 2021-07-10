import { flatMap, omit } from 'lodash';
import { ModelObject } from 'objection';

import { logger, search } from '../components';
import { reviewsIndex } from '../constants';
import { Review } from '../models';

const blocklistProps: (keyof Review)[] = ['author', 'author_id'];

const getReviewJSON = (review: Review): Partial<ModelObject<Review>> =>
  omit(review.toJSON(), blocklistProps);

export const indexReviews = async (): Promise<void> => {
  if (await search.indexExists(reviewsIndex)) {
    return search.refreshIndex(reviewsIndex);
  }

  await search.createIndex(reviewsIndex, {
    properties: {
      id: { type: 'keyword' },
      body: { type: 'text' },
      course_id: { type: 'keyword' },
      course: {
        properties: {
          id: { type: 'keyword' },
          department: { type: 'keyword' },
          number: { type: 'keyword' },
          name: { type: 'text' },
          foundational: { type: 'boolean' },
          deprecated: { type: 'boolean' },
        },
      },
      semester_id: { type: 'keyword' },
      semester: {
        properties: {
          year: { type: 'keyword' },
          name: { type: 'text' },
        },
      },
    },
  });

  logger.debug('functions(indexReviews): bulkIndex BEGIN');
  const reviews = await Review.eagerQuery();
  await search.bulkIndex({
    body: flatMap(reviews, (review) => [
      {
        index: {
          _index: reviewsIndex,
        },
      },
      getReviewJSON(review),
    ]),
  });
  logger.debug('functions(indexReviews): bulkIndex END');
};

export const indexReview = async (
  review: Review,
  mode: 'create' | 'update',
): Promise<void> => {
  const doc = getReviewJSON(review);
  if (mode === 'create') {
    await search.createDocument(reviewsIndex, doc);
  } else {
    await search.updateDocument(reviewsIndex, { term: { id: review.id } }, doc);
  }
};

export const unindexReview = async (review: Review): Promise<void> => {
  await search.deleteDocument(reviewsIndex, { term: { id: review.id } });
};
