import { badRequest, forbidden } from '@hapi/boom';

import { insertReview } from '../../functions';
import { MutationResolvers } from '../../graphql';
import { mapReview } from '../../mappers';
import { reviewSchema } from '../schema';

type Resolver = MutationResolvers['insertReview'];

export const resolver: Resolver = async (_, { review }, { user }) => {
  if (user == null) {
    throw forbidden();
  }

  const { value, error } = await reviewSchema.validate(review);
  if (error) {
    throw badRequest(error.message);
  }

  return mapReview(await insertReview(value, user), user);
};
