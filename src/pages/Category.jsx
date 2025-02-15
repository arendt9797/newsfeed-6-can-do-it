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
    { class: 'one', login: others[0], default: categories[0] },
    { class: 'two', login: myInterests[0], default: categories[1] },
    { class: 'three', login: myInterests[1], default: categories[2] },
    { class: 'four', login: others[1], default: categories[3] },
    { class: 'five', login: others[2], default: categories[4] },
    { class: 'six', login: myInterests[2], default: categories[5] },
    { class: 'seven', login: others[3], default: categories[6] },
    { class: 'eight', login: others[4], default: categories[7] },
    { class: 'nine', login: others[5], default: categories[8] },
  ];

  return (
    <StCategoriesSection>
      {categoriesData.map((c, i) => (
        <Link key={i} to="/" className={c.class}>
          <p>{isLogin ? c.login : c.default}</p>
        </Link>
      ))}
      {/* 기타는 고정 */}
      <Link to="/" className="ten">
        <p> {ETC} </p>
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

    &:hover {
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.13),
        0 10px 10px rgba(0, 0, 0, 0.11);
      cursor: pointer;
    }

    p {
      font-size: 20px;
      background-color: #46d7ab;
      padding: 5px;
      border-radius: 14px 14px 0 0;
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
