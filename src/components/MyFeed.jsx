import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthProvider';
import { supabase } from '../supabase/client';
import HomeFeedCard from './home/HomeFeedCard';

const MyFeed = () => {
  const { user, isLogin } = useContext(AuthContext);

  const [feeds, setFeeds] = useState([]);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    const getFeeds = async () => {
      if (!user || !user.id) return;
      try {
        const { data, error } = await supabase
          .from('feeds')
          .select('*, user: users(nickname, my_profile_image_url)')
          .eq('user_id', user.id);
        // console.log(data);
        if (error) {
          console.error('오류:', error);
          return;
        }
        setFeeds(data || []);
      } catch (error) {
        console.log(error);
      }
    };
    getFeeds();
  }, [user]);

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
        <div className="my-feed-title"> My feed List</div>
        {feeds.length === 0 ? (
          <div className="empty-feed"> 아직 아무런 피드도 없습니다. </div>
        ) : (
          feeds
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
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

export default MyFeed;

const StHomeWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  height: auto;
  overflow-y: auto;
  padding: 100px;

  .my-feed-title {
    text-align: center;
    margin-bottom: 10px;
    font-size: 20px;
  }

  .empty-feed {
    text-align: center;
    padding: 25px;
    color: #999;
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
