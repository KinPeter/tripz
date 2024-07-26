import { useStore } from '../../store';
import { useAuthApi } from '../../hooks/useAuthApi.ts';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { USER_KEY } from '../../lib/constants.ts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Center, Flex, Loader, TextInput } from '@mantine/core';
import { Icon123, IconAt, IconPassword, IconPlaneDeparture } from '@tabler/icons-react';
import { theme } from '../../lib/mantine.ts';
import styles from './Auth.module.scss';
import { notifications } from '@mantine/notifications';
import { hasLength, isEmail, useForm } from '@mantine/form';

enum AuthProgressState {
  INITIAL,
  VERIFYING,
}

enum AuthMode {
  LOGIN_CODE,
  PASSWORD,
}

const Auth = () => {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const handleLogin = useStore(state => state.handleLogin);
  const handleLogout = useStore(state => state.handleLogout);
  const { login, passwordLogin, verify, refresh } = useAuthApi();
  const [authProgressState, setAuthProgressState] = useState<AuthProgressState>(
    AuthProgressState.INITIAL
  );
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN_CODE);

  const emailForm = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: isEmail(),
      password: authMode === AuthMode.PASSWORD ? hasLength({ min: 5 }) : undefined,
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
    mutate: startPasswordLogin,
    data: passwordLoginData,
    error: passwordLoginError,
    isPending: passwordLoginLoading,
  } = useMutation({
    mutationFn: () => passwordLogin(emailForm.values.email, emailForm.values.password),
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
    if (queryParams.size) {
      const token = queryParams.get('accessToken');
      const expiresAt = queryParams.get('expiresAt');
      const email = queryParams.get('email');
      const id = queryParams.get('id');
      if (!token || !expiresAt || !email || !id) {
        notifications.show({
          title: 'Oops!',
          message: 'Could not log you in.',
          color: 'red',
        });
        handleLogout();
        return;
      }
      handleLogin({ id, email, token, expiresAt });
      navigate('/home');
    } else {
      const storedSessionData = localStorage.getItem(USER_KEY);
      if (storedSessionData) {
        refreshSession();
      }
    }
  }, [queryParams, refreshSession, handleLogin, handleLogout, navigate]);

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

  useEffect(() => {
    if (passwordLoginData) {
      handleLogin(passwordLoginData);
      navigate('/home');
      notifications.show({
        title: 'Welcome!',
        message: 'Redirecting you to the home page.',
        color: 'green',
      });
    } else if (passwordLoginError) {
      notifications.show({
        title: 'Oops!',
        message: passwordLoginError.message,
        color: 'red',
      });
    }
  }, [passwordLoginData, passwordLoginError, handleLogin, navigate]);

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
            <form
              className={styles.form}
              onSubmit={emailForm.onSubmit(() => {
                if (authMode === AuthMode.LOGIN_CODE) {
                  startLogin();
                } else if (authMode === AuthMode.PASSWORD) {
                  startPasswordLogin();
                }
              })}
            >
              <TextInput
                size="md"
                w={300}
                mb={12}
                leftSection={<IconAt size={16} />}
                placeholder="Your email"
                {...emailForm.getInputProps('email')}
              />
              {authMode === AuthMode.PASSWORD && (
                <TextInput
                  size="md"
                  w={300}
                  mb={12}
                  leftSection={<IconPassword size={16} />}
                  placeholder="Your password"
                  type="password"
                  {...emailForm.getInputProps('password')}
                />
              )}
              <Button
                type="submit"
                disabled={!emailForm.isValid() || loginLoading || passwordLoginLoading}
              >
                {loginLoading || passwordLoginLoading ? (
                  <Loader color="white" size="sm" type="dots" />
                ) : (
                  'Authenticate'
                )}
              </Button>
              <Button
                variant="transparent"
                color={theme.colors!.tomato![6]}
                className={styles.authModeButton}
                onClick={() =>
                  setAuthMode(prevState =>
                    prevState === AuthMode.LOGIN_CODE ? AuthMode.PASSWORD : AuthMode.LOGIN_CODE
                  )
                }
              >
                {authMode === AuthMode.LOGIN_CODE ? 'Use password' : 'Use login code'}
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
