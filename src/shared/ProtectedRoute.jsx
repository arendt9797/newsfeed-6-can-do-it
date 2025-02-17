import React from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const ProtectedRoute = ({ element }) => {
  const { isLogin } = useContext(AuthContext); // 로그인 여부 가져오기

  // 이미 로그인 되어 있다면, /sign-in 페이지에 접근해도 /로 리다이렉트
  if (isLogin) {
    return <Navigate to="/" />;
  }

  // 로그인되지 않았다면, 원래 컴포넌트 signIn 호출
  return element;
};

export default ProtectedRoute;
