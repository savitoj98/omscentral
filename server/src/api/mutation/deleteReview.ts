import { forbidden, notFound } from '@hapi/boom';

import { deleteReview, getReview } from '../../functions';
import { MutationResolvers } from '../../graphql';
import { mapReview } from '../../mappers';

type Resolver = MutationResolvers['deleteReview'];

export const resolver: Resolver = async (_, { id }, { user }) => {
  const review = await getReview(id).select('author_id');
  if (!review) {
    throw notFound();
  }

  if (user == null || review.author_id !== user.id) {
    throw forbidden();
  }

  return mapReview(await deleteReview(id), user);
};
