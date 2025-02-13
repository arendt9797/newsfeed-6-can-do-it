import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/test-logo.png';

function NavigationLayout() {
  return (
    <StBody>
      <header>
        <Link className="home-link" to="/">
          <img className="logo-img" src={logo} alt="" />
        </Link>

        <nav>
          <Link to="/sign-in" className="sign">
            sign-in
          </Link>
          <Link to="/category">Categories</Link>
          <Link to="/create-feed">Create Feed</Link>
          <Link to="/my-profile">My Profile</Link>
          <Link to="/about-us">About Us</Link>
        </nav>

        <footer>
          <p>&copy; 2025. 6 can do it</p>
        </footer>
      </header>
      <StMain>
        <Outlet />
      </StMain>
    </StBody>
  );
}

export default NavigationLayout;

const StBody = styled.body`
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
      width: 200px;
      margin: 0 auto;
    }
    nav {
      display: flex;
      flex-direction: column;
      width: 300px;
      margin: auto 0;
      margin-top: 100px;

      a {
        background-color: #46d7ab;
        border-radius: 5px;
        margin: 20px;
        padding: 10px 0;
        text-decoration: none;
        color: black;
        font-size: 25px;
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
  padding-left: 5vw;
`;
