import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import categories from '../constants/categories';
import { AuthContext } from '../context/AuthProvider';
import { ETC } from '../constants/categoryName';
import logo from '../assets/test-logo.png';

function Category() {
  const { isLogin, user } = useContext(AuthContext);
  const myInterests = user?.user_interests?.map((i) => i.user_interest) || [];
  const others = categories.filter(
    (i) => !myInterests.includes(i) && i !== ETC,
  );

  const categoriesData = [
    { className: 'one', loginValue: others[0], defaultValue: categories[0] },
    {
      className: 'two',
      loginValue: myInterests[0],
      defaultValue: categories[1],
    },
    {
      className: 'three',
      loginValue: myInterests[1],
      defaultValue: categories[2],
    },
    { className: 'four', loginValue: others[1], defaultValue: categories[3] },
    { className: 'five', loginValue: others[2], defaultValue: categories[4] },
    {
      className: 'six',
      loginValue: myInterests[2],
      defaultValue: categories[5],
    },
    { className: 'seven', loginValue: others[3], defaultValue: categories[6] },
    { className: 'eight', loginValue: others[4], defaultValue: categories[7] },
    { className: 'nine', loginValue: others[5], defaultValue: categories[8] },
  ];

  return (
    <StCategoriesSection>
      {categoriesData.map((c) => (
        <Link key={c.className} to="/" className={c.className}>
          {isLogin ? c.loginValue : c.defaultValue}
        </Link>
      ))}
      {/* 기타는 고정 */}
      <Link to="/" className="ten">
        {ETC}
      </Link>
    </StCategoriesSection>
  );
}

export default Category;
const StCategoriesSection = styled.section`
  width: 50vw;
  height: 90vh;
  margin: 0 auto;
  text-align: center;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
  grid-auto-rows: minmax(100px, auto);

  a {
    background-color: #bab7b72d;
    /* background-image: url(${logo});
    background-position: center;
    background-size: cover; */
    border-radius: 14px;
    text-decoration: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    color: black;
    padding: 10px;

    &:hover {
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.13),
        0 10px 10px rgba(0, 0, 0, 0.11);
      cursor: pointer;
    }
  }

  .two,
  .three,
  .six {
    background-color: #6764642c;
  }

  .two {
    grid-column: 2 / 4;
    grid-row: 1 / 3;
  }
  .three {
    grid-column: 1;
    grid-row: 2 / 5;
  }
  .four {
    grid-column: 2;
    grid-row: 3;
  }
  .five {
    grid-column: 3;
    grid-row: 3;
  }
  .six {
    grid-column: 2;
    grid-row: 4/6;
  }

  .ten {
    grid-column: 1/4;
    grid-row: 6;
  }
`;
