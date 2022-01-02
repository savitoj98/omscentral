import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ReportIcon from '@material-ui/icons/Report';
import ReportOffIcon from '@material-ui/icons/ReportOff';
import React, { useContext, useState } from 'react';
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

  const [isReported, setIsReported] = useState(
    review.reports.some(({ is_mine }) => is_mine),
  );
  const isOnTheVergeOfBeingHidden = review.reports.length + 1 >= THRESHOLD;

  const { icon, tooltip, message } = getConfig(
    isReported,
    isOnTheVergeOfBeingHidden,
  );

  const handleReportClick = async () => {
    if (auth.authenticated) {
      await onClick();
      notification.success(message);
      setIsReported(!isReported);
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
  isReported: boolean,
  isOnTheVergeOfBeingHidden: boolean,
): {
  icon: JSX.Element;
  tooltip: string;
  message: string;
} => {
  if (isReported) {
    return {
      icon: <ReportOffIcon />,
      tooltip: 'Undo',
      message: 'Review report undone.',
    };
  }

  if (isOnTheVergeOfBeingHidden) {
    return {
      icon: <ReportIcon />,
      tooltip: `Report inappropriate content (and hide review content)`,
      message: 'Report content will now be hidden.',
    };
  }

  return {
    icon: <ReportIcon />,
    tooltip: 'Report inappropriate content',
    message: `Review reported. If someone else also reports this review, its content will be hidden.`,
  };
};
