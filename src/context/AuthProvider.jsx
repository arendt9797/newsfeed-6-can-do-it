import { useEffect, useState, createContext } from 'react';
import { supabase } from '../supabase/client';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  // 현재 로그인 중인지 확인하는 상태 'isLogin'
  const [isLogin, setIsLogin] = useState(false);
  // 현재 로그인한 유저의 auth스키마 정보를 저장하는 상태 'user'
  const [user, setUser] = useState({});

  const getUserInfo = async (session) => {
    // 로그아웃 됐을 경우
    if (!session) {
      setIsLogin(false);
      setUser(null);
      return;
    }

    // 로그인 됐을 경우
    setIsLogin(true);

    try {
      // 현재 로그인한 유저의 public스키마 정보(회원추가정보) 가져오기
      // FK로 연결된 값이 있다면 JOIN 기능을 활용해 추가 정보 + 관심 카테고리 한 번에 가져오기 가능!
      const { data: userData, error } = await supabase
        .from('users')
        .select(
          `
          nickname, github, blog, my_profile_image_url,
          user_interests (user_interest)  -- 👈 내 관심 카테고리 JOIN (SQL에서 한 줄 주석은 -- 으로 표시)
        `,
        )
        .eq('id', session.user.id)
        .maybeSingle(); // [ { ... } ] 형태로 반환하기 때문에 single()로 내부 하나의 객체만 가져온다
      if (error) throw error;
      setUser({ ...session.user, ...userData });
    } catch (error) {
      console.error('회원추가정보 가져오기 오류:', error);
      setUser(session.user);
    }
  };

  // onAuthStateChange를 사용하여 로그인 여부 변화 감지
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      getUserInfo(session);
    });

    // 로그인 상태가 변하지 않아도 onAuthStateChange가 여러 번 실행될 수 있음
    // 콘솔에 user를 출력해보면 너무 많이 찍히는 것을 방지 하기 위해 사용
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
