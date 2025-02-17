import React, { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthProvider';
import { supabase } from '../supabase/client';
import HomeFeedCard from './home/HomeFeedCard';
import * as c from '../constants/categoryName';

const CategoryFeed = () => {
  const [feeds, setFeeds] = useState([]);
  const { isLogin } = useContext(AuthContext);
  const [query] = useSearchParams();
  const categoryId = query.get('id');
  const categoryImgTest = [...c.categoryArr].find((i) => i.name === categoryId);
  const [interests, setInterests] = useState([]);

  // console.log(categoryImgTest.img);

  // console.log('카테고리:', categoryId);
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
        // console.log(data);
        //true값만 내보내기
        const filteredFeeds = data.map((i) => i.feed).filter(Boolean);
        setFeeds(filteredFeeds);
      } catch (error) {
        console.error('예상치 못한 오류:', error);
        alert('예상치 못한 오류가 발생했습니다.');
      }
    };
    getFeed();
  }, [categoryId]);

  useEffect(() => {
    const getFeedsInterests = async () => {
      try {
        const { data, error } = await supabase
          .from('feed_interests')
          .select('*');
        if (error) {
          console.error('오류:', error);
          return;
        }
        setInterests(data);
      } catch (error) {
        console.error(error);
      }
    };
    getFeedsInterests();
  }, []);

  return (
    <StHomeWrap>
      <div>
        <div className="feed-box">
          <img
            className="category-img"
            src={categoryImgTest.img}
            alt="카테고리 이미지"
          />
          <div className="category-name">{categoryId} 카테고리</div>
        </div>

        {feeds.length === 0 ? (
          <div className="empty-feed"> 아직 아무런 피드도 없습니다.</div>
        ) : (
          feeds
            ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((feed) => (
              <HomeFeedCard key={feed.id} feed={feed} interests={interests} />
            ))
        )}
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

  .feed-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .category-name {
    text-align: center;
    margin-bottom: 10px;
    font-size: 20px;
  }

  .empty-feed {
    text-align: center;
    padding: 25px;
    color: #999;
  }

  .category-img {
    width: 150px;
    height: 100px;
    margin-right: 20px;
    border-radius: 100%;
  }
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
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;
