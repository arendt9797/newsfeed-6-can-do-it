import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { supabase } from '../../supabase/client';
import HomeFeedCard from './HomeFeedCard';

const MyFeedList = () => {
  const [feeds, setFeeds] = useState([]);
  const { user } = useContext(AuthContext);

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
    <div>
      {feeds.map((feed) => {
        return (
          user?.id === feed.user_id && (
            <HomeFeedCard key={feed.id} feed={feed} />
          )
        );
      })}
    </div>
  );
};

export default MyFeedList;
