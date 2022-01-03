import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Loading from 'src/components/Loading';
import Metrics from 'src/components/Metrics';
import Paper from 'src/components/Paper';
import { Nullable } from 'src/core';
import { Course, CourseSeriesItem } from 'src/graphql';

import CourseSelect from './components/CourseSelect';
import TrendsChart from './components/TrendsChart';
import TrendsGuidance from './components/TrendsGuidance';

interface Props {
  loading?: boolean;
  course: Nullable<Course>;
  courses?: Course[];
  courseSeries?: CourseSeriesItem[];
  onCourseChange: (course: Nullable<Course>) => void;
}

const Trends: React.FC<Props> = ({
  loading = false,
  course,
  courses,
  courseSeries: series,
  onCourseChange,
}) => {
  if (!courses?.length) {
    return null;
  }

  return (
    <Container component="main" maxWidth="xl" data-cy="courses">
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TrendsGuidance />
          </Grid>
          <Grid item xs={12}>
            <CourseSelect
              disabled={loading}
              options={courses}
              onChange={onCourseChange}
            />
          </Grid>
          {course != null && (
            <Grid item xs={12}>
              <Metrics course={course} />
            </Grid>
          )}
          {loading && <Loading />}
          {course != null && series != null && (
            <>
              {hasSomeValue(series, 'avg_workload') && (
                <Grid item xs={12}>
                  <TrendsChart
                    data={series}
                    title="Avg. Workload"
                    field="avg_workload"
                    max={nextMultipleOf(max(series, 'avg_workload'), 25)}
                    reference={course.metric?.reviews.workload.mean}
                  />
                </Grid>
              )}
              {hasSomeValue(series, 'avg_difficulty') && (
                <Grid item xs={12}>
                  <TrendsChart
                    data={series}
                    title="Avg. Difficulty"
                    field="avg_difficulty"
                    max={5}
                    reference={course.metric?.reviews.difficulty.mean}
                  />
                </Grid>
              )}
              {hasSomeValue(series, 'avg_rating') && (
                <Grid item xs={12}>
                  <TrendsChart
                    data={series}
                    title="Avg. Rating"
                    field="avg_rating"
                    max={5}
                    reference={course.metric?.reviews.rating.mean}
                  />
                </Grid>
              )}
              {hasSomeValue(series, 'count') && (
                <Grid item xs={12}>
                  <TrendsChart
                    data={series}
                    title="Reviews"
                    field="count"
                    max={nextMultipleOf(max(series, 'count'), 50)}
                    reference={divide(
                      course.metric?.reviews.count,
                      series.length,
                    )}
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Trends;

const hasSomeValue = (
  series: CourseSeriesItem[],
  field: keyof Omit<CourseSeriesItem, 'semester' | '__typename'>,
): boolean => series.some((item) => item[field] > 0);

const max = (
  series: CourseSeriesItem[],
  field: keyof Omit<CourseSeriesItem, 'semester' | '__typename'>,
): number => series.reduce((max, item) => Math.max(max, item[field]), 0);

const nextMultipleOf = (value: number, multipleOf: number): number =>
  (Math.floor(value / multipleOf) + 1) * multipleOf;

const divide = (
  numerator: number | undefined,
  denominator: number,
): number | undefined =>
  numerator != null && denominator !== 0
    ? Math.round((numerator / denominator) * 100) / 100
    : undefined;
