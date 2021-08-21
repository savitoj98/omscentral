import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { AlertTitle } from '@material-ui/lab';
import Alert from '@material-ui/lab/Alert';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { paths } from 'src/constants';
import useLocal from 'src/core/utils/useLocalStorage';
import { useLearnMoreMutation } from 'src/graphql';

import { AuthContext } from '../Auth';
import Link from '../Link';
import { NotificationContext } from '../Notification';
import { useStyles } from './LearnMore.styles';
import avatarImageUri from './mehmet.jpg';

const LearnMore: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const notification = useContext(NotificationContext);
  const [learnMore, { loading }] = useLearnMoreMutation();

  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useLocal<boolean>('/c:coaching', false);
  const [message, setMessage] = useState('');

  const handleOpen = () => {
    if (auth.authenticated) {
      setMessage('');
      setOpen(true);
    } else {
      history.push(paths.login);
      notification?.warning('Please login first so I can follow up with you!');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (): Promise<void> => {
    const result = await learnMore({ variables: { input: { message } } });
    if (result.data?.learnMore.success) {
      setOpen(false);
      setSubmitted(true);
      notification?.success(
        "Thank you for your interest. I'll be in touch within 24 hours!",
      );
    } else {
      notification?.error('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return null;
  }

  return (
    <Container component="main" maxWidth="xl" className={classes.container}>
      <Alert severity="info">
        <AlertTitle>Looking for a career in FAANG?</AlertTitle>
        I&apos;m Mehmet (the creator of omscentral.com) and I&apos;ve worked at
        and landed job offers from Facebook, Amazon, Apple, Netflix, and Google.
        I think we can do great things together.{' '}
        <Link to="#" onClick={handleOpen} className={classes.link}>
          Learn more →
        </Link>
      </Alert>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="learn-more-dialog-title"
      >
        <DialogTitle id="learn-more-dialog-title" className={classes.centered}>
          Hi there, I&apos;m Mehmet! 😄
        </DialogTitle>
        <DialogContent>
          <Avatar
            alt="Mehmet Bajin"
            src={avatarImageUri}
            className={classes.avatar}
          />
          <DialogContentText>
            Thank you for being here. Your continued support means the world to
            me. 🙏
            <br />
            <br />
            As a software engineer in FAANG, I love helping others find joy and
            fulfillment in their careers. After graduating from Georgia Tech in
            2009, I went to Emory medical school only to drop out during my
            first year. Now, I help solve privacy for the world at Facebook.
            Along the way, I&apos;ve worked at and landed job offers from every
            FAANG company, and I know what it takes to be successful in the tech
            industry. 😎
            <br />
            <br />
            I&apos;d love to get to know you better and discover the great
            things we can accomplish together, whether it&apos;s a career in big
            tech, freelancing at a multi-national, or starting your own
            business. 🥳
            <br />
            <br />
            Once you shoot me a message, I&apos;ll be in touch with next
            steps&mdash;looking forward to hearing from you! 🙇‍♂️
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            id="message"
            label="Message"
            margin="dense"
            multiline
            onChange={(event) => setMessage(event.target.value)}
            required
            type="text"
            value={message}
            className={classes.message}
          />
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            onClick={handleClose}
            color="secondary"
            variant="contained"
            className={classes.action}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={!message || loading}
            className={classes.action}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LearnMore;
