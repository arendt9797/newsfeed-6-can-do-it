import { useState } from 'react';
import { supabase } from '../supabase/client';
// import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [myImage, setMyImage] = useState(null);
  const [myNickname, setMyNickname] = useState('');
  const [myBlog, setMyBlog] = useState('');
  const [myGithub, setMyGithub] = useState('');

  // const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!myImage) return;

    try {
      const {
        data: { user: authUser }, error: signupError
      } = await supabase.auth.signUp({
        email,
        password,
      });
      if(signupError) throw signupError

      const { error: storageError } = await supabase.storage
        .from('profile-image') 
        .upload(`public/${myImage.name}`, myImage); 
      if (storageError) throw storageError;

      // 텍스트 추가 정보 public에 저장하기
      const { error: userError } = await supabase
        .from('users')
        .insert({ 
          id: authUser.id, 
          nickname: myNickname, 
          github: myGithub, 
          blog: myBlog, 
          my_profile_image_url: `${import.meta.env.VITE_APP_SUPABASE_URL}/storage/v1/object/public/test-signup-image/public/${myImage.name}`
        });
      if (userError) throw userError;

      // 프로필 이미지 추가 정보 storage에 저장하기
      // alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      // navigate("/sign-in");
    } catch (error) {
      alert(error.message);
      console.error('회원가입 오류:', error);
    }
  };

  return (
    <div>
      <h2>회원가입 페이지</h2>
      <form
        onSubmit={handleSignup}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <input
          type="file"
          onChange={(e) => setMyImage(e.target.files[0])}
        />
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
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Signup;
