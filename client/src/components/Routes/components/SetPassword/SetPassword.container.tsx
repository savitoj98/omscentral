import {
  confirmPasswordReset,
  signInWithEmailAndPassword,
  verifyPasswordResetCode,
} from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FirebaseContext } from 'src/components/Firebase';
import { NotificationContext } from 'src/components/Notification';
import { Nullable, QueryParam } from 'src/core';
import useQueryParams from 'src/core/hooks/useQueryParams';

import SetPassword, { FormData } from './SetPassword';

const SetPasswordContainer: React.FC = () => {
  const firebase = useContext(FirebaseContext);
  const notification = useContext(NotificationContext)!;
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<Nullable<string>>(null);
  const { oobCode = null } = useQueryParams<{ [QueryParam.OOBCode]: string }>();

  const verifyPasswordResetCodeWrapper = async () => {
    if (!oobCode) {
      notification.error(
        'The link that brought you here is missing the password reset code.',
      );
      return setError(true);
    }
    setLoading(true);
    try {
      setEmail(await verifyPasswordResetCode(firebase.auth, oobCode));
    } catch {
      setError(true);
      notification.error(
        'Your password reset link is invalid or expired. Please request another reset password link.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyPasswordResetCodeWrapper();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async ({ password }: FormData) => {
    setLoading(true);
    try {
      await confirmPasswordReset(firebase.auth, oobCode!, password);
      notification.success(`Password set, logging in...`);
      await signInWithEmailAndPassword(firebase.auth, email!, password);
    } catch (error: any) {
      notification.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet title="Set Password">
        <meta
          name="description"
          content="Set a new password for your account."
        />
      </Helmet>
      <SetPassword
        email={email}
        disabled={loading || error}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default SetPasswordContainer;
