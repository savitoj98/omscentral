import { notFound } from '@hapi/boom';

import { getReview, reportReview } from '../../functions';
import { MutationResolvers } from '../../graphql';

type Resolver = MutationResolvers['reportReview'];

export const resolver: Resolver = async (_, { id }) => {
  const review = await getReview(id);
  if (!review) {
    throw notFound();
  }

  try {
    await reportReview(id);
    return true;
  } catch {
    return false;
  }
};
