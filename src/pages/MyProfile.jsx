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
      <StForm onSubmit={handleSubmit} >
        <label>이미지</label>
        <StInput type="file" value={profile.image} onChange={handleChange} />

        <label>아이디</label>
        <StInput type="text" value={profile.userId} onChange={handleChange} />

        <label>비밀번호</label>
        <StInput type="text" value={profile.password} onChange={handleChange} />

        <label>E-mail</label>
        <StInput type="text" value={profile.email} onChange={handleChange} />

        <label>GitHub</label>
        <StInput type="url" value={profile.github} onChange={handleChange} />

        <label>Blog</label>
        <StInput type="url" value={profile.blog} onChange={handleChange} />

        <label>관심사?</label>

        <StButton>수정완료</StButton>
      </StForm>
    </StProfileContainer>
  );
}

export default MyProfile;

const StProfileContainer = styled.div`
  width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
`;

const StForm = styled.form`
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