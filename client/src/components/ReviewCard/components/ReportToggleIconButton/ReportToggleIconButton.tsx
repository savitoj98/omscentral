import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ReportIcon from '@material-ui/icons/Report';
import ReportOffIcon from '@material-ui/icons/ReportOff';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import React, { useContext } from 'react';
import { AuthContext } from 'src/components/Auth';
import { NotificationContext } from 'src/components/Notification';
import { ReviewsQuery } from 'src/graphql';

type Review = ReviewsQuery['reviews'][0];

const THRESHOLD = 2;

interface Props {
  review: Review;
  onClick: () => void;
  disabled?: boolean;
}

const ReportToggleIconButton: React.FC<Props> = ({
  review,
  onClick,
  disabled = false,
}) => {
  const auth = useContext(AuthContext);
  const notification = useContext(NotificationContext)!;

  const { icon, tooltip, message } = getConfig(review);

  const handleReportClick = async () => {
    if (auth.authenticated) {
      await onClick();
      notification.success(message);
    } else {
      notification.warning('You must login first to report a review.');
    }
  };

  return (
    <Tooltip title={tooltip}>
      <IconButton
        color="inherit"
        onClick={handleReportClick}
        disabled={disabled}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default ReportToggleIconButton;

const getConfig = (
  review: Review,
): {
  icon: JSX.Element;
  tooltip: string;
  message: string;
} => {
  const isReported = review.reports.some(({ is_mine }) => is_mine);
  if (isReported) {
    return {
      icon: <ReportOffIcon />,
      tooltip: 'Unreport',
      message: 'Review report removed.',
    };
  }

  const isOnTheVergeOfBeingHidden = review.reports.length + 1 >= THRESHOLD;
  if (isOnTheVergeOfBeingHidden) {
    return {
      icon: <VisibilityOffIcon />,
      tooltip: `Report inappropriate content (and hide review content)`,
      message: 'Report content hidden.',
    };
  }

  return {
    icon: <ReportIcon />,
    tooltip: 'Report inappropriate content',
    message: `Review reported. If someone else also reports this review, its content will be hidden.`,
  };
};
