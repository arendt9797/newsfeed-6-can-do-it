import { useState } from "react";

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
    e.preventdefault();
    // supabase를 통해 프로필 업데이트 하는 로직
  };

  return <div>
    <h2>My Profile</h2>
    <form onChange={handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <label>이미지</label>
      <input type="file" value={profile.image} />
      <label>아이디</label>
      <input type="text" value={profile.userId} />
      <label>비밀번호</label>
      <input type="text" value={profile.password} />
      <label>E-mail</label>
      <input type="text" value={profile.email} />
      <label>GitHub</label>
      <input type="url" value={profile.github} />
      <label>Blog</label>
      <input type="url" value={profile.blog} />
      <label>관심사?</label>
      <button>수정완료</button>
    </form>
  </div>;
}

export default MyProfile;
