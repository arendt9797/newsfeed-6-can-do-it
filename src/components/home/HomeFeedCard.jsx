import styled from 'styled-components';
import { supabase } from '../../supabase/client';
import { useState } from 'react';
import { useEffect } from 'react';

const HomeFeedCard = ({ feed }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const getComments = async () => {
    const { data } = await supabase
      .from('test_comments')
      .select('*')
      .eq('feed_id', feed.id);
    setComments(data);
  };

  useEffect(() => {
    getComments();
  }, [comment]);

  const handleAddComment = async (feedId) => {
    const { data } = await supabase.from('test_comments').insert({
      feed_id: feedId,
      comments: comment,
    });
    setComment('');
  };

  return (
    <>
      <StFeedBox>
        <StFeedTop>
          <div>
            <img
              src="https://media.istockphoto.com/id/1497396873/ko/%EC%82%AC%EC%A7%84/%ED%95%B4%EB%B3%80-%ED%9C%B4%EA%B0%80%EB%A5%BC-%EC%8B%9C%EC%9E%91%ED%95%A0-%EC%A4%80%EB%B9%84%EA%B0%80-%EB%90%98%EC%97%88%EC%8A%B5%EB%8B%88%EB%8B%A4.jpg?s=612x612&w=0&k=20&c=okICg7-m2NXrvTnU4Jl2Vy3coHYd7DcjtyMMUA3Vg7E="
              width={250}
            />
          </div>
          <div>
            <img
              src="https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg"
              alt="이미지 에러"
              width={80}
            />
            <StH2>{feed.title}</StH2>
            <br />
            <div>{feed.content}</div>
            <br />
            <div>comments({comments.length})</div>
          </div>
        </StFeedTop>
        {comments.length > 0 && (
          <StCommentsContainer>
            {comments.map((comment) => {
              return (
                <StCommentsContent>
                  <li>
                    <span>
                      <span>
                        <img src="#" />
                      </span>
                      <span>이름 : </span>
                      <span>{comment.comments}</span>
                    </span>
                  </li>
                  <span>
                    <button>삭제</button>
                  </span>
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
`;

const StH2 = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: black;
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

const StCommentsContent = styled.ul`
  display: flex;
  justify-content: space-between;
`;
