import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../supabase/client";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

function MyProfile() {

  const { isLogin } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    image_url: "",
    nickname: "",
    email: "",
    password: "",
    github: "",
    blog: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    //로그인이 아닐시 실행안함
    if (!isLogin) return;

    const fetchUserData = async () => {

      try {
        // 1. 로그인한 사용자 정보 가져오기 (auth)
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError) throw authError;
        const userEmail = authData.user.email;
        console.log(userEmail);

        // 2. users 테이블에서 추가적인 유저정보 가져오기 (로그인한 유저)

        // 3. profile 상태 업데이트
        setProfile();

      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [isLogin]);

  // 수정 내용 입력 함수
  const handleChange = (e) => {
    if (!profile) return;

    const { name, value } = e.target;

    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // 수정 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("users")
        .update({
          pw: profile.pw,
          email: profile.email,
          github: profile.github,
          blog: profile.blog,
        })
        .eq("userId", profile.userId).select("*");


      if (error) throw error;

      alert("신분세탁 완료!");
    } catch (error) {
      console.error("Update error =>", error);
    }
  };

  //파일 선택 호출 함수
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  //파일 업로드 함수
  const handleImageUpload = async () => {

    // 파일 저장 경로 (중복 방지를 위해 timestamp 추가)
    const filePath = `public/${Date.now()}_${image.name}`;

    if (!image) return;
    // storage에 이미지 업로드
    const { data, error } = await supabase
      .storage
      .from("profile-images")
      .upload(filePath, image);

    if (error) {
      console.error("업로드실패", error.message);
    } else {
      console.log("업로드성공", data);
    }

    //storage에 업로드된 이미지 URL 가져오기
    const { data: publicUrl } = supabase
      .storage
      .from("profile-images")
      .getPublicUrl(filePath);

    //table에 URL 저장
    const { error: updateError } = await supabase
      .from("users")
      .update({ my_profile_image_url: publicUrl.publicUrl })

    if (updateError) {
      console.error("URL업데이트 실패", updateError.message);
    } else {
      console.log("이미지 URL 업데이트 성공");
      setProfile((prev) => ({ ...prev, my_profile_image_url: publicUrl.publicUrl }));
    }
  };


  return (
    <StProfileContainer>
      <h2>My Profile</h2>
      {/* 왼쪽: 프로필 이미지 */}
      <StImageContainer>
        <StProfileImage src={profile.my_profile_image_url ? profile.my_profile_image_url : "/src/assets/test-logo.png"} alt="프로필 이미지" />
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleImageUpload}>이미지 수정</button>
      </StImageContainer>
      <StFormContainer onSubmit={handleSubmit}>

        {/* 오른쪽: 입력 필드 및 버튼 */}
        <StForm>
          <label>E-mail</label>
          <StInput type="email" name="userId" value={profile.email} readOnly />

          <label>닉네임</label>
          <StInput type="text" name="nickname" value={profile.nickname} onChange={handleChange} />

          <label>비밀번호</label>
          <StInput type="password" name="password" value={profile.password || ""} onChange={handleChange} />

          <label>GitHub</label>
          <StInput type="url" name="github" value={profile.github || ""} onChange={handleChange} />

          <label>Blog</label>
          <StInput type="url" name="blog" value={profile.blog || ""} onChange={handleChange} />

          <label>관심사?</label>

          <StButton type="submit">수정완료</StButton>
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
  flex: 1;
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
  flex: 1;
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