import Alert from '@material-ui/lab/Alert';
import React from 'react';

import { useStyles } from './Banner.styles';

interface Props {
  message: string;
}

const Banner: React.FC<Props> = ({ message }) => {
  const classes = useStyles();

  return (
    <Alert severity="info" className={classes.alert}>
      {message}
    </Alert>
  );
};

export default Banner;
