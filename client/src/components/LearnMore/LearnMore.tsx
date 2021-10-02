// import Avatar from '@material-ui/core/Avatar';
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
// import avatarImageUri from './mehmet.jpg';

const LearnMore: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const notification = useContext(NotificationContext);
  const [learnMore, { loading }] = useLearnMoreMutation();

  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useLocal<boolean>('/c:e3e4', false);
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
      notification?.success("Thank you. I'll be in touch soon!");
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
        I&apos;m <Link to="https://github.com/mehmetbajin">Mehmet</Link> (the
        creator of omscentral.com) and my team is hiring at Facebook.{' '}
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
          Ready to solve privacy for the world? 🌎
        </DialogTitle>
        <DialogContent>
          {/* <Avatar
            alt="Mehmet Bajin"
            src={avatarImageUri}
            className={classes.avatar}
          /> */}
          <DialogContentText>
            Facebook is hiring{' '}
            <Link to="https://www.levels.fyi/company/Facebook/salaries/">
              E3 and E4
            </Link>{' '}
            software engineers to work on privacy. Prefer US/Eastern time zone
            candidates. 0-4 years of experience. Remote OK.
            <br />
            <br />
            Interested?
            <br />
            <br />
            Then shoot me a message, and I&apos;ll be in touch with next
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
