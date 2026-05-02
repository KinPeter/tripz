import { useStore } from '../../store';
import { useAuthApi } from '../../hooks/useAuthApi.ts';
import { useEffect, useState } from 'react';
import { USER_KEY } from '../../lib/constants.ts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Center, Flex, Loader, TextInput } from '@mantine/core';
import {
  Icon123,
  IconAt,
  IconPassword,
  IconPlaneDeparture,
  IconBrandGoogle,
} from '@tabler/icons-react';
import { theme } from '../../lib/mantine.ts';
import styles from './Auth.module.css';
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

  const [loginLoading, setLoginLoading] = useState(false);
  const [passwordLoginLoading, setPasswordLoginLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);

  const useGoogleLogin = () => {
    const ssoUrl = import.meta.env.VITE_SSO_URL;
    window.location.href = ssoUrl;
  };

  const handleLoginSuccess = async (user: Parameters<typeof handleLogin>[0]) => {
    handleLogin(user);
    navigate('/home');
    notifications.show({
      title: 'Welcome!',
      message: 'Redirecting you to the home page.',
      color: 'green',
    });
  };

  const handleLoginCode = async () => {
    setLoginLoading(true);
    try {
      await login(emailForm.values.email);
      setAuthProgressState(AuthProgressState.VERIFYING);
      notifications.show({
        title: 'Great!',
        message: 'Check your inbox, and use the one time password or click the magic link.',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Oops!',
        message: (err as Error).message,
        color: 'red',
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    setPasswordLoginLoading(true);
    try {
      const user = await passwordLogin(emailForm.values.email, emailForm.values.password);
      await handleLoginSuccess(user);
    } catch (err) {
      notifications.show({
        title: 'Oops!',
        message: (err as Error).message,
        color: 'red',
      });
    } finally {
      setPasswordLoginLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifyLoading(true);
    try {
      const user = await verify(emailForm.values.email, otpForm.values.otpToken);
      await handleLoginSuccess(user);
    } catch (err) {
      notifications.show({
        title: 'Oops!',
        message: (err as Error).message,
        color: 'red',
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  const doRefresh = async () => {
    setRefreshLoading(true);
    try {
      const user = await refresh();
      handleLoginSuccess(user);
    } catch (err) {
      notifications.show({
        title: 'Oops!',
        message: (err as Error).message + ' Try to log in again.',
        color: 'red',
      });
      setAuthProgressState(AuthProgressState.INITIAL);
      handleLogout();
    } finally {
      setRefreshLoading(false);
    }
  };

  useEffect(() => {
    if (queryParams.size) {
      const token = queryParams.get('token');
      if (!token) {
        notifications.show({
          title: 'Oops!',
          message: 'Could not log you in.',
          color: 'red',
        });
        handleLogout();
        return;
      }
      localStorage.setItem(USER_KEY, JSON.stringify({ token }));
      doRefresh();
    } else {
      const storedSessionData = localStorage.getItem(USER_KEY);
      if (storedSessionData) {
        doRefresh();
      }
    }
  }, [queryParams, handleLogin, handleLogout, navigate]);

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
              onSubmit={emailForm.onSubmit(async () => {
                if (authMode === AuthMode.LOGIN_CODE) {
                  await handleLoginCode();
                } else if (authMode === AuthMode.PASSWORD) {
                  await handlePasswordLogin();
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
              <Button
                variant="transparent"
                color={theme.colors!.tomato![6]}
                onClick={useGoogleLogin}
              >
                <IconBrandGoogle size={16} style={{ marginRight: 8 }} />
                Log in with Google
              </Button>
            </form>
          ) : (
            <form
              className={styles.form}
              onSubmit={otpForm.onSubmit(async () => {
                await handleVerify();
              })}
            >
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
