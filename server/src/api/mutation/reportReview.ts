import { forbidden, notFound } from '@hapi/boom';

import { getReview, reportReview } from '../../functions';
import { MutationResolvers } from '../../graphql';

type Resolver = MutationResolvers['reportReview'];

export const resolver: Resolver = async (_, { id }, { user }) => {
  if (!user) {
    throw forbidden();
  }

  const review = await getReview(id);
  if (!review) {
    throw notFound();
  }

  try {
    await reportReview(review, user);
    return true;
  } catch {
    return false;
  }
};
