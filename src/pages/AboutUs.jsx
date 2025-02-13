import styled from 'styled-components';

// 임시 데이터
const temporaryTeamMembers = [
  {
    id: '1',
    name: '홍길동',
    introduction: '안녕하세요, 저는 프론트엔드 개발자입니다.',
    photoUrl:
      'https://blog.kakaocdn.net/dn/bqg9hW/btsLKBNvc3P/bJeaXFDmwVGjsivHLrkf1K/img.png',
  },
  {
    id: '2',
    name: '김철수',
    introduction: '안녕하세요, 저는 프론트엔드 개발자입니다.',
    photoUrl:
      'https://blog.kakaocdn.net/dn/bqg9hW/btsLKBNvc3P/bJeaXFDmwVGjsivHLrkf1K/img.png',
  },
  {
    id: '3',
    name: '김철수',
    introduction: '안녕하세요, 저는 프론트엔드 개발자입니다.',
    photoUrl:
      'https://blog.kakaocdn.net/dn/bqg9hW/btsLKBNvc3P/bJeaXFDmwVGjsivHLrkf1K/img.png',
  },
  {
    id: '4',
    name: '김철수',
    introduction: '안녕하세요, 저는 프론트엔드 개발자입니다.',
    photoUrl:
      'https://blog.kakaocdn.net/dn/bqg9hW/btsLKBNvc3P/bJeaXFDmwVGjsivHLrkf1K/img.png',
  },
  {
    id: '5',
    name: '김철수',
    introduction: '안녕하세요, 저는 프론트엔드 개발자입니다.',
    photoUrl:
      'https://blog.kakaocdn.net/dn/bqg9hW/btsLKBNvc3P/bJeaXFDmwVGjsivHLrkf1K/img.png',
  },
  {
    id: '6',
    name: '김철수',
    introduction: '안녕하세요, 저는 프론트엔드 개발자입니다.',
    photoUrl:
      'https://blog.kakaocdn.net/dn/bqg9hW/btsLKBNvc3P/bJeaXFDmwVGjsivHLrkf1K/img.png',
  },
];

// AboutUs 컴포넌트
function AboutUs() {
  return (
    <StyledAboutUsContainer>
      <StyledTitle>About Us</StyledTitle>
      <StyledTeamMemberList>
        {temporaryTeamMembers.map((member) => (
          <StyledTeamMemberCard key={member.id}>
            <StyledMemberPhoto src={member.photoUrl} alt={member.name} />
            <StyledMemberInfo>
              <h3>{member.name}</h3>
              <p>{member.introduction}</p>
            </StyledMemberInfo>
          </StyledTeamMemberCard>
        ))}
      </StyledTeamMemberList>
    </StyledAboutUsContainer>
  );
}

const StyledAboutUsContainer = styled.div`
  margin: 0 auto;
`;

const StyledTitle = styled.h1`
  text-align: center;
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
  border-radius: 8px;
  padding: 10px;
`;

const StyledMemberPhoto = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-right: 20px;
  margin-left: 5px;
`;

const StyledMemberInfo = styled.div`
  h3 {
    margin: 0;
  }

  p {
    margin: 0;
  }
`;
export default AboutUs;
