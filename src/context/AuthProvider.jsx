import { useEffect, useState, createContext } from 'react';
import { supabase } from '../supabase/client';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  // const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsLogin(true);
        // setUser(session.user);
      } else {
        setIsLogin(false);
        // setUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin }}>{children}</AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
