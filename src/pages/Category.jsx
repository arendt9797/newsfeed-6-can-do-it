import { useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthProvider';
import * as c from '../constants/categoryName';
import logo from '../assets/test-logo.png';
import { useNavigate } from 'react-router-dom';

function Category() {
  const { isLogin, user } = useContext(AuthContext);
  const navigate = useNavigate();
  //user의 관심사 카테고리 배열로 가져오기
  //기타(ETC)가 배열 안에 있을 경우 배열의 가장 마지막에 위치시키기
  const myInterests =
    user?.user_interests
      ?.map((i) => i.user_interest)
      // 비교 함수에서 a === c.ETC이면 1을 리턴하여 a를 뒤로 보내고, b === c.ETC이면 -1을 리턴하여 b를 뒤로 보냄
      .sort((a, b) => (a === c.ETC ? 1 : b === c.ETC ? -1 : 0)) || [];

  // const testImg = user?.my_profile_image_url || logo;

  //user의 관심사 및 기타(ETC)를 제외한 카테고리
  const others = c.categoryArr
    .slice(0, 9)
    .filter((i) => !myInterests.includes(i) && i !== c.ETC);

  //그리드 큰 위치에 user 관심사를 우선적으로 배치하기 위해 사용
  const myPick = [1, 2, 5];
  //각 버튼에 부여할 CSS 클래스명
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
      {c.categoryArr.slice(0, 9).map((defaultCategory, i) => {
        let loginCategoryName = '';
        let loginCategoryImg = defaultCategory.img;
        if (myPick.includes(i)) {
          const candidate = myInterests.shift() || defaultCategory.name;
          // 기타(ETC)가 myInterests에 있으면 others 배열의 마지막 요소로 대체

          if (candidate === c.ETC && others.length !== 0) {
            const replaced = others.pop();
            loginCategoryName = replaced.name;
            loginCategoryImg = replaced.img;
          } else {
            const candidateObj =
              c.categoryArr.find((c) => c.name === candidate) ||
              defaultCategory;
            loginCategoryName = candidateObj.name;
            loginCategoryImg = candidateObj.img;
          }
        } else {
          const other = others.shift() || defaultCategory;
          loginCategoryName = other.name;
          loginCategoryImg = other.img;
        }

        return (
          <StButton
            onClick={() => {
              navigate(`/`);
            }}
            key={i}
            className={classNames[i]}
            $img={loginCategoryImg}
          >
            <p>{isLogin ? loginCategoryName : defaultCategory.name}</p>
          </StButton>
        );
      })}
      {/* 기타(ETC)는 고정 */}
      <StButton
        onClick={() => {
          navigate(`/`);
        }}
        className="ten"
        $img={c.categoryArr[9].img}
      >
        <p>{c.ETC}</p>
      </StButton>
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

  button {
    background-color: #bab7b72d;
    border: none;
    border-radius: 14px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    color: black;

    &:hover {
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.13),
        0 10px 10px rgba(0, 0, 0, 0.11);
      cursor: pointer;
    }

    p {
      font-size: 27px;
      font-weight: bold;
      text-shadow: -1px 0 #d8dfe5, 0 1px #d8dfe5, 1px 0 #d8dfe5, 0 -1px #d8dfe5;
    }
  }

  .two,
  .three,
  .six {
    background-color: #6764642c;

    &::after {
      opacity: 0.8;
    }
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

const StButton = styled.button`
  position: relative;
  z-index: 1;

  &::after {
    background-image: ${(prop) => `url(${prop.$img})`};
    background-position: center;
    background-size: cover;
    border-radius: 14px;
    width: 100%;
    height: 100%;
    background-size: cover;
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    z-index: -1;
    opacity: 0.5;
  }
`;
