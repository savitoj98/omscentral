import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(2, 0, 0),
  },
  link: {
    fontWeight: 'bold',
  },
  avatar: {
    margin: theme.spacing(2, 'auto', 4),
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  action: {
    width: '100%',
  },
  centered: {
    textAlign: 'center',
  },
  message: {
    margin: theme.spacing(2, 0),
  },
}));
