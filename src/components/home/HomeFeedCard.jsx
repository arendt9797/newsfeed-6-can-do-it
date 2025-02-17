import styled from 'styled-components';
import { supabase } from '../../supabase/client';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const HomeFeedCard = ({ feed }) => {
  const { user, isLogin } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const getComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, comment_user: users(nickname, my_profile_image_url)')
      .eq('feed_id', feed.id);
    setComments(data);
  };

  useEffect(() => {
    getComments();
  }, [comment]);

  const handleAddComment = async (feedId) => {
    if (!isLogin) {
      alert('댓글을 입력하려면 로그인을 해주세요!');
      navigate('/sign-in');
      return;
    }

    const { data } = await supabase.from('comments').insert({
      feed_id: feedId,
      comment: comment,
      user_id: user?.id,
    });
    setComment('');
  };

  const handleDeleteFeed = async (id) => {
    const isConfirm = window.confirm('정말 삭제하시겠습니까?');
    if (isConfirm) {
      const { error } = await supabase.from('comments').delete().eq('id', id);

      if (error) throw error;
      getComments();
    }
  };

  // const handleUpdateFeed = async (id) => {
  //   const isConfirm = window.confirm('정말 수정하시겠습니까?');
  //   if (isConfirm) {
  //     const { data, error } = await supabase
  //       .from('comments')
  //       .update({ other_column: 'otherValue' })
  //       .eq('some_column', 'someValue')
  //       .select();
  //   }
  // };

  return (
    <>
      <StFeedProfileImgContainer>
        <StFeedProfileImg>
          <img src={feed.user?.my_profile_image_url} />
        </StFeedProfileImg>
        <span>{feed.user?.nickname}</span>
      </StFeedProfileImgContainer>
      <StFeedBox>
        <StFeedTop>
          <StFeedImgContainerLeft>
            <img src={feed.feed_image_url} />
          </StFeedImgContainerLeft>
          <StFeedContentRight>
            <StH2>{feed.title}</StH2>
            <div>{feed.content}</div>
          </StFeedContentRight>
        </StFeedTop>
        <StCommentsInterestContainer>
          <div>체크한 관심사 : #DIY</div>
          <div>
            {!comments.length ? (
              <div></div>
            ) : (
              <div>comments({comments.length})</div>
            )}
          </div>
        </StCommentsInterestContainer>
        {comments.length > 0 && (
          <StCommentsContainer>
            {comments.map((comment) => {
              return (
                <StCommentsContent key={comment.id}>
                  <StCommentContainer>
                    <StCommentProfileImg>
                      <img src={comment.comment_user.my_profile_image_url} />
                    </StCommentProfileImg>
                    <StH3>{comment.comment_user.nickname}</StH3>
                    <span>{comment.comment}</span>
                  </StCommentContainer>
                  <div>
                    <span>
                      {user?.id === comment.user_id && (
                        <StDeleteBtn
                          onClick={() => handleDeleteFeed(comment.id)}
                        >
                          &times;
                        </StDeleteBtn>
                      )}
                    </span>
                  </div>
                </StCommentsContent>
              );
            })}
          </StCommentsContainer>
        )}
        <div>
          <StCommentBox
            type="text"
            placeholder="댓글을 입력해주세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <StCommentBtn type="submit" onClick={() => handleAddComment(feed.id)}>
            {' '}
            댓글 추가
          </StCommentBtn>
        </div>
      </StFeedBox>
    </>
  );
};

export default HomeFeedCard;

const StFeedBox = styled.div`
  width: 600px;
  background-color: white;
  border-radius: 10px;
  border: 2px solid lightgrey;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  text-align: center;
  justify-content: space-around;
`;

const StFeedTop = styled.div`
  display: flex;
  flex-direction: row;
  padding: 30px;
  gap: 10px;
  min-height: 200px;
`;

const StH2 = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: black;
  margin-bottom: 50px;
  margin-top: 20px;
`;

const StCommentBox = styled.input`
  width: 75%;
  height: 30px;
  border: 1px solid lightgrey;
  border-radius: 10px;
  padding-left: 10px;
  box-shadow: rgba(135, 135, 245, 0.2) 0px 7px 29px 0px;
  margin-bottom: 10px;
`;

const StCommentBtn = styled.button`
  height: 32px;
  width: 80px;
  margin-left: 10px;
  background-color: #63b39b;
  border: none;
  border-radius: 10px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
    background-color: #285f49;
    color: white;
  }
`;

const StCommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  overflow-y: auto;
  background-color: #f1f1f1;
  border-radius: 10px;
  margin-left: 25px;
  margin-right: 25px;
  margin-bottom: 5px;
`;

const StCommentContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const StCommentsContent = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StCommentProfileImg = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #cccccc;
  overflow: hidden;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StFeedProfileImg = styled.div`
  display: flex;
  flex-direction: row;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #cccccc;
  overflow: hidden;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StFeedProfileImgContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  color: black;
  font-weight: 800;
  margin-top: 60px;
`;

const StH3 = styled.h3`
  font-weight: 600;
`;

const StDeleteBtn = styled.button`
  border: none;
  font-size: 1.2rem;

  &:hover {
    color: red;
    cursor: pointer;
    scale: 1.3;
  }
`;

const StFeedImgContainerLeft = styled.div`
  width: 40%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StFeedContentRight = styled.div`
  width: 60%;
  padding-left: 20px;
`;

const StCommentsInterestContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 40px;
  color: grey;
  margin-left: 40px;
  margin-bottom: 5px;
`;
