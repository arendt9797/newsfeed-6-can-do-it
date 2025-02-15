import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

function AboutUs() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('사용자 정보 가져오기 오류:', error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>About Our Project</h1>
      <h2>Hi Developer!</h2>
      {users && users.length > 0 ? (
        users.map((user) => <div key={user.id}>{user.nickname}</div>)
      ) : (
        <p>등록된 사용자가 없습니다.</p>
      )}
    </div>
  );
}

export default AboutUs;
