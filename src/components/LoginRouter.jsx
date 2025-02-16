import React from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const LoginRouter = ({ element }) => {
  const { isLogin } = useContext(AuthContext); // 로그인 여부 가져오기

  if (isLogin) {
    return <Navigate to="/" />;
  }

  return element;
};

export default LoginRouter;
