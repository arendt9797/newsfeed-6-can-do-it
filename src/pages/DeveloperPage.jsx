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
  const handleDeleteUser = async () => {};
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
                    <StyledH2>{user.role}</StyledH2>
                  </StyledMemberInfo>
                  <StDeleteButton onClick={handleDeleteUser}>
                    계정 삭제
                  </StDeleteButton>
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

const StDeleteButton = styled.button`
  width: 200px;
  height: 50px;
  border: none;
  border-radius: 10px;
  margin-top: 20px;
  background-color: #46d7ab;
  color: #21212e;
  font-size: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #46e4b5;
    /* color: white; */
  }
`;
export default DeveloperPage;
