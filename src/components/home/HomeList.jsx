import styled from 'styled-components';
import HomeFeedCard from './HomeFeedCard';
import { useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { useState } from 'react';

const emtpyArr = Array(2).fill(0);

const HomeList = () => {
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    const getFeeds = async () => {
      try {
        const { data } = await supabase.from('feeds').select('*');
        setFeeds(data);
        console.log;
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
          return <HomeFeedCard key={feed.id} feed={feed} />;
        })}
      </div>
      <div>
        <StButton>+</StButton>
      </div>
    </StHomeWrap>
  );
};

export default HomeList;

const StHomeWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const StButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  margin-left: 50px;
  &:hover {
    background-color: lightgrey;
  }
`;
