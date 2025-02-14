import St from 'styled-components';
import { supabase } from '../supabase/client';
import { useState } from 'react';

const PageContainer = St.div`
    display:flex;
`;

const ToastImageEditorContainer = St.div`
    display:flex;
    flex:1.5;
    height:100vh;
    background-color:blue;
`;

const UserFeedContainer = St.div`
    display:flex;
    flex:1;
    width:80%;
    flex-direction:column;
    background-color:purple;
    align-items:center;
    
    .titleInput, .contextInput{
        display:flex;
        border-radius:20px;
        width:400px;    
    }

    label{
        font-size:22px;
    }
    
    .titleInput{
        height:30px;
        border-radius:10px;
    }
    
    .titleInput-container{
        display:flex;
        flex-direction:column;
        gap:10px;
        margin-bottom:10px;
    }

    .contextInput-container{
        display:flex;
        flex-direction:column;
        gap:5px;
    }

    .contextInput{
        height:350px;
        border-radius:16px;
        padding:6px;
        line-height:normal;
    }

    .button-container{
        display:flex;
        gap:20px;
        margin:20px 10px;
    }

    .button-container button{
        border-radius:20px;
        padding:10px 25px;
        cursor:pointer;
    }
`;

const CreateFeed = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAddFeed = async () => {
    console.log('handleAddFeed 호출됨');

    // const {
    //   data: { users },
    //   error: authError,
    // } = await supabase.auth.getUser();
    // //현재 로그인 한 사용자의 정보 불러오기
    // //2025.02.14 기준 로그아웃 상태에서 콘솔에서 에러 확인
    // if (authError) {
    //   console.log('auth에러', authError);
    // }

    try {
      const { data, error } = await supabase
        .from('feeds')
        .insert([{ title, content}]);
      //user_id라는 수파베이스 데이터 칼럼에 현재 user.id를 넣기 =>user_id: users.id 
      if (error) {
        console.log('error=>', error);
      } else {
        alert('데이터 입력 성공');
        console.log(data);
      }
    } catch (error) {
      console.error('error=>', error);
    }
  };

  return (
    <PageContainer>
      <ToastImageEditorContainer>토스트</ToastImageEditorContainer>
      <UserFeedContainer>
        <div className="button-container">
          <button id="upload-button" onClick={handleAddFeed}>
            포스팅하기
          </button>
          <button id="save-button">임시저장</button>
          <button id="cancle-button">돌아가기</button>
        </div>
        <div className="titleInput-container">
          <label>Title</label>
          <input
            type="text"
            className="titleInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="contextInput-container">
          <label>Context</label>
          <textarea
            className="contextInput"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </UserFeedContainer>
    </PageContainer>
  );
};

export default CreateFeed;
