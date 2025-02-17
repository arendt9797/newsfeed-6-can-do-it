import styled from 'styled-components';
import HomeFeedCard from './HomeFeedCard';
import { useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { Link } from 'react-router-dom';

const HomeList = () => {
  const [feeds, setFeeds] = useState([]);
  const { isLogin } = useContext(AuthContext);

  useEffect(() => {
    const getFeeds = async () => {
      try {
        const { data } = await supabase
          .from('feeds')
          .select('*, user: users(nickname, my_profile_image_url)');
        setFeeds(data);
      } catch (error) {
        console.log(error);
      }
    };
    getFeeds();
  }, []);

  return (
    <StHomeWrap>
      <div>
        {feeds
          //new Date : 문자열을 날짜 객체로 변환
          //supabase의 created_at은 날짜 문자열
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((feed) => {
            return (
              <HomeFeedCard key={feed.id} feed={feed} setFeeds={setFeeds} />
            );
          })}
      </div>
      <div>
        <Link to={isLogin ? '/create-feed' : '/sign-in'}>
          <StButton>+</StButton>
        </Link>
      </div>
    </StHomeWrap>
  );
};

export default HomeList;

const StHomeWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  height: auto;
  overflow-y: auto;
  padding: 100px;
`;

const StButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  margin-left: 50px;
  position: fixed;
  right: 80px;
  top: 80px;
  z-index: 10;

  &:hover {
    background-color: lightgrey;
  }
`;
