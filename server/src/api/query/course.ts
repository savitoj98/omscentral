import { notFound } from '@hapi/boom';

import { getCourseMetrics } from '../../functions';
import { QueryResolvers } from '../../graphql';
import { Course } from '../../models';

type Resolver = QueryResolvers['course'];

export const resolver: Resolver = async (
  _,
  { id, semester_ids, difficulties },
) => {
  const course = await Course.eagerQuery().findById(id);
  if (!course) {
    throw notFound();
  }

  if (semester_ids.length > 0 || difficulties.length > 0) {
    const [metric] = await getCourseMetrics([id], semester_ids, difficulties);
    return { ...course, metric };
  }

  return course;
};
