import { unauthorized } from '@hapi/boom';

import { learnMore } from '../../functions';
import { MutationResolvers } from '../../graphql';

type Resolver = MutationResolvers['learnMore'];

export const resolver: Resolver = async (_, { input }, { user }) => {
  if (!user) {
    throw unauthorized();
  }

  return {
    success: await learnMore(user, input.message),
  };
};
