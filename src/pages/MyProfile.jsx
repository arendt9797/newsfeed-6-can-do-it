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
    if (!isLogin) return;
    fetchUserProfile();
    fetchUserInterests();
  }, [isLogin]);

  //  1. 사용자 프로필 가져오는 함수
  const fetchUserProfile = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      const userId = authData.user.id;

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("nickname, github, blog, my_profile_image_url")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      setProfile((prev) => ({
        ...prev,
        id: userId,
        nickname: userData.nickname,
        email: authData.user.email,
        github: userData.github,
        blog: userData.blog,
        my_profile_image_url: userData.my_profile_image_url,
      }));

    } catch (error) {
      console.error("사용자 정보 불러오기 실패:", error);
    }
  };

  //  2. 관심사 가져오는 함수
  const fetchUserInterests = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user.id;

      const { data: interestData, error: interestError } = await supabase
        .from("user_interests")
        .select("user_interest")
        .eq("user_id", userId);

      if (interestError) throw interestError;

      setSelectedInterests(interestData.map((item) => item.user_interest));
    } catch (error) {
      console.error("관심사 정보 불러오기 실패:", error);
    }
  };

  //  3. 관심사 업데이트 함수
  const updateUserInterests = async () => {
    try {
      await supabase.from("user_interests").delete().eq("user_id", profile.id);
      await supabase
        .from("user_interests")
        .insert(selectedInterests.map((category) => ({ user_id: profile.id, user_interest: category })));
    } catch (error) {
      console.error("관심사 업데이트 실패:", error);
      throw error;
    }
  };

  //  4. 비밀번호 업데이트 함수
  const updateUserPassword = async () => {
    if (!profile.password) return;
    try {
      await supabase.auth.updateUser({ password: profile.password });
    } catch (error) {
      console.error("비밀번호 업데이트 실패:", error);
      throw error;
    }
  };

  //  5. 프로필 정보 업데이트 함수
  const updateUserProfile = async (imageUrl) => {
    try {
      await supabase
        .from("users")
        .update({
          nickname: profile.nickname,
          github: profile.github,
          blog: profile.blog,
          my_profile_image_url: imageUrl,
        })
        .eq("id", profile.id);
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      throw error;
    }
  };

  //  6. 프로필 업데이트 핸들러 (최적화)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 검증 단계
    if (!validateEmail(profile.email)) return alert("이메일 형식이 올바르지 않습니다.");
    if (!validateNickname(profile.nickname)) return alert("닉네임은 2~8자 한글, 영어, 숫자 조합만 가능합니다.");
    if (!validateGithub(profile.github)) return alert("GitHub URL 형식이 올바르지 않습니다.");
    if (!validateBlog(profile.blog)) return alert("블로그 URL 형식이 올바르지 않습니다.");
    // if (!validatePassword(profile.password)) return alert("비밀번호는 대소문자,숫자, 특수문자포함하여 8자 이상이어야 합니다.")

    try {
      const imageUrl = await handleImageUpload(image, profile);
      if (imageUrl) {
        setProfile((prev) => ({ ...prev, my_profile_image_url: imageUrl }));
      }

      await Promise.all([updateUserProfile(imageUrl), updateUserInterests(), updateUserPassword()]);
      alert("프로필 업데이트 완료!");
    } catch (error) {
      console.error("프로필 업데이트에 실패", error);
    }
  };

  //  수정 내용 입력 핸들러
  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  return (
    <StMyProfile>
      <StMyProfileContainer>
        <form onSubmit={handleSubmit} >
          {/* 왼쪽: 프로필 이미지 */}
          <div className="user-image">
            <img className="logo-img" src="/public/doitLogo.png" alt="site_logo" />
            <img className="preview-img"
              src={profile.my_profile_image_url ? profile.my_profile_image_url : "/public/doitLogo.png"}
              alt="프로필 이미지"
              onClick={() => document.getElementById("file-upload").click()}
            />
            <input type="file" id="file-upload" onChange={(e) => handleImageChange(e, setImage)} style={{ display: "none" }} />
          </div>

          {/* 오른쪽: 입력 필드 및 버튼 */}
          <div className="user-info">
            <div>
              <p>{'E-mail'}</p>
              <input type="email" name="email" value={profile.email} readOnly />
            </div>
            <div>
              <p>{'Nickname'}</p>
              <input type="text" name="nickname" value={profile.nickname} onChange={handleChange} />
            </div>
            <div>
              <p>{'Password'}</p>
              <input type="password" name="password" value={profile.password || ""} onChange={handleChange} />
            </div>
            <div>
              <p>{'Github'}</p>
              <input type="url" name="github" value={profile.github || ""} onChange={handleChange} />
            </div>
            <div>
              <p>{'Blog'}</p>
              <input type="url" name="blog" value={profile.blog || ""} onChange={handleChange} />
            </div>

            {/* 🔹 관심 카테고리 선택 버튼 */}
            <div className="categories">
              <p>{'⭐ 관심 카테고리 (최대 3개 선택)'}</p>
              {categories.map((category) => (
                <StCategoryButton
                  key={category}
                  type="button"
                  onClick={() => toggleInterest(category, selectedInterests, setSelectedInterests)}
                  selected={selectedInterests.includes(category)}
                >
                  {category}
                </StCategoryButton>
              ))}
            </div>

            <StSubmitButton type="submit">수정완료</StSubmitButton>
          </div>
        </form>
      </StMyProfileContainer>
    </StMyProfile >
  );
}

export default MyProfile;

const StMyProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const StMyProfileContainer = styled.div`
  width: 800px;
  height: 800px;
  border: 3px solid #d1d1d1;
  border-radius: 20px;
  
  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'image info';
    height: 800px;
  }
    /* ========== 왼쪽: 프로필 이미지 영역 =========== */
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
    cursor: pointer;
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
   /* ========== 오른쪽: 유저정보 영역 ========== */
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
const StSubmitButton = styled.button`
  width: 150px;
    height: 50px;
    border: none;
    border-radius: 10px;
    background-color: #46d7ab;
    color: #21212e;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #46e4b5;
    }
`;