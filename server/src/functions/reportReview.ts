import { PartialModelObject } from 'objection';

import { ping } from '../components';
import { firebaseConfig } from '../config';
import { Review, ReviewReport, User } from '../models';
import { id } from '../utils';

export const reportReview = async (
  review: Review,
  user: User,
): Promise<void> => {
  const model: PartialModelObject<ReviewReport> = {
    review_id: review.id,
    user_id: user.id,
  };

  const report = await ReviewReport.query().findOne(model);

  if (report == null) {
    await ReviewReport.query().insert({ ...model, id: id() });
    notify(review, true);
  } else {
    await ReviewReport.query().deleteById(report.id);
    notify(review, false);
  }
};

const notify = async (review: Review, didReport: boolean): Promise<void> => {
  const deepLink = `https://${firebaseConfig.projectId}.firebaseapp.com/review/${review.id}`;
  const reportCount = review.reports.length + (didReport ? +1 : -1);

  await ping.info(`${deepLink} [${reportCount}]`);
};
