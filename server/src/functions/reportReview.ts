import { notFound } from '@hapi/boom';

import { ping } from '../components';
import { getReview } from './getReview';

export const reportReview = async (id: string): Promise<void> => {
  const review = await getReview(id);
  if (!review) {
    throw notFound();
  }

  await ping.info(`https://omscentral.com/review/${id}`);
};
