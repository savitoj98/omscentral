import { badRequest, forbidden, notFound } from '@hapi/boom';

import { getReview, updateReview } from '../../functions';
import { MutationResolvers } from '../../graphql';
import { mapReview } from '../../mappers';
import { reviewSchema } from '../schema';

type Resolver = MutationResolvers['updateReview'];

export const resolver: Resolver = async (_, { review }, { user }) => {
  const existing = await getReview(review.id).select('author_id');
  if (!existing) {
    throw notFound();
  }

  if (user == null || existing.author_id !== user.id) {
    throw forbidden();
  }

  const { value, error } = await reviewSchema.validate(review);
  if (error) {
    throw badRequest(error.message);
  }

  return mapReview(await updateReview(value, user), user);
};
