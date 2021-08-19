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

const LearnMore: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const notification = useContext(NotificationContext);
  const [learnMore, { loading }] = useLearnMoreMutation();

  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useLocal<boolean>('/c:submitted', false);
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
        <AlertTitle>Facebook is hiring!</AlertTitle>
        FBDC is hiring ML engineers, SWEs, and other roles to help solve privacy
        for the world. Remote allowed.{' '}
        <Link to="#" onClick={handleOpen} className={classes.link}>
          Learn more →
        </Link>
      </Alert>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="learn-more-dialog-title"
      >
        <DialogTitle id="learn-more-dialog-title">
          Facebook is hiring!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hi, there! I&apos;m Mehmet, the person behind omscentral.com.
            <br />
            <br />
            I&apos;m a staff SWE at Facebook DC, and we&apos;re hiring ML
            engineers and other roles to help solve privacy for the world. We
            know we can&apos;t do this alone, so thank you for reaching out.
            <br />
            <br />
            Once you submit this form, I&apos;ll be in touch with next steps.
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={!message || loading}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LearnMore;
