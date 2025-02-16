import St from 'styled-components';
import { supabase } from '../supabase/client';
import { useState } from 'react';
import ToastImageEditor from '../components/ToastImageEditor';
import Category from '../constants/categories';

const PageContainer = St.div`
    display:flex;
    height:100% ;
    width:100%;
`;

const ToastImageEditorContainer = St.div`
    display:flex;
    flex:1.3;
    height:100%; 
    
`;

const UserFeedContainer = St.div`
    display:flex;
    flex:0.8;
    width:100%;
    flex-direction:column;
    background-color:#EDECE7;
    align-items:center;
    
    .titleInput, .contextInput{
        display:flex;
        border-radius:20px;
        width:350px;    
    }

    label{
        font-size:22px;
    }
    
    .titleInput{
        width:360px;
        height:20px;
        border-radius:12px;
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
        width:380px;
        height:380px;
        gap:5px;
    }

    .contextInput{
        width:100%;
        height:100%;
        border-radius:12px;
        
        line-height:normal;
    }

    .button-container{
        display:flex;
        gap:15px;
        margin:10px 15px;
    }

    .button-container button{
        border-radius:20px;
        padding:8px 16px;
        cursor:pointer;
    }
`;

const CategoryContainer = St.div`
  display:grid;
  width:25vw;
  height:20vh;
  margin-top:20px;
  background-color:red;
`;

const CreateFeed = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAddFeed = async () => {
    console.log('handleAddFeed 호출됨');

    const {
      data: { user: auth }, // 현재 로그인 한 사용자의 세션, auth 스키마 데이터이므로 불러오기만
      error: authError,
    } = await supabase.auth.getUser();
    //현재 로그인 한 사용자의 정보 불러오기
    //2025.02.14 기준 로그아웃 상태에서 콘솔에서 에러 확인
    if (authError) {
      console.log('auth에러', authError);
    }

    const { data: publicUser, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', auth.id);

    try {
      const { data, error } = await supabase
        .from('feeds')
        .insert([{ title, content, user_id: publicUser.id }]);
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
      <ToastImageEditorContainer>
        <ToastImageEditor />
      </ToastImageEditorContainer>
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
        <CategoryContainer></CategoryContainer>
      </UserFeedContainer>
    </PageContainer>
  );
};

export default CreateFeed;
