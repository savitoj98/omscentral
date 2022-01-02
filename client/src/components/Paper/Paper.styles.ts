import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(4, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));
