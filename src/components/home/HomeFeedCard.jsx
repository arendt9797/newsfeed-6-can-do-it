import styled from 'styled-components';

const HomeFeedCard = () => {
  return (
    <>
      <StFeedBox>
        <StFeedTop>
          <div>
            <img
              src="https://media.istockphoto.com/id/1497396873/ko/%EC%82%AC%EC%A7%84/%ED%95%B4%EB%B3%80-%ED%9C%B4%EA%B0%80%EB%A5%BC-%EC%8B%9C%EC%9E%91%ED%95%A0-%EC%A4%80%EB%B9%84%EA%B0%80-%EB%90%98%EC%97%88%EC%8A%B5%EB%8B%88%EB%8B%A4.jpg?s=612x612&w=0&k=20&c=okICg7-m2NXrvTnU4Jl2Vy3coHYd7DcjtyMMUA3Vg7E="
              width={250}
            />
          </div>
          <div>
            <img
              src="https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg"
              alt="이미지 에러"
              width={80}
            />
            <StH2>title</StH2>
            <div>content : 작성자가 작성한 내용이 들어갑니다.</div>
            <div>comments(00)</div>
          </div>
        </StFeedTop>
        <div>댓글 컴포넌트 따로만들기(추후에)</div>
      </StFeedBox>
    </>
  );
};

export default HomeFeedCard;

const StFeedBox = styled.div`
  width: 500px;
  height: 300px;
  background-color: white;
  border-radius: 10px;
  border: 2px solid lightgrey;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  text-align: center;
  justify-content: space-around;
`;

const StFeedTop = styled.div`
  display: flex;
  flex-direction: row;
  padding: 30px;
  gap: 10px;
`;

const StH2 = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: black;
`;
