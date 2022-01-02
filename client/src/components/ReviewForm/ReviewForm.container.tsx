import { logEvent } from '@firebase/analytics';
import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { paths } from 'src/constants';
import {
  ReviewInputType,
  ReviewQuery,
  useCoursesQuery,
  useDeleteReviewMutation,
  useInsertReviewMutation,
  useSemestersQuery,
  useUpdateReviewMutation,
} from 'src/graphql';

import { FirebaseContext } from '../Firebase';
import { NotificationContext } from '../Notification';
import ReviewForm from './ReviewForm';

interface Props {
  review?: ReviewQuery['review'];
}

const ReviewFormContainer: React.FC<Props> = ({ review }) => {
  const firebase = useContext(FirebaseContext);
  const notification = useContext(NotificationContext)!;
  const history = useHistory();

  const mode = !review ? 'make' : review.is_mine ? 'edit' : 'view';

  const [courses, semesters] = [useCoursesQuery(), useSemestersQuery()];

  const [
    [insert, { loading: creating }],
    [update, { loading: updating }],
    [remove, { loading: removing }],
  ] = [
    useInsertReviewMutation(),
    useUpdateReviewMutation(),
    useDeleteReviewMutation(),
  ];

  const handleSubmit = async (review: ReviewInputType) => {
    try {
      if (mode === 'make') {
        const result = await insert({
          variables: {
            review,
          },
        });

        logEvent(firebase.analytics, 'create_item', {
          content_type: 'review',
          content_id: result.data!.insertReview.id,
        });

        notification.success('Review published.');

        history.push(paths.course(review.course_id));
      } else if (mode === 'edit') {
        await update({ variables: { review } });

        logEvent(firebase.analytics, 'update_item', {
          content_type: 'review',
          content_id: review!.id,
        });

        notification.success('Review updated.');

        history.push(paths.course(review.course_id));
      }
    } catch {
      notification.error('Something went wrong.');
    }
  };

  const handleDelete = async () => {
    try {
      await remove({ variables: { id: review!.id } });

      logEvent(firebase.analytics, 'delete_item', {
        content_type: 'review',
        content_id: review!.id,
      });

      notification.success('Review deleted.');

      history.replace(paths.course(review!.course.id));
    } catch {
      notification.error('Something went wrong.');
    }
  };

  if (!courses.data?.courses || !semesters.data?.semesters) {
    return null;
  }

  return (
    <ReviewForm
      data={{ ...courses.data, ...semesters.data }}
      mode={mode}
      review={review}
      disabled={creating || updating || removing}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
};

export default ReviewFormContainer;
