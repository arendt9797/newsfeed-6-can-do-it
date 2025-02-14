import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function Category() {
  const interests = [
    '영화',
    '여행',
    '미술',
    '음악',
    'DIY',
    '운동',
    '게임',
    '요리',
    '동물',
  ];
  const selectedInterests = ['영화', '음악', '운동'];
  const test = interests.filter((i) => !selectedInterests.includes(i));

  return (
    <StCategoriesSection>
      <Link to="/">{test[0]}</Link>
      <Link to="/" className="two">
        {selectedInterests[0]}
      </Link>
      <Link to="/" className="three">
        {selectedInterests[1]}
      </Link>
      <Link to="/" className="four">
        {test[1]}
      </Link>
      <Link to="/" className="five">
        {test[2]}
      </Link>
      <Link to="/" className="six">
        {selectedInterests[2]}
      </Link>
      <Link to="/">{test[3]}</Link>
      <Link to="/">{test[4]}</Link>
      <Link to="/">{test[5]}</Link>
      {/* 기타는 고정 */}
      <Link to="/" className="ten">
        기타
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
