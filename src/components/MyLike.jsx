import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthProvider';
import { supabase } from '../supabase/client';
import HomeFeedCard from './home/HomeFeedCard';

const MyLike = () => {

  const { user, isLogin } = useContext(AuthContext);

  const [likedFeeds, setLikedFeeds] = useState([]);
  const [interests, setInterests] = useState([]);

  useEffect(() => {

    // 좋아요한 피드정보 함수
    const fetchLikedFeeds = async () => {
      if (!user?.id) return;

      try {
        // 1. 사용자의 좋아요 가져오기
        const { data: likesData, error: likesError } = await supabase
          .from('likes')
          .select('feed_id')
          .eq('user_id', user.id)
          .eq('is_like', true);

        if (likesError) {
          console.error('좋아요 가져오기 실패:', likesError);
          return;
        }

        // 2. 좋아요한 피드 id 찾기
        const feedIds = likesData.map((like) => like.feed_id);
        if (feedIds.length === 0) return setLikedFeeds([]);

        // 3. 피드 정보 얻기
        const { data: feedsData, error: feedsError } = await supabase
          .from('feeds')
          .select('*, user: users(nickname, my_profile_image_url)')
          .in('id', feedIds)
          .order('created_at', { ascending: false });

        if (feedsError) {
          console.error('피드 가져오기 실패:', feedsError);
          return;
        }

        setLikedFeeds(feedsData);
      } catch (error) {
        console.error('에러가 났네 에러가 났어', error);
      }
    };

    fetchLikedFeeds();
  }, [user?.id]);

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
        <div className="my-feed-title">My Like List</div>
        {likedFeeds.length === 0 ? (
          <div className="empty-feed">아직 좋아요한 게시물이 없습니다.</div>
        ) : (
          likedFeeds.map((feed) => (
            <HomeFeedCard key={feed.id} feed={feed} interests={interests} />
          ))
        )}
      </div>

      <div>
        <Link to={isLogin ? '/create-feed' : '/sign-in'}>
          <StButton>
            <div className="tip">
              <p>클릭시 create feed로 이동</p>
            </div>
          </StButton>
        </Link>
      </div>
    </StHomeWrap>
  );
};

export default MyLike;

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

  .tip:before {
    content: '+';
    font-weight: bold;
  }

  .tip:hover p {
    visibility: visible;
    opacity: 1;
  }

  .tip p {
    opacity: 0;
    visibility: hidden;

    color: #fff;
    font-size: 12px;
    line-height: 1.4;
    text-align: left;

    background-color: #0065b7;
    width: 80px;
    padding: 5px;
    border-radius: 3px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2), -1px -1px 3px rgba(0, 0, 0, 0.2);

    position: absolute;
    right: -50px;
    top: 40px;

    transition: visibility 0s, opacity 0.5s linear;
  }

  .tip p:before {
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-bottom-color: #0064b7;
    left: 10px;
    top: -12px;
  }

  &:hover {
    background-color: lightgrey;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;
