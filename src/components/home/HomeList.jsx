import styled from 'styled-components';
import HomeFeedCard from './HomeFeedCard';
import { useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

const emtpyArr = Array(2).fill(0);

const HomeList = () => {
  const [feeds, setFeeds] = useState([]);
  const { isLogin } = useContext(AuthContext);
  const [query] = useSearchParams();
  const userId = query.get('id');

  useEffect(() => {
    const getFeeds = async () => {
      try {
        const { data } = await supabase
          .from('feeds')
          .select('*, user: users(nickname, my_profile_image_url)');
        setFeeds(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getFeeds();
  }, []);

  return (
    <StHomeWrap>
      <div>
        {feeds.map((feed) => {
          return !userId ? (
            <HomeFeedCard key={feed.id} feed={feed} />
          ) : (
            userId === feed.user_id && (
              <HomeFeedCard key={feed.id} feed={feed} />
            )
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
  position: fixed; /* 고정 위치 */
  right: 80px; /* 오른쪽 20px 여백 */
  top: 80px; /* 아래쪽 20px 여백 */
  z-index: 10; /* 버튼이 다른 요소들 위에 보이도록 설정 */

  &:hover {
    background-color: lightgrey;
  }
`;
