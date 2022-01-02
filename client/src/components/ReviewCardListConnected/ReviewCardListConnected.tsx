import React from 'react';
import { ReviewSortKey as SortKey } from 'src/core';
import { ReviewsQuery } from 'src/graphql';

import ReviewCardList from '../ReviewCardList';
import Visibility from '../Visibility';
import Toolbar from './components/Toolbar';

interface Props {
  reviews?: ReviewsQuery['reviews'];
  onReportClick: (id: string) => void;
  courseFilter?: string[];
  onCourseFilterChange: (filter: string[]) => void;
  semesterFilter?: string[];
  onSemesterFilterChange: (filter: string[]) => void;
  difficultyFilter?: number[];
  onDifficultyFilterChange: (filter: number[]) => void;
  sortKey?: SortKey;
  onSortKeyChange: (key: SortKey) => void;
  onLoadMore?: () => void;
  loading?: boolean;
  before?: JSX.Element;
  highlight?: string;
}

const ReviewCardListConnected: React.FC<Props> = ({
  reviews,
  onReportClick,
  courseFilter,
  onCourseFilterChange,
  semesterFilter,
  onSemesterFilterChange,
  difficultyFilter,
  onDifficultyFilterChange,
  sortKey,
  onSortKeyChange,
  onLoadMore,
  loading,
  before,
  highlight,
}) => (
  <ReviewCardList
    loading={loading}
    reviews={reviews}
    onReportClick={onReportClick}
    highlight={highlight}
    before={
      <>
        {before}
        <Toolbar
          courseFilter={courseFilter}
          onCourseFilterChange={onCourseFilterChange}
          semesterFilter={semesterFilter}
          onSemesterFilterChange={onSemesterFilterChange}
          difficultyFilter={difficultyFilter}
          onDifficultyFilterChange={onDifficultyFilterChange}
          sortKey={sortKey}
          onSortKeyChange={onSortKeyChange}
        />
      </>
    }
    after={<Visibility onVisible={onLoadMore} />}
  />
);

export default ReviewCardListConnected;
