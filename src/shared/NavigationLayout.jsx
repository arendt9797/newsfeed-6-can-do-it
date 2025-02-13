import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';

function NavigationLayout() {
  return (
    <>
      <header>
        <div>
          <Link to="/">Logo 이미지</Link>
        </div>

        <StNav>
          <Link to="/sign-in">sign-in</Link>
          <Link to="/category">Categories</Link>
          <Link to="/create-feed">Create Feed</Link>
          <Link to="/my-profile">My Profile</Link>
          <Link to="/about-us">About Us</Link>
        </StNav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default NavigationLayout;

const StNav = styled.nav`
  display: flex;

  a {
    border: solid 1px black;
    margin: 20px;
  }
`;
