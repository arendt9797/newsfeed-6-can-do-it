import { useState } from 'react';
import { supabase } from '../supabase/client';
import categories from '../constants/categories';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import { toggleInterest } from '../shared/utils/categoryUtils';
import { validateBlog, validateEmail, validateGithub, validateNickname, validatePassword } from '../shared/utils/validationUtils';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [myImage, setMyImage] = useState(null);
  const [myNickname, setMyNickname] = useState('');
  const [myBlog, setMyBlog] = useState('');
  const [myGithub, setMyGithub] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [uploadedFileName, setUploadedFileName] =
    useState('사진을 선택해주세요');
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMyImage(file);
      setUploadedFileName(file.name);
    }

    // FileReader를 사용하여 이미지 미리보기 생성
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewImage(reader.result); // 변환된 data URL 저장
    };
  };

  // 내 관심 카테고리 선택
  const toggleInterestHandler = (category) => toggleInterest(category, setSelectedInterests, selectedInterests)
  
  const handleSignup = async (e) => {
    e.preventDefault();

    // 검증단계
    if (!myImage) {
      alert('프로필 이미지를 선택해주세요.');
      return;
    }
    if (selectedInterests.length < 3) {
      alert('카테고리 3개를 선택해주세요.');
      return;
    }
    if (!validateEmail(email)) return alert("이메일 형식이 올바르지 않습니다.");
    if (!validatePassword(password)) return alert("비밀번호는 대소문자,숫자, 특수문자포함하여 8자 이상이어야 합니다.")
    if (!validateNickname(myNickname)) return alert("닉네임은 2~8자 한글, 영어, 숫자 조합만 가능합니다.");
    if (!validateGithub(myGithub)) return alert("GitHub URL 형식이 올바르지 않습니다.");
    if (!validateBlog(myBlog)) return alert("블로그 URL 형식이 올바르지 않습니다.");

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
      const { data: publicUrl } = supabase.storage
        .from('profile-image')
        .getPublicUrl(`public/${uniqueImageName}`);
      const { error: userError } = await supabase.from('users').insert({
        id: authUser.id,
        nickname: myNickname,
        github: myGithub,
        blog: myBlog,
        my_profile_image_url: publicUrl.publicUrl,
      });
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
            <img
              className="logo-img"
              src="/src/assets/test-logo.png"
              alt="site_logo"
              onClick={() => navigate('/')}
            />
            {previewImage ? (
              <img className="preview-img" src={previewImage} alt="preview" />
            ) : (
              <div className="default-img">{'No Image'} </div>
            )}
            <div className="file-wrapper">
              <input
                type="file"
                id="file-upload"
                // onChange={(e) => setMyImage(e.target.files[0])}
                onChange={handleFileChange}
              />
              <StLabel htmlFor="file-upload">{'🧷'}</StLabel>
              <StFileName>{uploadedFileName}</StFileName>
            </div>

            <button type="submit">{'Sign up'}</button>
            <footer>
              {'Already a member? '}
              <Link to={'/sign-in'}>{'Sign In'}</Link>
            </footer>
          </div>
          <div className="user-info">
            <div>
              <p>{'Nickname'}</p>
              <input
                type="text"
                placeholder="  닉네임을 입력해주세요"
                value={myNickname}
                onChange={(e) => setMyNickname(e.target.value)}
                required
              />
            </div>
            <div>
              <p>{'E-mail'}</p>
              <input
                type="email"
                placeholder="  이메일을 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <p>{'Password'}</p>
              <input
                type="password"
                placeholder="  비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <p>{'Github'}</p>
              <input
                type="text"
                placeholder="  깃헙이 있다면 알려주세요"
                value={myGithub}
                onChange={(e) => setMyGithub(e.target.value)}
              />
            </div>
            <div>
              <p>{'Blog'}</p>
              <input
                type="text"
                placeholder="  블로그가 있다면 알려주세요"
                value={myBlog}
                onChange={(e) => setMyBlog(e.target.value)}
              />
              {/* 🔹 관심 카테고리 선택 버튼 */}
            </div>
            <div className="categories">
              <p>{'⭐흥미있는 카테고리 3개를 골라주세요!'}</p>
              {categories.map((category) => (
                <StCategoryButton
                  key={category}
                  type="button"
                  onClick={() => toggleInterestHandler(category)}
                  selected={selectedInterests.includes(category)}
                >
                  {category}
                </StCategoryButton>
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

  form {
    height: 800px;
  }

  /* ========== 회원가입 왼쪽: 프로필 이미지 영역 =========== */
  .user-image {
    grid-area: image;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .logo-img {
    width: 130px;
    border-radius: 20px;
    margin-bottom: 50px;
    cursor: pointer;
  }

  footer {
    position: absolute;
    bottom: 10px;
    font-size: 20px;
    font-weight: bold;
    color: #2baa84;
  }

  .user-image > button {
    width: 250px;
    height: 50px;
    border: none;
    border-radius: 10px;
    margin-top: 50px;
    background-color: #46d7ab;
    color: #21212e;
    font-size: 24px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #46e4b5;
    }
  }

  /* input file 커스터마이즈 */
  .file-wrapper > input {
    display: none;
  }

  .file-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    padding: 5px;
    border: 1px solid #d1d1d1;
    border-radius: 5px;
    width: 300px;
    height: 40px;
  }

  /* 미리보기 기능 */
  .preview-img {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #d1d1d1;
  }

  .default-img {
    width: 300px;
    height: 300px;
    border-radius: 50%;
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

  /* ========== 회원가입 오른쪽: 유저정보 영역 ========== */
  .user-info {
    grid-area: info;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .user-info input {
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

  .user-info p {
    height: 20px;
  }

  .categories {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    width: 350px;
    gap: 5px;
  }

  .categories > p {
    font-size: large;
    font-weight: bold;
    margin-bottom: 10px;
  }
`;

const StCategoryButton = styled.button`
  width: 80px;
  padding: 8px 12px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? '#0d8b67' : 'transparent')};
  color: ${({ selected }) => (selected ? 'white' : 'black')};
  font-size: medium;
  border: 1px solid #ccc;
  border-radius: 5px;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#13ad82' : '#c6eee2')};
  }
`;

/* input file 커스터마이즈 */
const StLabel = styled.label`
  background-color: #21212e;
  padding: 10px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #46d7ab;
  }
`;

const StFileName = styled.span`
  font-size: 14px;
  height: 20px;
  color: #21212e;
  /* 파일명이 길 경우 말줄임표(...) 표시 */
  width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
`;
