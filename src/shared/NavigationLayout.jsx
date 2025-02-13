import React, { useContext, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/test-logo.png';
import { AuthContext } from '../context/AuthProvider';

function NavigationLayout() {
  // const { isLogin } = useContext(AuthContext); // 로그인 여부에 따른 화면 변화 여부
  const [isLogin] = useState(true);

  return (
    <StBodyDiv>
      <header>
        <Link className="home-link" to="/">
          <img className="logo-img" src={logo} alt="logo" />
        </Link>

        <nav>
          <Link to="/sign-in" className="sign">
            {/* 로그아웃같은 경우는 기능이 달라 이렇게 텍스타만 바꾸면 안되지만 임시로 해놓았습니다.*/}
            {isLogin ? 'sign out' : 'sign in'}
          </Link>
          <Link to="/category">Categories</Link>
          <Link to="/create-feed">Create Feed</Link>
          <Link to="/my-profile">My Profile</Link>
          <Link to="/about-us">About Us</Link>
          {isLogin && <Link to="/"> My Feed </Link>}
          {isLogin && <Link to="/"> My Like</Link>}
        </nav>

        <footer>
          <p>&copy; 2025. 6 can do it</p>
        </footer>
      </header>
      <StMain>
        <Outlet />
      </StMain>
    </StBodyDiv>
  );
}

export default NavigationLayout;

const StBodyDiv = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;

  header {
    background-color: #211c1c;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;
    height: 100vh;

    .home-link {
      text-decoration: none;
      width: 400px;
      text-align: center;
      margin-top: 20px;
    }

    .logo-img {
      width: 100px;
      margin: 0 auto;
    }
    nav {
      display: flex;
      flex-direction: column;
      margin: auto 0;
      margin-top: 100px;

      a {
        background-color: #46d7ab;
        border-radius: 5px;
        width: 200px;
        margin: 15px;
        padding: 10px 0;
        text-decoration: none;
        color: black;
        font-size: 20px;
        text-align: center;
      }

      .sign {
        background-color: inherit;
        color: white;

        &:hover {
          color: #acacac;
        }
      }
    }

    footer {
      margin-bottom: 20px;
    }
  }
`;

const StMain = styled.main`
  flex: 1;
  padding-left: 5vw;
`;
