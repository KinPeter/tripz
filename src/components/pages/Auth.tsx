import { useStore } from '../../store';
import { useAuthApi } from '../../hooks/useAuthApi.ts';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { USER_KEY } from '../../lib/constants.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseHash } from '../../lib/hashParser.ts';
import { Button, Center, Flex, Loader, TextInput } from '@mantine/core';
import { Icon123, IconAt, IconPlaneDeparture } from '@tabler/icons-react';
import { theme } from '../../lib/mantine.ts';
import styles from './Auth.module.scss';
import { notifications } from '@mantine/notifications';
import { hasLength, isEmail, useForm } from '@mantine/form';

enum AuthProgressState {
  INITIAL,
  VERIFYING,
}

const Auth = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const handleLogin = useStore(state => state.handleLogin);
  const handleLogout = useStore(state => state.handleLogout);
  const { login, verify, refresh } = useAuthApi();
  const [authProgressState, setAuthProgressState] = useState<AuthProgressState>(
    AuthProgressState.INITIAL
  );

  const emailForm = useForm({
    initialValues: { email: '' },
    validate: {
      email: isEmail(),
    },
    validateInputOnChange: true,
  });

  const otpForm = useForm({
    initialValues: { otpToken: '' },
    validate: {
      otpToken: hasLength(6),
    },
    validateInputOnChange: true,
  });

  const {
    mutate: startLogin,
    data: loginData,
    error: loginError,
    isPending: loginLoading,
  } = useMutation({
    mutationFn: () => login(emailForm.values.email),
  });

  const {
    mutate: startVerify,
    data: verifyData,
    error: verifyError,
    isPending: verifyLoading,
  } = useMutation({
    mutationFn: () => verify(emailForm.values.email, otpForm.values.otpToken),
  });

  const {
    mutate: refreshSession,
    data: refreshData,
    error: refreshError,
    isPending: refreshLoading,
  } = useMutation({
    mutationFn: refresh,
  });

  useEffect(() => {
    if (hash) {
      const parsed = parseHash(hash);
      if (parsed.success) {
        // handleLogin(parsed.payload as User);
        navigate('/home');
      } else {
        notifications.show({
          title: 'Oops!',
          message:
            'Could not log you in. ' +
            (parsed.payload as Record<string, string>).error_description?.replace(/\+/g, ' '),
          color: 'red',
        });
        handleLogout();
      }
    } else {
      const storedSessionData = localStorage.getItem(USER_KEY);
      if (storedSessionData) {
        refreshSession();
      }
    }
  }, [hash, refreshSession, handleLogin, handleLogout, navigate]);

  useEffect(() => {
    if (refreshData) {
      handleLogin(refreshData);
      navigate('/home');
    } else if (refreshError) {
      notifications.show({
        title: 'Oops!',
        message: refreshError.message + ' Try to log in again.',
        color: 'red',
      });
      setAuthProgressState(AuthProgressState.INITIAL);
      handleLogout();
    }
  }, [refreshData, refreshError, handleLogin, handleLogout, navigate]);

  useEffect(() => {
    if (loginData) {
      setAuthProgressState(AuthProgressState.VERIFYING);
      notifications.show({
        title: 'Great!',
        message: 'Check your inbox, and use the one time password or click the magic link.',
        color: 'green',
      });
    } else if (loginError) {
      notifications.show({
        title: 'Oops!',
        message: loginError.message,
        color: 'red',
      });
    }
  }, [loginData, loginError]);

  useEffect(() => {
    if (verifyData) {
      handleLogin(verifyData);
      navigate('/home');
      notifications.show({
        title: 'Welcome!',
        message: 'Redirecting you to the home page.',
        color: 'green',
      });
    } else if (verifyError) {
      notifications.show({
        title: 'Oops!',
        message: verifyError.message,
        color: 'red',
      });
    }
  }, [verifyData, verifyError, handleLogin, navigate]);

  if (refreshLoading) {
    return (
      <Center h={'100vh'}>
        <Loader size="xl" type="bars" />
      </Center>
    );
  }

  return (
    <>
      <Center h={'80vh'}>
        <Flex direction="column" align="center">
          <IconPlaneDeparture
            size={128}
            className={styles.logoIcon}
            color={theme.colors!.tomato![6]}
          />
          {authProgressState === AuthProgressState.INITIAL ? (
            <form className={styles.form} onSubmit={emailForm.onSubmit(() => startLogin())}>
              <TextInput
                size="md"
                w={300}
                mb={12}
                leftSection={<IconAt size={16} />}
                placeholder="Your email"
                {...emailForm.getInputProps('email')}
              />
              <Button type="submit" disabled={!emailForm.isValid() || loginLoading}>
                {loginLoading ? <Loader color="white" size="sm" type="dots" /> : 'Authenticate'}
              </Button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={otpForm.onSubmit(() => startVerify())}>
              <TextInput
                size="md"
                w={300}
                mb={12}
                leftSection={<Icon123 size={16} />}
                placeholder="One time password"
                {...otpForm.getInputProps('otpToken')}
              />
              <Button type="submit" disabled={!otpForm.isValid() || verifyLoading}>
                {verifyLoading ? <Loader color="white" size="sm" type="dots" /> : 'Log in'}
              </Button>
            </form>
          )}
        </Flex>
      </Center>
    </>
  );
};

export default Auth;
