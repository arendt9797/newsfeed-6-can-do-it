import { useState } from 'react';
import { supabase } from '../supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      alert('로그인 성공!');
      navigate('/');
    } catch (error) {
      alert(error.message);
      console.error('로그인 오류:', error);
    }
  };

  return (
    <StSignIn>
      <StSignInContainer>
        <img src="/src/assets/test-logo.png" alt="site_logo" />
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="  이메일 주소를 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="  비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{'Login'}</button>
        </form>
        <footer>
          {'not a member yet? '}
          <Link to={'/sign-up'}>{'Sign Up'}</Link>
        </footer>
      </StSignInContainer>
    </StSignIn>
  );
};

export default Login;

const StSignIn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const StSignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  width: 520px;
  height: 700px;
  border: 3px solid #d1d1d1;
  border-radius: 20px;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 50px;
  }

  img {
    width: 130px;
    border-radius: 20px;
    margin-bottom: 100px;
  }

  input {
    font-size: 20px;
    height: 50px;
    width: 400px;
    border: none;
    border-bottom: 3px solid #21212e;
    outline: none;
    transition: border-bottom 0.4s ease-in-out;

    &:focus {
      border-bottom: 3px solid #46d7ab;
    }
  }

  button {
    width: 250px;
    height: 50px;
    border: none;
    border-radius: 10px;
    margin-top: 20px;
    background-color: #46d7ab;
    color: #21212e;
    font-size: 24px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #46e4b5;
      /* color: white; */
    }
  }

  footer {
    position: absolute;
    bottom: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #2baa84;
  }
`;
