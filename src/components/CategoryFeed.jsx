import React, { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthProvider';
import { supabase } from '../supabase/client';
import HomeFeedCard from './home/HomeFeedCard';

const CategoryFeed = () => {
  const [feeds, setFeeds] = useState([]);
  const [feedInterests, setFeedInterests] = useState([]);
  const { isLogin } = useContext(AuthContext);
  const [query] = useSearchParams();
  const categoryId = query.get('id');

  console.log('카테고리 ID:', categoryId);

  useEffect(() => {
    const getFeeds = async () => {
      try {
        // 관심사와 조인하여 데이터 가져오기
        const { data = [] } = await supabase
          .from('feed_interests')
          .select('feed:feeds(*, user:users(nickname, my_profile_image_url))')
          .eq('interest_name', categoryId); // 카테고리 ID 필터링

        const filteredFeeds = data.map((item) => item.feed).filter(Boolean);
        setFeeds(filteredFeeds);
      } catch (error) {
        console.error('피드 불러오기 오류:', error);
      }
    };

    if (categoryId) getFeeds(); // categoryId 유효성 확인
  }, [categoryId]); // categoryId 변경 시 재요청

  useEffect(() => {
    const getFeedInterests = async () => {
      try {
        const { data = [] } = await supabase.from('feed_interests').select('*');
        setFeedInterests(data);
        console.log(
          '관심사 데이터:',
          data.map((i) => i.interest_name),
        ); // ["영화","기타"]
      } catch (error) {
        console.error('관심사 불러오기 오류:', error);
      }
    };
    getFeedInterests();
  }, []);

  return (
    <StHomeWrap>
      <div>
        <div style={{ textAlign: 'center' }}>{categoryId} 카테고리!!!</div>
        {feeds
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((feed) => (
            <HomeFeedCard key={feed.id} feed={feed} />
          ))}
      </div>

      <div>
        <Link to={isLogin ? '/create-feed' : '/sign-in'}>
          <StButton>+</StButton>
        </Link>
      </div>
    </StHomeWrap>
  );
};

export default CategoryFeed;

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
