import {
  AuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@firebase/auth';
import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FirebaseContext } from 'src/components/Firebase';
import { NotificationContext } from 'src/components/Notification';

import Login, { FormData } from './Login';

const LoginContainer: React.FC = () => {
  const firebase = useContext(FirebaseContext);
  const notification = useContext(NotificationContext)!;
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async ({ email, password }: FormData) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(firebase.auth, email, password);
    } catch {
      notification.error('Invalid email and password combination.');
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: AuthProvider) => {
    setLoading(true);
    try {
      await signInWithPopup(firebase.auth, provider);
    } catch {
      notification.error(
        'Error logging in. Make sure to grant the requested permissions.',
      );
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet title="Login">
        <meta name="description" content="Sign in to start posting reviews." />
      </Helmet>
      <Login
        disabled={loading}
        onSubmit={handleSubmit}
        onSocialLogin={handleSocialLogin}
      />
    </>
  );
};

export default LoginContainer;
