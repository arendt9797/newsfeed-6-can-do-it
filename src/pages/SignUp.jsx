import { useState } from 'react';
import { supabase } from '../supabase/client';
import categories from '../constants/categories';
// import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [myImage, setMyImage] = useState(null);
  const [myNickname, setMyNickname] = useState('');
  const [myBlog, setMyBlog] = useState('');
  const [myGithub, setMyGithub] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);

  // const navigate = useNavigate();

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
    if (!myImage) {
      console.error('프로필 사진을 올려주세요!');
      return;
    }
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

      // 프로필 이미지 추가 정보 storage에 저장하기
      const { error: storageError } = await supabase.storage
        .from('profile-image')
        .upload(`public/${myImage.name}`, myImage);
      if (storageError) throw storageError;

      // 텍스트 추가 정보 public에 저장하기
      const { error: userError } = await supabase.from('users').insert({
        id: authUser.id,
        nickname: myNickname,
        github: myGithub,
        blog: myBlog,
        my_profile_image_url: `${
          import.meta.env.VITE_APP_SUPABASE_URL
        }/storage/v1/object/public/test-signup-image/public/${myImage.name}`,
      });
      if (userError) throw userError;

      // my_interests 테이블에 카테고리 정보 삽입. 각 카테고리 당 하나의 행을 삽입해야함
      // user_id 속성은 context에서 가져와야 한다... 가 아닌가? 로그인한 상태가 아니잖아.
      // 위의 코드가 순서대로 실행되니까 현재 로그인한 유저 정보가 있다고 봐야하나?
      // 로그인 실패해도 이미지 파일은 그대로 올라가는거 보면 그럴지도.
      // 아니구나!! authUser.id를 사용하면 되네!!!!!!!!!!
      const { error: categoryError } = await supabase
        .from('my_interests')
        .insert(
          selectedInterests.map((interest) => ({
            user_id: authUser.id,
            user_interest: interest,
          })),
        );
      if (categoryError) throw categoryError;

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
        <input type="file" onChange={(e) => setMyImage(e.target.files[0])} />
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
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
                color: selectedInterests.includes(category) ? 'white' : 'black',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            >
              {category}
            </button>
          ))}
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Signup;
