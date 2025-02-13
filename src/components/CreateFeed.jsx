import Logo from '../../public/doitLogo.png';
import '../styles/testCreateFeedStyle.css';
import styled from 'styled-components';

const MainContentContainer = styled.div`
  display: flex;
  width: 80%;
  height: 100%;
  background-color: purple;
`;

const MenuBarContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MenuBar = styled.div`
  display: flex;
  justify-content: center;
  background-color: #22222f;
  width: 20%;
  height: 100%;

  img {
    width: 150px;
    height: 150px;
  }
`;

const ToastImageEditorContainer = styled.div`
  height: 100vh;
  width: 50%;
  background-color: blue;
`;
const FeedCreateContainer = styled.div`
  display: flex;
  width: 50%;
  align-items: center;
  flex-direction: column;
`;

const TitleInputContainer = styled.div`
  input {
    margin-top: 30px;
    width: 450px;
    border-radius: 10px;
    padding: 12px;
  }
`;
const ContextInputContainer = styled.div`
  input {
    margin-top: 30px;
    padding: 30px;
    width: 450px;
    height: 250px;
    border-radius: 10px;
  }
`;
const CreateFeed = () => {
  return (
    <div>
      <MenuBarContainer>
        <MenuBar>
          <img src={Logo} />
        </MenuBar>
      </MenuBarContainer>
      <MainContentContainer>
        <ToastImageEditorContainer></ToastImageEditorContainer>
        <FeedCreateContainer>
          <TitleInputContainer>
            <input type="text" />
          </TitleInputContainer>
          <ContextInputContainer>
            <input type="text" />
          </ContextInputContainer>
        </FeedCreateContainer>
      </MainContentContainer>
    </div>
  );
};

export default CreateFeed;
