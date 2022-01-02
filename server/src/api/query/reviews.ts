import { searchReviews as search } from '../../functions';
import { QueryResolvers } from '../../graphql';
import { mapReview } from '../../mappers';
import { Review } from '../../models';

type Resolver = QueryResolvers['reviews'];

export const resolver: Resolver = async (
  _,
  {
    query,
    offset,
    limit,
    is_mine,
    course_ids,
    semester_ids,
    difficulties,
    order_by_desc,
  },
  { user },
) => {
  if (query) {
    const ids = await search({ query, offset, limit, sort: order_by_desc });
    return ids.length
      ? await Review.eagerQuery()
          .whereIn('id', ids)
          .modify((qb) => {
            order_by_desc.forEach((column) => qb.orderBy(column, 'desc'));
          })
          .then((reviews) => reviews.map((review) => mapReview(review, user)))
      : [];
  }

  return await Review.eagerQuery()
    .modify((qb) => {
      qb.offset(offset).limit(limit);
      course_ids.length && qb.whereIn('course_id', course_ids);
      is_mine && user != null && qb.where('author_id', user.id);
      semester_ids.length && qb.whereIn('semester_id', semester_ids);
      difficulties.length && qb.whereIn('difficulty', difficulties);
      order_by_desc.forEach((column) => qb.orderBy(column, 'desc'));
    })
    .then((reviews) => reviews.map((review) => mapReview(review, user)));
};
