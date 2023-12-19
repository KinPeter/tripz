import { useStore } from '../../store';
import { useAuthApi } from '../../hooks/useAuthApi.ts';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SESSION_KEY } from '../../lib/constants.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseHash } from '../../lib/hashParser.ts';

const Auth = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const handleLogin = useStore(state => state.handleLogin);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const { login, verify, refresh } = useAuthApi();
  const [email, setEmail] = useState<string>('kinpeter85@gmail.com');
  const [otpToken, setOtpToken] = useState<string>('');

  const {
    mutate: startLogin,
    data: loginData,
    error: loginError,
    isPending: loginLoading,
  } = useMutation({
    mutationFn: () => login(email),
  });

  const {
    mutate: startVerify,
    data: verifyData,
    error: verifyError,
    isPending: verifyLoading,
  } = useMutation({
    mutationFn: () => verify(otpToken),
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
      handleLogin(parseHash(hash));
      navigate('/home');
    } else {
      const storedSessionData = localStorage.getItem(SESSION_KEY);
      if (storedSessionData) {
        refreshSession();
      }
    }
  }, [hash, refreshSession, handleLogin, navigate]);

  useEffect(() => {
    if (refreshData) {
      handleLogin(refreshData);
      navigate('/home');
    }
  }, [refreshData, handleLogin, navigate]);

  useEffect(() => {
    if (loginData) {
      console.log('login', loginData);
      // TODO check your inbox
    }
  }, [loginData]);

  useEffect(() => {
    if (verifyData) {
      console.log('verify', verifyData);
      handleLogin(verifyData);
      navigate('/home');
    }
  }, [verifyData, handleLogin, navigate]);

  if (loginLoading || verifyLoading || refreshLoading) {
    return <p>Loading...</p>;
  }

  if (loginError || verifyError || refreshError) {
    return <p>Ooopps...</p>;
  }

  return (
    <>
      <h1>{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</h1>
      <input value={email} type="text" onChange={e => setEmail(e.target.value)} />
      <button onClick={() => startLogin()}>Sign in</button>
      <input type="text" onChange={e => setOtpToken(e.target.value)} />
      <button onClick={() => startVerify()}>Verify</button>
    </>
  );
};

export default Auth;
