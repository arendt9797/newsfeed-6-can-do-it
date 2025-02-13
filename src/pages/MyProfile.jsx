import { useState } from "react";
import styled from "styled-components";

function MyProfile() {

  const [profile, setProfile] = useState({
    image: "",
    userId: "test",
    password: "test",
    email: "test",
    github: "test",
    blog: "test",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // supabase를 통해 프로필 업데이트 하는 로직
  };

  const handleChange = () => {

  };

  return (
    <StProfileContainer>
      <h2>My Profile</h2>
      <StFormContainer onSubmit={handleSubmit}>
        {/* 왼쪽: 프로필 이미지 */}
        <StImageContainer>
          <StProfileImage src={profile.image || "/src/assets/test-logo.png"} alt="프로필 이미지" />
          <input type="file" onChange={handleChange} />
        </StImageContainer>

        {/* 오른쪽: 입력 필드 및 버튼 */}
        <StForm>
          <label>아이디</label>
          <StInput type="text" value={profile.userId} onChange={handleChange} />

          <label>비밀번호</label>
          <StInput type="password" value={profile.password} onChange={handleChange} />

          <label>E-mail</label>
          <StInput type="email" value={profile.email} onChange={handleChange} />

          <label>GitHub</label>
          <StInput type="url" value={profile.github} onChange={handleChange} />

          <label>Blog</label>
          <StInput type="url" value={profile.blog} onChange={handleChange} />

          <label>관심사?</label>
          <input type="checkbox" />

          <StButton>수정완료</StButton>
        </StForm>
      </StFormContainer>
    </StProfileContainer>
  );
}

export default MyProfile;

const StProfileContainer = styled.div`
  width: 650px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  background: #fff;

  & h2 {
    margin-bottom: 30px;
    font-size: 25px;
    font-weight: bold;
  }
`;

// 전체 폼을 가로 정렬
const StFormContainer = styled.form`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 2rem;
  width: 100%;
  max-width: 600px;

  @media (max-width: 600px) {
    flex-direction: column; 
    align-items: center;
  }
`;

// 왼쪽 프로필 이미지
const StImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  gap: 1rem;
`;

const StProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
`;

// 오른쪽 입력 필드 및 버튼
const StForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`;

const StInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const StButton = styled.button`
  background: #201e1e;
  color: white;
  padding: 0.7rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #6b5f60;
  }
`;