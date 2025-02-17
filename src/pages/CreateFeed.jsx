import St from 'styled-components';
import { supabase } from '../supabase/client';
import { useState, useContext } from 'react';
import ToastImageEditor from '../components/ToastImageEditor';
import { AuthContext } from '../context/AuthProvider';
import categories from '../constants/categories';

const StCreateFeed = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [feedCategory, setFeedCategory] = useState([]);
  const { user: authUser } = useContext(AuthContext);

  const handleFeedCategory = (hobby) => {
    if (feedCategory.includes(hobby)) {
      setFeedCategory((prev) => prev.filter((item) => item !== hobby));
    } else {
      if (feedCategory.length < 1) {
        setFeedCategory((prev) => [...prev, hobby]);
      } else {
        alert('1개의 카테고리만 선택해주세요');
      }
    }
  };
  const handleAddFeed = async () => {
    console.log('handleAddFeed 호출됨');

    const { data: publicUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    try {
      const { data, error } = await supabase.from('feeds').insert([
        { title, content, user_id: publicUser.id, category: feedCategory[0] }, //2025년 2월 17일 기준 현재 1개의 카테고리만 데이터에 등록
      ]);
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
    <StPageContainer>
      <StToastImageEditorContainer>
        <ToastImageEditor />
      </StToastImageEditorContainer>
      <StUserFeedContainer>
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
        <StCategoryContainer>
          {categories.map((category, index) => {
            return (
              <StCategoryButton
                key={index}
                onClick={() => handleFeedCategory(category)} //현재 string으로 선택됨
                selected={feedCategory.includes(category)}
              >
                {category}
              </StCategoryButton>
            );
          })}
        </StCategoryContainer>
      </StUserFeedContainer>
    </StPageContainer>
  );
};

export default StCreateFeed;

const StPageContainer = St.div`
    display:flex;
    height:100% ;
    width:100%;
`;

const StToastImageEditorContainer = St.div`
    display:flex;
    flex:1.3;
    height:100%; 
    
`;

const StUserFeedContainer = St.div`
    display:flex;
    flex:0.8;
    width:100%;
    flex-direction:column;
    background-color:#EDECE7;
    align-items:center;
    
    .titleInput, .contextInput{
        display:flex;
        width:350px;    
    }

    label{
        font-size:22px;
    }
    
    .titleInput{
        width:360px;
        height:20px;
        border-radius:8px;
        border:none;
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
    
    #upload-button,#save-button{
      background-color:#46D7AB;
      color:black;
    }
    #cancle-button{
      background-color:red;
      color:white;
    }
    .button-container button{
        border-radius:20px;
        border:none;
        padding:8px 16px;
        cursor:pointer;
    }
`;

const StCategoryContainer = St.div`
  display:grid;
  grid-template-columns:repeat(3,80px);
  grid-auto-rows:36px;
  gap:5px;
  width:25vw;
  height:20vh;
  margin-top:20px;
  
`;
const StCategoryButton = St.button`
    background-color:${(props) => (props.selected ? 'red' : 'white')};
    cursor:pointer;
    border-radius:16px;

    &:hover{
      background-color:red;
    }
`;
