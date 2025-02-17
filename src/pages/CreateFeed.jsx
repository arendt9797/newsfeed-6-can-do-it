import St from 'styled-components';
import { supabase } from '../supabase/client';
import { useEffect, useState, useContext } from 'react';
// import ToastImageEditor from '../components/ToastImageEditor';
import { AuthContext } from '../context/AuthProvider';
import categories from '../constants/categories';
import { useNavigate } from 'react-router-dom';

const StCreateFeed = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [feedCategory, setFeedCategory] = useState([]);
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSaveTemp = () => {
    const temp = { title, content };
    localStorage.setItem('temp', JSON.stringify(temp));
    alert('내용을 저장했습니다!');
  };
  useEffect(() => {
    const temp = localStorage.getItem('temp');
    if (temp) {
      const tempData = JSON.parse(temp);
      setTitle(tempData.title || '');
      setContent(tempData.content || '');
      setFeedCategory(tempData.feedCategory || []);
    }
  }, []);

  const gotoCategory = () => {
    navigate('/category');
  };
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
    if (!title.trim() || !content.trim()) {
      alert('Title 또는 Context에 내용이 없습니다.');
      return;
    }

    if (feedCategory.length === 0) {
      alert('카테고리 1개는 선택해주세요.');
      return;
    }
    const { data: publicUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    try {
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

        const { error: imageError } = await supabase.storage
          .from('feed-image')
          .upload(filePath, imgFile);
        if (imageError) throw imageError;

        const { data: urlData, error: urlError } = await supabase.storage
          .from('feed-image')
          .getPublicUrl(filePath);
        if (urlError) throw urlError;
        const publicURL = urlData.publicUrl;
        console.log('업로드된 이미지 URL:', publicURL);

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
      <StImageInputContainer>
        <input type="file" accept="image/*" onChange={handleImgFile} />
      </StImageInputContainer>
      <StUserFeedContainer>
        <div className="button-container">
          <button id="upload-button" onClick={handleAddFeed}>
            포스팅하기
          </button>
          <button id="save-button" onClick={handleSaveTemp}>
            임시저장
          </button>
          <button id="cancle-button" onClick={gotoCategory}>
            돌아가기
          </button>
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

const StImageInputContainer = St.div`
    display: flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    background-color:#EDECE7;
    flex: 1.3;
 


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
        height: 30px;
        border-radius: 8px;
        border: none;
    }
    
    .titleInput-container {
        display: flex;
        position:relative;
        top:40px;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 10px;
    }
    
    .contextInput-container {
        display: flex;
        flex-direction: column;
        width: 380px;
        height: 330px;
        position:relative;
        top:50px;
        gap: 15px;
    }
    
    .contextInput {
        width: 100%;
        height: 60%;
        border-radius: 12px;
        line-height: normal;
        border:transparent;
    }
    
    .button-container {
        display: flex;
        position:relative;
        top:25px;
        gap: 15px;
    }
    
    #upload-button, #save-button {
        background-color: #46D7AB;
        color: black;
        font-size:16px;
        &:hover{
          color:white;
        }
    }
    
    #cancle-button {
        background-color: red;
        color: white;
        font-size:16px;
        &:hover{
          opacity:0.5;
          
        }
    }
    
    .button-container button {
        border-radius: 20px;
        border: none;
        padding: 12px 20px;
        cursor: pointer;
        
    }
`;

const StCategoryContainer = St.div`
  display: grid;
  align-content:center;
  justify-content:center;
  grid-template-columns: repeat(3, 120px);
  grid-auto-rows: 40px;
  gap: 15px;
  width: 25vw;
  height: 25vh;


`;

const StCategoryButton = St.button`
    background-color: ${(props) => (props.selected ? '#3CB0A0' : '#46D7AB')};
    cursor: pointer;
    border-radius: 16px;
    border:transparent;
    box-shadow:2px 2px rgba(170,150,220,0);
    position:relative;
    top:30px;
    transition:all 0.2s ease-in-out;
    &:hover {
      transform:translateY(-5px);
    }
`;
