import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import { Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import EditIcon from '@material-ui/icons/Edit';
import FlagIcon from '@material-ui/icons/Flag';
import LinkIcon from '@material-ui/icons/Link';
import React, { useContext } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Markdown from 'react-markdown';
import { useHistory } from 'react-router';
import { paths, reviewMeta } from 'src/constants';
import Season from 'src/core/components/Season';
import { ReviewsQuery } from 'src/graphql';
import { useReportReviewMutation } from 'src/graphql';

import { AuthContext } from '../Auth';
import Grow from '../Grow';
import Link from '../Link';
import { NotificationContext } from '../Notification/Notification';
import { useStyles } from './ReviewCard.styles';
import applyHighlighting from './utils/applyHighlighting';

interface Props {
  review: ReviewsQuery['reviews'][0];
  highlight?: string;
  deepLink: string;
  onCopyLinkClick: () => void;
}

const ReviewCard: React.FC<Props> = ({
  review: {
    id,
    author_id,
    course,
    semester,
    difficulty: d,
    workload: w,
    rating: r,
    body,
    created,
  },
  highlight,
  deepLink,
  onCopyLinkClick,
}) => {
  const classes = useStyles();
  const xs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'));
  const history = useHistory();
  const auth = useContext(AuthContext);
  const notification = useContext(NotificationContext);
  const [reportReview, { loading }] = useReportReviewMutation();

  const avatar = xs ? null : <Season season={semester.season} />;

  const title = xs ? course.id : `${course.id}: ${course.name}`;
  const subheader = new Date(created).toLocaleString();
  const difficulty = d && reviewMeta.translateDifficulty(d);
  const rating = r && reviewMeta.translateRating(r);
  const workload = w && `${w} hrs/wk`;

  const chips: Array<ChipProps & { tooltip: string; dataCy: string }> = [
    {
      className: (classes as any)[`difficulty${d}`],
      label: difficulty,
      tooltip: 'Difficulty',
      dataCy: 'review_card:difficulty',
    },
    {
      className: (classes as any)[`rating${r}`],
      label: rating,
      tooltip: 'Rating',
      dataCy: 'review_card:rating',
    },
    {
      label: workload,
      tooltip: 'Workload',
      dataCy: 'review_card:workload',
    },
  ].filter((chip) => Boolean(chip?.label));
  xs && chips.pop() && chips.pop();

  const handleEditClick = () => history.push(paths.review.update(id));
  const handleCopyLinkClick = () => setTimeout(onCopyLinkClick, 0);
  const handleReportClick = async () => {
    await reportReview({ variables: { id } });
    notification?.success('Thanks for reporting this review.');
  };

  const action = xs ? null : auth.user?.uid === author_id ? (
    <IconButton
      onClick={handleEditClick}
      color="inherit"
      data-cy="review_card:edit_button"
    >
      <EditIcon />
    </IconButton>
  ) : (
    <>
      <CopyToClipboard text={deepLink} onCopy={handleCopyLinkClick}>
        <Tooltip title="Copy link">
          <IconButton color="inherit">
            <LinkIcon />
          </IconButton>
        </Tooltip>
      </CopyToClipboard>
      {auth.authenticated && (
        <Tooltip title="Report questionable or inappropriate content">
          <IconButton
            color="inherit"
            onClick={handleReportClick}
            disabled={loading}
          >
            <FlagIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  return (
    <Card className={classes.card} data-cy="review_card">
      <CardHeader
        className={classes.header}
        avatar={avatar}
        title={course.link ? <Link to={course.link}>{title}</Link> : title}
        subheader={subheader}
        action={action}
      />
      <CardContent className={classes.content} data-cy="review_card:content">
        {body ? (
          <Markdown>{applyHighlighting(body, highlight)}</Markdown>
        ) : (
          <Typography variant="body2" color="textSecondary" component="p">
            No commentary provided.
          </Typography>
        )}
      </CardContent>
      <CardActions className={classes.actions}>
        <Chip
          color="primary"
          data-cy="review_card:semester"
          label={semester.name}
          variant="outlined"
        />
        <Grow />
        {chips.map(({ tooltip, label, dataCy, ...rest }) => (
          <Tooltip title={tooltip} key={label!.toString()}>
            <Chip label={label} variant="outlined" {...rest} data-cy={dataCy} />
          </Tooltip>
        ))}
      </CardActions>
    </Card>
  );
};

export default ReviewCard;
