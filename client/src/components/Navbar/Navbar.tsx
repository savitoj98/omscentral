import { logEvent } from '@firebase/analytics';
import AppBar from '@material-ui/core/AppBar';
import { Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { paths } from 'src/constants';
import { QueryParam } from 'src/core';
import useQueryParams from 'src/core/hooks/useQueryParams';

import { AuthContext } from '../Auth';
import { FirebaseContext } from '../Firebase';
import Grow from '../Grow';
import Link from '../Link';
import NavbarButton from './components/NavbarButton';
import SearchInput from './components/SearchInput';
import UserMenu from './components/UserMenu';
import { useStyles } from './Navbar.styles';

const Navbar: React.FC = () => {
  const classes = useStyles();
  const xs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'));
  const firebase = useContext(FirebaseContext);
  const auth = useContext(AuthContext);
  const history = useHistory();
  const params = useQueryParams<{ [QueryParam.Query]: string }>();
  const [query, setQuery] = useState(params.query || '');

  useEffect(() => {
    setQuery(params.query || '');
  }, [params.query]);

  const handleLogoutClick = async () => {
    await firebase.auth.signOut();
    logEvent(firebase.analytics, 'logout');
  };

  const handleSearchSubmit = (query: string) => {
    if (query) {
      history.push(paths.reviews({ query }));
      logEvent(firebase.analytics, 'search', { search_term: query });
    }
  };

  return (
    <div className={classes.root} data-cy="navbar">
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            OMSCentral
          </Typography>
          <NavbarButton path={paths.courses}>Courses</NavbarButton>
          {!xs && <NavbarButton path={paths.reviews()}>Reviews</NavbarButton>}
          {!xs && <NavbarButton path={paths.trends}>Trends</NavbarButton>}
          {!xs && (
            <SearchInput
              value={query}
              onChange={setQuery}
              onSubmit={handleSearchSubmit}
            />
          )}
          <Grow />
          {auth.initializing ? null : auth.authenticated ? (
            <NavbarButton
              onClick={handleLogoutClick}
              path={paths.login}
              data-cy="logout"
            >
              {xs ? <LogoutIcon /> : 'Logout'}
            </NavbarButton>
          ) : (
            <NavbarButton path={paths.login}>Login</NavbarButton>
          )}
          {auth.initializing ? null : auth.authenticated && <UserMenu />}
          <Link
            to="https://buymeacoffee.com/omscentral"
            className={classes.coffee}
          >
            ☕️
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
