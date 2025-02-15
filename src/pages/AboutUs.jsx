// AboutUs.jsx
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

function AboutUs() {
  const [users, setUsers] = useState([]); // 사용자 데이터 저장

  useEffect(() => {
    const fetchUsers = async () => {
      // users 테이블 데이터 가져오기
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
    <StyledAboutUsContainer>
      <div>
        <h1>About Our Project</h1>
      </div>
      <div>
        <h2>Hi Developer!</h2>
        <StyledTeamMemberList>
          {users && users.length > 0 ? (
            users.map((user) => (
              <StyledTeamMemberCard key={user.id}>
                <StyledMemberPhoto
                  src={user.my_profile_image_url}
                  alt={user.nickname || 'User'}
                />
                <StyledMemberInfo>
                  <h3>{user.nickname}</h3>
                  {user.github && (
                    <p>
                      <a href={user.github} target="_blank">
                        Github
                      </a>
                    </p>
                  )}
                  {user.blog && (
                    <p>
                      <a href={user.blog} target="_blank">
                        Blog
                      </a>
                    </p>
                  )}
                </StyledMemberInfo>
              </StyledTeamMemberCard>
            ))
          ) : (
            <p>등록된 사용자가 없습니다.</p>
          )}
        </StyledTeamMemberList>
      </div>
    </StyledAboutUsContainer>
  );
}

const StyledAboutUsContainer = styled.div`
  margin: 0 auto;
`;

const StyledTeamMemberList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const StyledTeamMemberCard = styled.li`
  display: flex;
  float: left;
  align-items: center;
  width: 500px;
  height: 150px;
  margin: 20px 90px;
  border: 1px solid #ccc;
  padding: 10px;
`;

const StyledMemberPhoto = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-right: 20px;
  margin-left: 5px;
`;

const StyledMemberInfo = styled.div``;

export default AboutUs;
