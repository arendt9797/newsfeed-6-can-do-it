
import { supabase } from '../supabase/client';
import { useEffect, useState, useContext } from 'react';
// import ToastImageEditor from '../components/ToastImageEditor';
import { AuthContext } from '../context/AuthProvider';
import categories from '../constants/categories';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StCreateFeed = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [feedCategory, setFeedCategory] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
    }
    // FileReader를 사용하여 이미지 미리보기 생성
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewImage(reader.result); // 변환된 data URL 저장
    };
  };

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
      <StUserFeedContainer>
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
        <StImageInputContainer>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewImage ? (
            <img className="preview-img" src={previewImage} alt="preview" />
          ) : (
            <div className="default-img">{'No Image'} </div>
          )}
        </StImageInputContainer>
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
      </StUserFeedContainer>
    </StPageContainer>
  );
};

export default StCreateFeed;

const StPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  border: 3px solid lightgray;
  border-radius: 25px;
  padding: 30px;
  background-color: #F4F7FC; /* 💡 부드러운 파스텔톤 배경 적용 */
  position: absolute;
  top: 20%;
  left: 30%;

  @media (max-width: 900px) {
    width: 90%;
    padding: 20px;
  }
`;

const StImageInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
`;

const StUserFeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FFFFFF; /* 💡 흰색 배경으로 변경 */
  width: 100%;
  border-radius: 15px;
  padding: 20px;
  gap: 20px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.1); /* 💡 부드러운 그림자 추가 */
  .titleInput-container,
  .contextInput-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 450px;
  }

  .titleInput,
  .contextInput {
    width: 100%;
    max-width: 450px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
  }

  .contextInput {
    height: 150px;
    resize: none;
  }

  .button-container {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
    width: 100%;
  }

  .button-container button {
    border-radius: 20px;
    border: 2px solid transparent;
    padding: 14px 22px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    transition: all 0.3s ease-in-out;
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.15);
  }

  .default-img {
    width: 300px;
    height: 300px;
    border-radius: 20px;
    border: 2px solid #d1d1d1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: xx-large;
    font-style: italic;
    font-weight: bold;
    color: #21212e;
    background-color: #46d7ab;
  }

  .preview-img {
    width: 300px;
    height: 300px;
    border-radius: 20px;
    object-fit: cover;
    border: 2px solid #d1d1d1;
  }

  #upload-button, #save-button {
  background-color: #46D7AB;
  color: white;
  border: 2px solid #3CB0A0;

  &:hover {
    background-color: #3CB0A0;
    color: white;
    transform: scale(1.05);
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
}

#cancle-button {
  background-color: #FF4D4D;
  color: white;
  border: 2px solid #D93636;

  &:hover {
    background-color: #D93636;
    transform: scale(1.05);
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
}
`;

const StCategoryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 450px;
  padding: 10px;
`;

const StCategoryButton = styled.button`
  background-color: ${(props) => (props.selected ? '#005BBB' : '#5A67D8')}; 
  color: white;
  font-size: 18px; 
  font-weight: bold;
  cursor: pointer;
  border-radius: 20px;
  border: 3px solid ${(props) => (props.selected ? '#003F7F' : '#4C51BF')}; 
  padding: 14px 20px; 
  transition: all 0.3s ease-in-out;
  box-shadow: ${(props) =>
    props.selected ? '4px 4px 10px rgba(0, 0, 0, 0.25)' : '3px 3px 8px rgba(0, 0, 0, 0.15)'};

  &:hover {
    transform: scale(1.1);
    background-color: ${(props) => (props.selected ? '#004080' : '#4C51BF')};
    box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.92);
  }
`;
