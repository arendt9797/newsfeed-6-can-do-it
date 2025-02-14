import { useState } from 'react';
import { supabase } from '../supabase/client';
// import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [myName, setMyName] = useState('');
  const [myBlog, setMyBlog] = useState('');
  const [myGithub, setMyGithub] = useState('');

  // const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.signUp({
        email,
        password,
      });

      const { error: userError } = await supabase
        .from('test_additional_py_profile')
        .insert({ id: authUser.id, myName, myGithub, myBlog });

      if (userError) throw userError;
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
          type="text"
          placeholder="이름"
          value={myName}
          onChange={(e) => setMyName(e.target.value)}
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
