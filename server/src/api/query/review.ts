import { notFound } from '@hapi/boom';

import { getReview } from '../../functions';
import { QueryResolvers } from '../../graphql';
import { mapReview } from '../../mappers';

type Resolver = QueryResolvers['review'];

export const resolver: Resolver = async (_, { id }, { user }) => {
  const review = await getReview(id);
  if (!review) {
    throw notFound();
  }
  return mapReview(review, user);
};
