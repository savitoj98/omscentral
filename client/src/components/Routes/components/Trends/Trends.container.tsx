import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Nullable } from 'src/core';
import { Course, useCourseSeriesLazyQuery, useCoursesQuery } from 'src/graphql';

import Trends from './Trends';

const LOOKBACK_YEAR = new Date().getFullYear() - 5;

const TrendsContainer: React.FC = () => {
  const [course, setCourse] = useState<Nullable<Course>>(null);
  const courses = useCoursesQuery();
  const [fetchCourseSeries, courseSeries] = useCourseSeriesLazyQuery();

  const handleCourseChange = (course: Nullable<Course>) => {
    setCourse(course);
  };

  useEffect(() => {
    if (course?.id != null) {
      fetchCourseSeries({ variables: { id: course.id } });
    }
  }, [course?.id, fetchCourseSeries]);

  return (
    <>
      <Helmet title="Trends">
        <meta
          name="description"
          content="Historical trends for course difficulty, workload, and ratings across all semesters."
        />
      </Helmet>
      <Trends
        loading={courses.loading || courseSeries.loading}
        course={course}
        courses={courses.data?.courses}
        courseSeries={courseSeries.data?.courseSeries.filter(
          (item) => item.semester.year >= LOOKBACK_YEAR,
        )}
        onCourseChange={handleCourseChange}
      />
    </>
  );
};

export default TrendsContainer;
