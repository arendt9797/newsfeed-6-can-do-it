// AboutUs.jsx
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

function AboutUs() {
  const [users, setUsers] = useState([]); // 사용자 데이터 저장

  useEffect(() => {
    const fetchUsers = async () => {
      // users 테이블 데이터 가져오기
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'developer'); // role 값이 developer인 사용자만
      if (error) {
        console.error('개발자 정보 가져오기 오류:', error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <StyledAboutUsContainer>
        <div>
          <StyledAboutUsTitle>Meet Our Developers</StyledAboutUsTitle>
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
                    <StyledLinks>
                      {user.github && (
                        <StyledLink href={user.github} target="_blank">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                            alt="Github"
                          />
                        </StyledLink>
                      )}
                      {user.blog && (
                        <StyledLink href={user.blog} target="_blank">
                          <img
                            src="https://cdn-icons-png.flaticon.com/128/3669/3669981.png"
                            alt="Blog"
                          />
                        </StyledLink>
                      )}
                    </StyledLinks>
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

const StyledAboutUsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const StyledAboutUsTitle = styled.h1`
  text-align: center;
  font-size: 3.5rem;
  color: #333;
  margin-bottom: 2rem;
`;

const StyledTeamMemberList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2.5rem;
  padding: 0;
  list-style: none;
  width: 100%;
  max-width: 1200px;
`;

const StyledTeamMemberCard = styled.li`
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledMemberPhoto = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #ddd;
  margin-bottom: 1rem;
`;

const StyledMemberInfo = styled.div`
  text-align: center;
  h3 {
    margin-bottom: 1rem;
    color: #444;
  }
`;

const StyledLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const StyledLink = styled.a`
  display: inline-block;
  img {
    width: 28px;
    height: 28px;
    transition: transform 0.2s ease;
  }
  &:hover img {
    transform: scale(1.1);
  }
`;

export default AboutUs;
