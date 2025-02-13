import Logo from '../../public/doitLogo.png';
import '../styles/testCreateFeedStyle.css';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`;

const MenuBar = styled.div`
  display: flex;
  justify-content: center;

  background-color: #22222f;
  width: 20%;

  img {
    width: 150px;
    height: 150px;
  }
`;

const MainContentContainer = styled.div`
  display: flex;
  width: 80%;
  height: 100%;
  background-color: purple;
`;

const ToastImageEditorContainer = styled.div`
  flex: 2;
  background-color: blue;
`;

const FeedCreateContainer = styled.div`
  display: flex;
  flex: 1.2;
  align-items: center;
  flex-direction: column;
`;

const TitleInputContainer = styled.div`
  input {
    margin-top: 60px;
    width: 350px;
    border-radius: 10px;
    padding: 12px;
  }
`;
const ContextInputContainer = styled.div`
  input {
    margin-top: 40px;
    padding: 30px;
    width: 350px;
    height: 250px;
    border-radius: 10px;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;

  button {
    border: transparent;
    margin-top: 10px;
    border-radius: 20px;
    padding: 10px 40px;
  }

  button:nth-child(1) {
    color: black;
    background-color: #46d7ab;
  }
  button:nth-child(2) {
    color: black;
    background-color: #46d7ab;
  }
  button:nth-child(3) {
    color: white;
    background-color: #d74648;
  }
`;

const CreateFeed = () => {
  return (
    <PageContainer>
      <MenuBar>
        <img src={Logo} alt="Logo" />
      </MenuBar>
      <MainContentContainer>
        <ToastImageEditorContainer />
        <FeedCreateContainer>
          <ButtonContainer>
            <button>포스팅</button>
            <button>임시저장</button>
            <button>돌아가기</button>
          </ButtonContainer>
          <TitleInputContainer>
            <input type="text" placeholder="제목을 입력하세요" />
          </TitleInputContainer>
          <ContextInputContainer>
            <input type="text" placeholder="내용을 입력하세요" />
          </ContextInputContainer>
          <div>카테고리</div>
        </FeedCreateContainer>
      </MainContentContainer>
    </PageContainer>
  );
};

export default CreateFeed;
