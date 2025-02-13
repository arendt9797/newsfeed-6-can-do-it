import { useEffect, useState, createContext } from 'react';
import { supabase } from '../supabase/client';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);

      if (session) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });

    // 만일 이 코드가 전역상태로서 쓰인다면, 필요한 코드가 아니지만
    // 일부를 감싸는 컴포넌트에서 사용될 경우 구독해제가 필요하기 때문에 넣었어요!
    return () => subscription.unsubscribe();
  }, []); // DA의 빈 배열이 의미하는 것을 생각해보세요

  return (
    <AuthContext.Provider value={{ isLogin }}>{children}</AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider }
