import { ReviewReport as GraphQLReviewReport } from '../graphql';
import { ReviewReport, User } from '../models';
import { Mapper } from './types';

export const mapReviewReport: Mapper<ReviewReport, GraphQLReviewReport> = (
  reviewReport: ReviewReport,
  user: User | null,
): GraphQLReviewReport => {
  return {
    ...reviewReport,
    is_mine: user != null && reviewReport.user_id === user.id,
  };
};
