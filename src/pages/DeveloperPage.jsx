// DeveloperPage.jsx
import { useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase/client';
import { useNavigate } from 'react-router-dom';

import {
  StyledAboutUsContainer,
  StyledAboutUsTitle,
  StyledTeamMemberList,
  StyledTeamMemberCard,
  StyledMemberPhoto,
  StyledMemberInfo,
} from './AboutUs';
import styled from 'styled-components';

function DeveloperPage() {
  const [users, setUsers] = useState([]);

  // 모든 사용자 정보 가져오기
  useEffect(() => {
    const fetchAllUsers = async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.error('모든 사용자 가져오기 오류:', error);
      } else {
        setUsers(data);
      }
    };
    fetchAllUsers();
  }, []);

  return (
    <>
      <StyledAboutUsContainer>
        <div>
          <StyledAboutUsTitle>All Users</StyledAboutUsTitle>
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
                    {/* 필요하다면 role, email, etc. 추가 */}
                    <StyledH2>{user.role}</StyledH2>
                  </StyledMemberInfo>
                </StyledTeamMemberCard>
              ))
            ) : (
              <p>등록된 사용자가 없습니다.</p>
            )}
          </StyledTeamMemberList>
        </div>
      </StyledAboutUsContainer>
    </>
  );
}
const StyledH2 = styled.h2`
  font-size: large;
  font-weight: bold;
`;
export default DeveloperPage;
