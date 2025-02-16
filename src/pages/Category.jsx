import { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import categories from '../constants/categories';
import { AuthContext } from '../context/AuthProvider';
import { ETC } from '../constants/categoryName';
import logo from '../assets/test-logo.png';

function Category() {
  const { isLogin, user } = useContext(AuthContext);
  //user의 관심사 카테고리 배열로 가져오기
  const myInterests = user?.user_interests?.map((i) => i.user_interest) || [];
  //user의 관심사 및 기타를 제외한 카테고리
  const others = categories.filter(
    (i) => !myInterests.includes(i) && i !== ETC,
  );

  const myPickSet = new Set([1, 2, 5]);
  const classNames = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ];

  return (
    <StCategoriesSection>
      {categories.slice(0, 9).map((defaultCategory, i) => {
        let loginCategory;
        if (myPickSet.has(i)) {
          const candidate = myInterests.shift() || defaultCategory;
          // ETC가 myInterests에 있으면 others 배열의 마지막 요소로 대체
          loginCategory =
            candidate === ETC && others.length ? others.pop() : candidate;
        } else {
          loginCategory = others.shift() || defaultCategory;
        }
        return (
          <Link key={i} to="/" className={classNames[i]}>
            <p>{isLogin ? loginCategory : defaultCategory}</p>
          </Link>
        );
      })}
      {/* 기타(ETC)는 고정 */}
      <Link to="/" className="ten">
        <p>{ETC}</p>
      </Link>
    </StCategoriesSection>
  );
}

export default Category;
const StCategoriesSection = styled.section`
  width: 50vw;
  height: 90vh;
  margin: 3vh auto;
  text-align: center;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 6px;
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
