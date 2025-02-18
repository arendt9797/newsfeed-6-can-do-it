import { supabase } from '../supabase/client';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import categories from '../constants/categories';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const StCreateFeed = () => {
  const location = useLocation();
  const existingFeed = location.state?.feed || null;
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // 상태 관리
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [feedCategory, setFeedCategory] = useState([]);
  const [imgFile, setImgFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  //  `created_at`을 이용하여 최신 데이터 가져오는 함수
  const fetchFeedByCreatedAt = async (createdAt) => {
    try {
      // `feeds` 테이블에서 제목과 내용 가져오기
      const { data: feedData, error: feedError } = await supabase
        .from('feeds')
        .select('*')
        .eq('created_at', createdAt)
        .maybeSingle();

      if (feedError) throw feedError;

      if (feedData) {
        setTitle(feedData.title || '');
        setContent(feedData.content || '');
        setPreviewImage(feedData.feed_image_url || null);

        //  `feed_interests` 테이블에서 해당 피드의 카테고리 가져오기
        const { data: categoryData, error: categoryError } = await supabase
          .from('feed_interests')
          .select('interest_name')
          .eq('id', feedData.id); // `id`는 `feeds` 테이블과 `feed_interests` 테이블에서 동일

        if (categoryError) throw categoryError;

        // 카테고리 배열 변환
        if (categoryData.length > 0) {
          setFeedCategory(categoryData.map((item) => item.interest_name));
        } else {
          setFeedCategory([]);
        }
      }
    } catch (error) {
      console.error('게시글 불러오기 오류:', error);
    }
  };

  // 기존 게시글 데이터 불러오기
  useEffect(() => {
    if (existingFeed) {
      if (existingFeed.created_at) {
        fetchFeedByCreatedAt(existingFeed.created_at); //  created_at 기준으로 최신 데이터 가져오기
      }
    }
  }, [existingFeed]);

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
        const imageExt = imgFile.name.split('.').pop(); // 확장자 추출
        const uniqueImageName = `${uuidv4()}.${imageExt}`; // UUID + 원래 확장자
        const filePath = `public${uniqueImageName}`;

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

  const handleSaveFeed = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (feedCategory.length === 0) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    try {
      if (existingFeed) {
        // 기존 게시글 수정
        const { error: updateError } = await supabase
          .from('feeds')
          .update({ title, content })
          .eq('id', existingFeed.id);

        if (updateError) throw updateError;

        //  `feed_interests` 테이블의 카테고리 수정 (삭제 후 새로 삽입)
        await supabase
          .from('feed_interests')
          .delete()
          .eq('id', existingFeed.id);
        await supabase.from('feed_interests').insert(
          feedCategory.map((category) => ({
            id: existingFeed.id,
            interest_name: category,
          })),
        );

        alert('게시글이 수정되었습니다!');
        navigate('/');
      } else {
        // 새 게시글 생성
        const { data: newFeed, error: newFeedError } = await supabase
          .from('feeds')
          .insert([{ title, content, user_id: authUser.id }])
          .select();

        if (newFeedError) throw newFeedError;

        //  `feed_interests` 테이블에 카테고리 저장
        if (newFeed.length > 0) {
          await supabase.from('feed_interests').insert(
            feedCategory.map((category) => ({
              id: newFeed[0].id,
              interest_name: category,
            })),
          );
        }

        alert('게시글이 작성되었습니다!');
        navigate('/');
      }
    } catch (error) {
      console.error('게시글 처리 오류:', error);
    }
  };
  return (
    <StPageContainer>
      <StUserFeedContainer>
        <StH2>{existingFeed ? '게시글 수정' : '새 게시글 작성'}</StH2>
        <div>피드의 관심사를 선택해주세요🩷</div>
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
          <StTextAlign>Title</StTextAlign>
          <input
            type="text"
            className="titleInput"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="contextInput-container">
          <StTextAlign>Content</StTextAlign>
          <textarea
            className="contextInput"
            placeholder="내용을 입력해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>이미지를 첨부해주세요 📸</div>
        <StImgSelectBtnContainer>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </StImgSelectBtnContainer>
        <StImageInputContainer>
          {previewImage ? (
            <img className="preview-img" src={previewImage} alt="preview" />
          ) : (
            <div className="default-img">{'No Image'} </div>
          )}
        </StImageInputContainer>
        <div className="button-container">
          <button id="upload-button" onClick={handleSaveFeed}>
            {existingFeed ? '수정 완료' : '포스팅하기'}
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
  border-radius: 15px;
  padding: 20px;
  gap: 20px;
  background-color: white;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  min-width: 500px;
  margin-top: 100px;
  margin-bottom: 150px;

  .titleInput-container,
  .contextInput-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 320px;
    align-items: center;
  }

  .titleInput,
  .contextInput {
    width: 100%;
    /* max-width: 450px; */
    border-radius: 10px;
    border: 1px solid #ccc;
    font-size: 16px;
    height: 40px;
    padding: 8px;
  }

  .contextInput {
    height: 150px;
    resize: none;
  }

  .button-container {
    display: flex;
    justify-content: center;
    gap: 15px;
    width: 100%;
  }

  .button-container button {
    border-radius: 20px;
    border: 2px solid transparent;
    padding: 4px 10px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    transition: all 0.3s ease-in-out;
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.15);
  }

  .default-img {
    width: 320px;
    height: 300px;
    border-radius: 20px;
    border: 2px solid #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #ffffff;
    background-color: #c4c4c4;
    box-shadow: rgba(100, 100, 111, 0.2);
  }

  .preview-img {
    width: 300px;
    height: 300px;
    border-radius: 20px;
    object-fit: cover;
    border: 2px solid #d1d1d1;
  }

  #upload-button,
  #save-button {
    background-color: #000000;
    color: white;
    /* border: 2px solid #3cb0a0; */

    &:hover {
      /* background-color: #3cb0a0; */
      color: white;
      transform: scale(1.05);
      box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: scale(0.98);
    }
  }

  #cancle-button {
    background-color: #ff4d4d;
    color: white;

    &:hover {
      background-color: #d93636;
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
  max-width: 250px;
  padding: 10px;
`;

const StCategoryButton = styled.button`
  background-color: ${(props) => (props.selected ? '#0f4e49' : '#419488')};
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  padding: 4px 10px;
  /* border: 3px solid ${(props) =>
    props.selected ? '#0f4e49' : '#419488'}; */
  border: none;
  transition: all 0.3s ease-in-out;
  /* box-shadow: ${(props) =>
    props.selected
      ? '4px 4px 10px rgba(0, 0, 0, 0.25)'
      : '3px 3px 8px rgba(0, 0, 0, 0.15)'}; */

  &:hover {
    transform: scale(1.1);
    background: #419488;
    /* background-color: ${(props) =>
      props.selected ? '#000000' : '#000000'}; */
    box-shadow: 5px 5px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.92);
  }
`;

const StImgSelectBtnContainer = styled.label`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  width: 320px;
`;

const StTextAlign = styled.div`
  display: flex;
  justify-content: flex-start;
  font-weight: 600;
  align-items: flex-start;
  width: 100%;
`;

const StFileSelectBtn = styled.input`
  border-radius: 8px;
  background-color: gray;
`;

const StH2 = styled.h1`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 30px;
  border-bottom: 1px solid grey;
`;
