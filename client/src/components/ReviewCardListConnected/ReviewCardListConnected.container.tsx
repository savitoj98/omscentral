import * as sentry from '@sentry/browser';
import { logEvent } from 'firebase/analytics';
import qs from 'query-string';
import React, { useContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { QueryParam, ReviewSortKey as SortKey } from 'src/core';
import useQueryParams from 'src/core/hooks/useQueryParams';
import asArray from 'src/core/utils/asArray';
import useSession from 'src/core/utils/useSessionStorage';
import { ReviewsQueryVariables, useReviewsQuery } from 'src/graphql';
import { useReportReviewMutation } from 'src/graphql';

import { FirebaseContext } from '../Firebase';
import ReviewCardListConnected from './ReviewCardListConnected';

interface Props {
  variables?: ReviewsQueryVariables;
  pagination?: boolean;
  before?: JSX.Element;
}

const ReviewCardListConnectedContainer: React.FC<Props> = ({
  variables,
  pagination = true,
  before,
}) => {
  const history = useHistory();
  const location = useLocation();
  const firebase = useContext(FirebaseContext);

  const { course, semester, difficulty, sort } = useQueryParams<{
    [QueryParam.Course]: string[];
    [QueryParam.Semester]: string[];
    [QueryParam.Sort]: SortKey;
    [QueryParam.Difficulty]: string[];
  }>();

  const courseFilter = asArray<string>(variables?.course_ids || course);
  const semesterFilter = asArray<string>(semester);
  const difficultyFilter = asArray<string>(difficulty).map((_) => Number(_));

  const sortKey = sort || SortKey.Created;

  const [paginate, setPaginate] = useState(pagination);
  const [limit, setLimit] = useSession('rcl:l', paginate ? 10 : 10e6);

  const reviewsQ = useReviewsQuery({
    variables: {
      ...(variables || {}),
      limit,
      order_by_desc: [sortKey, SortKey.Created],
      course_ids: courseFilter,
      semester_ids: semesterFilter,
      difficulties: difficultyFilter,
    },
    fetchPolicy: 'cache-and-network',
  });

  const handleLoadMore = async () => {
    if (reviewsQ.loading) {
      return;
    }

    try {
      await reviewsQ.fetchMore({
        variables: {
          offset: reviewsQ.data!.reviews!.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (fetchMoreResult?.reviews?.length) {
            setPaginate(fetchMoreResult.reviews.length >= limit);
            return {
              ...prev,
              reviews: prev.reviews.concat(fetchMoreResult.reviews),
            };
          } else {
            setPaginate(false);
            return prev;
          }
        },
      });
    } catch (error: any) {
      sentry.captureException(error, {
        level: sentry.Severity.Error,
        extra: {
          ...variables,
          last_offset: reviewsQ.data?.reviews?.length,
        },
      });
    }
  };

  const [reportReview, reportReviewM] = useReportReviewMutation();

  const handleReportClick = async (id: string) => {
    await reportReview({ variables: { id } });
    logEvent(firebase.analytics, 'report_item', {
      content_type: 'review',
      content_id: id,
    });
    await reviewsQ.refetch();
  };

  const handleFilterChange =
    <T extends string | number>(param: QueryParam, oldFilter: T[]) =>
    (newFilter: T[]) => {
      if (newFilter.sort().join(',') !== oldFilter.sort().join(',')) {
        setLimit(10);

        history.push({
          search: qs.stringify({
            ...qs.parse(location.search),
            [param]: newFilter,
          }),
        });
      }
    };

  const handleCourseFilterChange = handleFilterChange(
    QueryParam.Course,
    courseFilter,
  );

  const handleSemesterFilterChange = handleFilterChange(
    QueryParam.Semester,
    semesterFilter,
  );

  const handleDifficultyFilterChange = handleFilterChange(
    QueryParam.Difficulty,
    difficultyFilter,
  );

  const handleSortKeyChange = (key: SortKey) => {
    if (key !== sortKey) {
      setLimit(10);

      history.push({
        search: qs.stringify({
          ...qs.parse(location.search),
          sort: key,
        }),
      });
    }
  };

  return (
    <ReviewCardListConnected
      loading={reviewsQ.loading || reportReviewM.loading}
      reviews={reviewsQ.data?.reviews}
      onReportClick={handleReportClick}
      courseFilter={variables?.course_ids == null ? courseFilter : undefined}
      onCourseFilterChange={handleCourseFilterChange}
      semesterFilter={semesterFilter}
      onSemesterFilterChange={handleSemesterFilterChange}
      difficultyFilter={difficultyFilter}
      onDifficultyFilterChange={handleDifficultyFilterChange}
      sortKey={sortKey}
      onSortKeyChange={handleSortKeyChange}
      onLoadMore={
        paginate &&
        reviewsQ.data?.reviews?.length &&
        reviewsQ.data.reviews.length >= limit
          ? handleLoadMore
          : undefined
      }
      before={before}
      highlight={variables?.query?.toLowerCase()}
    />
  );
};

export default ReviewCardListConnectedContainer;
