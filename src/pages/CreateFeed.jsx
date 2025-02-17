import St from 'styled-components';
import { supabase } from '../supabase/client';
import { useState, useContext } from 'react';
// import ToastImageEditor from '../components/ToastImageEditor';
import { AuthContext } from '../context/AuthProvider';
import categories from '../constants/categories';

const StCreateFeed = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [feedCategory, setFeedCategory] = useState([]);
  const { user: authUser } = useContext(AuthContext);

  const handleImgFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      console.log(file);
    }
  };

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
      // feeds 테이블에 피드 데이터 생성 (feed_image_url은 나중에 업데이트)
      const { data: feedData, error: feedError } = await supabase
        .from('feeds')
        .upsert([{ title, content, user_id: publicUser.id }])
        .select();
      console.log(feedData);
      if (feedError) {
        console.log('error=>', feedError);
      } else {
        alert('데이터 입력 성공');
        console.log(feedData);
      }

      // feed_interests 테이블에 카테고리 정보 삽입
      const { data: categoryData, error: categoryError } = await supabase
        .from('feed_interests')
        .insert([{ id: feedData[0].id, interest_name: feedCategory[0] }]);
      if (categoryError) {
        console.log(categoryError);
      } else {
        console.log(categoryData);
      }

      if (imgFile) {
        const filePath = `public/${Date.now()}_${imgFile.name}`;

        // 이미지 업로드
        const { error: imageError } = await supabase.storage
          .from('feed-image')
          .upload(filePath, imgFile);
        if (imageError) throw imageError;

        // 업로드된 이미지의 공개 URL 가져오기 (v2 방식)
        const { data: urlData, error: urlError } = await supabase.storage
          .from('feed-image')
          .getPublicUrl(filePath);
        if (urlError) throw urlError;
        const publicURL = urlData.publicUrl;
        console.log('업로드된 이미지 URL:', publicURL);

        // upsert를 사용하여 feeds 테이블의 feed_image_url 필드에 publicURL을 저장
        const { error: upsertError } = await supabase
          .from('feeds')
          .upsert(
            { id: feedData[0].id, feed_image_url: publicURL },
            { onConflict: 'id' },
          );
        if (upsertError) throw upsertError;
      }
    } catch (error) {
      console.error('error=>', error);
    }
  };

  return (
    <StPageContainer>
      <StToastImageEditorContainer>
        <input type="file" accept="image/*" onChange={handleImgFile} />
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
          {categories.map((category, index) => (
            <StCategoryButton
              key={index}
              onClick={() => handleFeedCategory(category)}
              selected={feedCategory.includes(category)}
            >
              {category}
            </StCategoryButton>
          ))}
        </StCategoryContainer>
      </StUserFeedContainer>
    </StPageContainer>
  );
};

export default StCreateFeed;

const StPageContainer = St.div`
    display: flex;
    height: 100%;
    width: 100%;
`;

const StToastImageEditorContainer = St.div`
    display: flex;
    flex: 1.3;
    height: 100%;
`;

const StUserFeedContainer = St.div`
    display: flex;
    flex: 0.8;
    width: 100%;
    flex-direction: column;
    background-color: #EDECE7;
    align-items: center;
    
    .titleInput, .contextInput {
        display: flex;
        width: 350px;
    }
    
    label {
        font-size: 22px;
    }
    
    .titleInput {
        width: 360px;
        height: 20px;
        border-radius: 8px;
        border: none;
    }
    
    .titleInput-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 10px;
    }
    
    .contextInput-container {
        display: flex;
        flex-direction: column;
        width: 380px;
        height: 380px;
        gap: 5px;
    }
    
    .contextInput {
        width: 100%;
        height: 100%;
        border-radius: 12px;
        line-height: normal;
    }
    
    .button-container {
        display: flex;
        gap: 15px;
        margin: 10px 15px;
    }
    
    #upload-button, #save-button {
        background-color: #46D7AB;
        color: black;
    }
    
    #cancle-button {
        background-color: red;
        color: white;
    }
    
    .button-container button {
        border-radius: 20px;
        border: none;
        padding: 8px 16px;
        cursor: pointer;
    }
`;

const StCategoryContainer = St.div`
  display: grid;
  grid-template-columns: repeat(3, 80px);
  grid-auto-rows: 36px;
  gap: 5px;
  width: 25vw;
  height: 20vh;
  margin-top: 20px;
`;

const StCategoryButton = St.button`
    background-color: ${(props) => (props.selected ? 'red' : 'white')};
    cursor: pointer;
    border-radius: 16px;

    &:hover {
      background-color: red;
    }
`;
