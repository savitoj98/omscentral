import { PartialModelObject as PMO } from 'objection';

import { Review, User } from '../models';
import { indexReview } from './indexReviews';
import { upsertReviewCourseMetrics } from './utils';

export const updateReview = async (
  review: PMO<Review>,
  user: User,
): Promise<Review> => {
  const updated = await Review.eagerQuery().updateAndFetchById(
    review.id as string,
    {
      ...review,
      author_id: user.id,
    },
  );

  await Promise.all([
    upsertReviewCourseMetrics(updated),
    indexReview(updated, 'update'),
  ]);

  return updated;
};
