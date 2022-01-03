import React from 'react';
import Metrics from 'src/components/Metrics';
import ReviewCardListConnected from 'src/components/ReviewCardListConnected';
import { Course as GraphQLCourse } from 'src/graphql';

import { useStyles } from './Course.styles';

interface Props {
  course: GraphQLCourse;
}

const Course: React.FC<Props> = ({ course }) => {
  const classes = useStyles();

  return (
    <ReviewCardListConnected
      variables={{ course_ids: [course.id] }}
      before={<Metrics className={classes.metrics} course={course} />}
    />
  );
};

export default Course;
