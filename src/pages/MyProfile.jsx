import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../supabase/client";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import categories from "../constants/categories";
import { validateBlog, validateEmail, validateGithub, validateNickname, validatePassword } from "../shared/utils/validationUtils";
import { handleImageChange, handleImageUpload } from "../shared/utils/fileUtils";
import { toggleInterest } from "../shared/utils/categoryUtils";

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
  const [selectedInterests, setSelectedInterests] = useState([]);

  useEffect(() => {
    //로그인이 아닐시 실행안함
    if (!isLogin) return;

    const fetchUserData = async () => {

      try {
        // 1. 로그인한 사용자 정보 가져오기 (auth)
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        const userId = authData.user.id;

        // 2. users 테이블에서 추가적인 유저정보 가져오기 (로그인한 유저)
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("nickname, github, blog, my_profile_image_url")
          .eq("id", userId)
          .single();

        if (userError) throw userError;

        // 3. user_interests 테이블에서 현재 사용자의 관심사 가져오기
        const { data: interestData, error: interestError } = await supabase
          .from("user_interests")
          .select("user_interest")
          .eq("user_id", userId);

        if (interestError) throw interestError;

        // 4. 관심사 배열을 selectedInterests에 설정
        const userInterests = interestData.map((item) => item.user_interest);

        // 5. profile 상태 업데이트
        setProfile({
          id: userId,
          nickname: userData.nickname,
          email: authData.user.email,
          password: "",
          github: userData.github,
          blog: userData.blog,
          my_profile_image_url: userData.my_profile_image_url,
        });

        // 6. selectedInterests 상태에 기존 관심사 설정
        setSelectedInterests(userInterests);
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

  // 프로필 업데이트 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 검증 단계
    if (!validateEmail(profile.email)) return alert("이메일 형식이 올바르지 않습니다.");
    if (!validateNickname(profile.nickname)) return alert("닉네임은 2~8자 한글, 영어, 숫자 조합만 가능합니다.");
    if (!validateGithub(profile.github)) return alert("GitHub URL 형식이 올바르지 않습니다.");
    if (!validateBlog(profile.blog)) return alert("블로그 URL 형식이 올바르지 않습니다.");
    // if (!validatePassword(profile.password)) return alert("비밀번호는 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.");

    try {

      // 기존 관심사 삭제
      const { error: interestError } = await supabase
        .from("user_interests")
        .delete()
        .eq("user_id", profile.id);

      if (interestError) throw interestError;

      // 새로운 관심사 추가
      const { error: selectInterestError } = await supabase
        .from("user_interests")
        .insert(
          selectedInterests.map((category) => ({
            user_id: profile.id,
            user_interest: category,
          }))
        );

      if (selectInterestError) throw selectInterestError;

      // 비밀번호 업데이트
      if (profile.password) {
        const { error: pwError } = await supabase.auth.updateUser({
          password: profile.password,
        });

        if (pwError) throw pwError;
      }

      // 프로필 정보 업데이트
      const { error: profileError } = await supabase
        .from("users")
        .update({
          nickname: profile.nickname,
          github: profile.github,
          blog: profile.blog,
          my_profile_image_url: profile.my_profile_image_url,
        })
        .eq("id", profile.id);

      if (profileError) throw profileError;

      alert("신분세탁 완료!");
    } catch (error) {
      console.error("Update error =>", error);
      alert("프로필 업데이트에 실패했습니다.");
    }
  };


  //이미지 변경 및 업로드 핸들러
  const handleImageSelection = (e) => {
    handleImageChange(e, setImage);
  };
  const handleImageUpdate = async () => {
    try {
      const imageUrl = await handleImageUpload(image, profile);
      if (imageUrl) {
        setProfile((prev) => ({ ...prev, my_profile_image_url: imageUrl }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StProfileContainer>
      <h2>My Profile</h2>
      {/* 왼쪽: 프로필 이미지 */}
      <StImageContainer>
        <StProfileImage src={profile.my_profile_image_url ? profile.my_profile_image_url : "/src/assets/test-logo.png"} alt="프로필 이미지" />
        <input type="file" onChange={handleImageSelection} />
        <button onClick={handleImageUpdate}>이미지 수정</button>
      </StImageContainer>

      <StFormContainer onSubmit={handleSubmit}>
        {/* 오른쪽: 입력 필드 및 버튼 */}
        <StForm>
          <label>E-mail</label>
          <StInput type="email" name="email" value={profile.email} readOnly />

          <label>닉네임</label>
          <StInput type="text" name="nickname" value={profile.nickname} onChange={handleChange} />

          <label>비밀번호</label>
          <StInput type="password" name="password" value={profile.password || ""} onChange={handleChange} />

          <label>GitHub</label>
          <StInput type="url" name="github" value={profile.github || ""} onChange={handleChange} />

          <label>Blog</label>
          <StInput type="url" name="blog" value={profile.blog || ""} onChange={handleChange} />

          <label>관심사</label>
          {/* 🔹 관심 카테고리 선택 버튼 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  toggleInterest(category, setSelectedInterests)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  backgroundColor: selectedInterests.includes(category)
                    ? '#007bff'
                    : '#f0f0f0',
                  color: selectedInterests.includes(category) ? 'white' : 'black',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                }}
              >
                {category}
              </button>
            ))}
          </div>

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