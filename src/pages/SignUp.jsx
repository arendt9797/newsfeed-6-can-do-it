import { useState } from 'react';
import { supabase } from '../supabase/client';
import categories from '../constants/categories';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [myImage, setMyImage] = useState(null);
  const [myNickname, setMyNickname] = useState('');
  const [myBlog, setMyBlog] = useState('');
  const [myGithub, setMyGithub] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const navigate = useNavigate();

  // 내 관심 카테고리 선택
  const toggleInterest = (category) => {
    setSelectedInterests((prev) => {
      if (prev.includes(category)) {
        return prev.filter((selected) => selected !== category);
      } else if (prev.length < 3) {
        return [...prev, category];
      } else {
        return prev;
      }
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    // 프로필 사진 필수 업로드
    if (!myImage) {
      console.error('프로필 사진을 올려주세요!');
      return;
    }
    // 카테고리 필수 3개 선택
    if (selectedInterests.length < 3) {
      console.error('3개를 선택해주세요!');
      return;
    }

    try {
      const {
        data: { user: authUser },
        error: signupError,
      } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signupError) throw signupError;

      // 프로필 이미지 추가 정보 storage에 저장
      // 파일 중복 및 한글 파일명 오류 해결을 위해 uuid를 활용하여 파일명 변경
      const imageExt = myImage.name.split('.').pop(); // 확장자 추출
      const uniqueImageName = `${uuidv4()}.${imageExt}`; // UUID + 원래 확장자
      const { error: storageError } = await supabase.storage
        .from('profile-image')
        .upload(`public/${uniqueImageName}`, myImage);
      if (storageError) throw storageError;

      // 텍스트 추가 정보 public users에 저장
      const {data: publicUrl} = supabase.storage.from('profile-image').getPublicUrl(`public/${uniqueImageName}`)
      const { error: userError } = await supabase.from('users').insert({
        id: authUser.id,
        nickname: myNickname,
        github: myGithub,
        blog: myBlog,
        my_profile_image_url: publicUrl.publicUrl});
      if (userError) throw userError;

      // 내 관심 카테고리 정보 public user_interests에 저장
      const { error: categoryError } = await supabase
        .from('user_interests')
        .insert(
          selectedInterests.map((interest) => ({
            user_id: authUser.id,
            user_interest: interest,
          })),
        );
      if (categoryError) throw categoryError;

      // 완료되면 로그인 페이지로 이동
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/sign-in');
    } catch (error) {
      alert(error.message);
      console.error('회원가입 오류:', error);
    }
  };

  return (
    <StSignUp>
      <StSignUpContainer>
        <form onSubmit={handleSignup}>
          <div className="user-image">
            <img src="/src/assets/test-logo.png" alt="site_logo" />
            <div className="file-wrap">
              <input
                type="file"
                className="input-file"
                onChange={(e) => setMyImage(e.target.files[0])}
              />
              {/* <label className='label-file' htmlFor='file'></label> */}
              <span className='span-file'></span>
            </div>

            <button type="submit">{'Sign up'}</button>
            <footer>
              {'Already a member? '}
              <Link to={'/sign-up'}>{'Sign In'}</Link>
            </footer>
          </div>
          <div className="user-info">
            <input
              type="text"
              placeholder="이름"
              value={myNickname}
              onChange={(e) => setMyNickname(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="깃헙"
              value={myGithub}
              onChange={(e) => setMyGithub(e.target.value)}
            />
            <input
              type="text"
              placeholder="블로그"
              value={myBlog}
              onChange={(e) => setMyBlog(e.target.value)}
            />
            {/* 🔹 관심 카테고리 선택 버튼 */}
            <div className="categories">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleInterest(category)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: selectedInterests.includes(category)
                      ? '#007bff'
                      : '#f0f0f0',
                    color: selectedInterests.includes(category)
                      ? 'white'
                      : 'black',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </form>
      </StSignUpContainer>
    </StSignUp>
  );
};

export default Signup;

const StSignUp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const StSignUpContainer = styled.div`
  width: 800px;
  height: 800px;
  border: 3px solid #d1d1d1;
  border-radius: 20px;
  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'image info';
    /* gap: 20px; */
  }

  /* 회원가입 왼쪽: 프로필 이미지 영역 */
  .user-image {
    grid-area: image;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  img {
    width: 130px;
    border-radius: 20px;
  }

  footer {
    position: absolute;
    bottom: 0px;
    font-size: 20px;
    font-weight: bold;
    color: #2baa84;
  }

  .user-image > button {
    width: 250px;
    height: 50px;
    border: none;
    border-radius: 10px;
    margin-top: 20px;
    background-color: #46d7ab;
    color: #21212e;
    font-size: 24px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #46e4b5;
    }
  }

  /* 회원가입 오른쪽: 유저정보 영역 */
  .user-info {
    grid-area: info;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .user-info > input {
    font-size: 16px;
    height: 50px;
    width: 300px;
    border: none;
    border-bottom: 3px solid #21212e;
    outline: none;
    transition: border-bottom 0.4s ease-in-out;

    &:focus {
      border-bottom: 3px solid #46d7ab;
    }
  }

  .categories {
    display: flex;
    flex-wrap: wrap;
    width: 350px;
    gap: 5px;
  }

  .categories > button {
    width: 80px;
  }
`;
