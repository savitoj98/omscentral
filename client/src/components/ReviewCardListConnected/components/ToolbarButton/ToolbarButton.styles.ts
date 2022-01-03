import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: 'none',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(1),
    },
  },
}));
