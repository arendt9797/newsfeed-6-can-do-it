import React, { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthProvider';
import { supabase } from '../supabase/client';
import HomeFeedCard from './home/HomeFeedCard';

const CategoryFeed = () => {
  const [feeds, setFeeds] = useState([]);
  const { isLogin } = useContext(AuthContext);
  const [query] = useSearchParams();
  const categoryId = query.get('id');

  // console.log('카테고리 ID:', categoryId);

  useEffect(() => {
    const getFeed = async () => {
      if (!categoryId) return;

      try {
        const { data, error } = await supabase
          .from('feed_interests')
          .select('feed:feeds(*,user:users(nickname, my_profile_image_url))')
          .eq('interest_name', categoryId);
        if (error) {
          console.error('오류:', error);
          return;
        }
        const filteredFeeds = data.map((i) => i.feed).filter(Boolean);
        setFeeds(filteredFeeds);
      } catch (error) {
        console.error('예상치 못한 오류:', error);
        alert('예상치 못한 오류가 발생했습니다.');
      }
    };
    getFeed();
  }, [categoryId]);

  return (
    <StHomeWrap>
      <div>
        <div style={{ textAlign: 'center' }}>{categoryId} 카테고리 입니다!!</div>
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
