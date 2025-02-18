/* eslint-disable react/prop-types */
import styled from 'styled-components';
import { supabase } from '../../supabase/client';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const HomeFeedCard = ({ feed, setFeeds, interests }) => {
  const { user, isLogin } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isLike, setIsLike] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);
  const [isEditing, setIsEditing] = useState(null); // 수정 중인 댓글 ID 저장
  const [editComment, setEditComment] = useState(''); // 수정할 댓글 내용
  const navigate = useNavigate();

  // 모든 댓글 가져오기
  const getComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, comment_user: users(nickname, my_profile_image_url)')
      .eq('feed_id', feed.id)
      .order('created_at', { ascending: true }); // 데이터의 순서 지정하기
    // ascending: true 는 오름차순
    setComments(data);
  };
///
  useEffect(() => {
    getComments();
  }, []);

  // 댓글 추가 핸들러
  const handleAddComment = async (feedId) => {
    if (!isLogin) {
      alert('댓글을 입력하려면 로그인을 해주세요!');
      navigate('/sign-in');
      return;
    }

    await supabase.from('comments').insert({
      feed_id: feedId,
      comment: comment,
      user_id: user?.id,
    });
    setComment('');
    getComments();
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (id) => {
    const isConfirm = window.confirm('정말 삭제하시겠습니까?');
    if (isConfirm) {
      await supabase.from('comments').delete().eq('id', id);

      getComments();
    }
  };

  //  댓글 수정 아이콘 클릭 시
  const handleEditClick = (comment) => {
    setIsEditing(comment.id);
    setEditComment(comment.comment);
  };

  //  댓글 수정 완료 핸들러
  const handleEditComment = async (commentId) => {
    try {
      const { error, data } = await supabase
        .from('comments')
        .update({ comment: editComment })
        .eq('id', commentId);

      if (error) {
        console.error('댓글 수정 오류:', error);
        alert('댓글 수정에 실패했습니다.');
        return;
      }

      console.log('수정된 데이터 =>', data);
      //  최신 댓글 목록 가져와서 반영
      await getComments();
      //  수정 완료 후 상태 초기화
      setIsEditing(null);
      setEditComment('');

      console.log('수정', isEditing);
      console.log('수정 댓글', editComment);
    } catch (error) {
      console.error('댓글 수정 처리 중 오류:', error);
    }
  };

  // 이미지 삭제 핸들러
  const handleDeleteFeed = async (id) => {
    // [1]feeds 테이블에서 피드 삭제 _ 작동확인!OK
    const isConfirm = window.confirm('정말 삭제하시겠습니까?');

    if (isConfirm) {
      const { feedError } = await supabase.from('feeds').delete().eq('id', id);

      if (feedError) {
        console.error('피드 삭제 오류:', feedError);
        throw feedError;
      }

      // [2]스토리지에서 feed-image 버켓에 있는 이미지 파일 삭제

      // [try_0] 이건 http://~~ 이렇게 쭉 나옴
      // const filePath = `public/${feed.feed_image_url}`;

      // [try_1] slice 썼더니 첫번째 public에서 걸러니 "public/feed-image/public/1739772606245_test1.jpeg" 결과값 도출
      // const filePath = feed.feed_image_url.slice(
      //   feed.feed_image_url.indexOf('public/'),
      // );

      // [try_2] 첫번째 public인덱스 찾고, 두번째 public 인덱스 찾아서 slice로 주소 추출
      const firstPublicIndex = feed.feed_image_url.indexOf('public/');
      const secondPublicIndex = feed.feed_image_url.indexOf(
        'public/',
        firstPublicIndex + 1,
      );

      const filePath = feed.feed_image_url.slice(secondPublicIndex);

      // const testfilename = `public/1739770165223_test02.webp`;
      const { data, FileDeleteError } = await supabase.storage
        .from('feed-image')
        .remove([filePath]);

      if (FileDeleteError) {
        console.error('파일 삭제 오류:', FileDeleteError);
        throw FileDeleteError;
      }

      if (!filePath) {
        alert('이미지 삭제 실패');
      }

      // [3]보이는 화면 상태에도 반영 _ 작동확인!OK
      setFeeds((prev) => prev.filter((item) => item.id !== feed.id));
    }
  };

  // [좋아요] 토클 버튼
  const fetchLikeStatus = async () => {
    if (!user?.id) return;

    // 현재 로그인한 유저의 좋아요 상태 가져오기
    const { data, error } = await supabase
      .from('likes')
      .select('is_like')
      .eq('feed_id', feed.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('좋아요 상태 가져오기 실패:', error);
      return;
    }

    setIsLike(data?.is_like || false); // 데이터 없으면 false로 설정

    // 특정 feed_id의 좋아요 개수 가져오기
    const { count, error: countError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true }) // 데이터 반환 없이 개수만 세기 위한 옵션
      .eq('feed_id', feed.id)
      .eq('is_like', true);

    if (countError) {
      console.error('좋아요 개수 가져오기 실패:', countError);
      return;
    }

    setLikeNumber(count); // 좋아요 개수 업데이트
  };

  useEffect(() => {
    fetchLikeStatus();
  }, [feed.id, user?.id]);

  const handleLikeToggle = async (feedId) => {
    if (!user?.id) {
      alert('로그인이 필요합니다!');
      return;
    }

    try {
      // 현재 좋아요 상태 확인
      const { data: existingLike, error: fetchError } = await supabase
        .from('likes')
        .select('is_like')
        .eq('feed_id', feedId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('좋아요 상태 확인 오류:', fetchError);
        return;
      }

      const newIsLike = existingLike ? !existingLike.is_like : true;

      // 좋아요 상태 삽입/업데이트
      const { error: upsertError } = await supabase.from('likes').upsert(
        [
          {
            feed_id: feedId,
            user_id: user.id,
            is_like: newIsLike,
          },
        ],
        { onConflict: ['feed_id', 'user_id'] },
      );

      if (upsertError) {
        console.error('좋아요 업서트 오류:', upsertError);
        return;
      }

      setIsLike(newIsLike); // 상태 업데이트
      fetchLikeStatus();
    } catch (error) {
      console.error('좋아요 토글 오류:', error);
    }
  };

  const handleEditFeed = () => {
    navigate("/create-feed", { state: { feed } }); // 게시글 정보 전달
  };
  return (
    <>
      {/* 가져온 피드 보여주는 부분 */}
      <StFeedProfileImgContainer>
      <button onClick={handleEditFeed}>✏️ 수정</button>
        <StFeedProfileImg>
          <img src={feed.user?.my_profile_image_url} />
        </StFeedProfileImg>
        <span>{feed.user?.nickname}</span>
        {user?.id === feed.user_id && (
          <StFeedDeleteBtn
            onClick={() => handleDeleteFeed(feed.id, feed.feed_image_url)}
          >
            &times;
          </StFeedDeleteBtn>
        )}
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
        {/* 선택한 관심사 보여줌*/}
        <StCommentsInterestContainer>
          <div>
            관심사 :{' '}
            {interests && interests.length > 0
              ? interests
                  .filter((interest) => interest.id === feed.id)
                  .map((interest) => `#${interest.interest_name}`)
                  .join(', ')
              : '없음'}
          </div>
          {/* 댓글 개수 */}
          <StCommentPosition>
            {!comments.length ? (
              <div></div>
            ) : (
              <StComment>comments({comments.length})</StComment>
            )}
            {/* 좋아요 */}
            <StLikeBtn onClick={() => handleLikeToggle(feed.id)}>
              <StLikes>
                <img src={isLike ? '/heart.png' : '/no_heart.png'} />
                <span className="like-number"> ({likeNumber})</span>
              </StLikes>
            </StLikeBtn>
          </StCommentPosition>
        </StCommentsInterestContainer>

        {/* 댓글 컨테이너 _ 사용자들이 작성한 댓글 보여줌 */}
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

                    {/* 댓글 수정 모드일 때 인풋창 표시 */}
                    {isEditing === comment.id ? (
                      <input
                        type="text"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                      />
                    ) : (
                      <span>{comment.comment}</span>
                    )}
                  </StCommentContainer>
                  {/* 댓글 수정 및 삭제 */}
                  {user?.id === comment.user_id && (
                    <div>
                      {/* ✏️ 수정 모드 전환 및 완료 버튼 */}
                      <StCommentEditBtn
                        onClick={() => {
                          if (isEditing === comment.id) {
                            handleEditComment(comment.id); // 수정 완료
                          } else {
                            handleEditClick(comment); // 수정 모드로 변경
                          }
                        }}
                      >
                        {isEditing === comment.id ? '✔️' : '✏️'}
                      </StCommentEditBtn>
                      <StCommentDeleteBtn
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        &times;
                      </StCommentDeleteBtn>
                    </div>
                  )}
                </StCommentsContent>
              );
            })}
          </StCommentsContainer>
        )}
        {/* 댓글 입력란 및 추가 버튼 */}
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

const StCommentDeleteBtn = styled.button`
  border: none;
  font-size: 1.2rem;
  background-color: transparent;

  &:hover {
    color: red;
    cursor: pointer;
    scale: 1.3;
  }
`;

const StFeedDeleteBtn = styled.button`
  justify-content: flex-end;
  border: none;
  font-size: 1.5rem;
  background-color: transparent;
  background-color: #fd6565;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: white;

  &:hover {
    cursor: pointer;
    scale: 1.1;
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
  align-items: center;
`;

const StLikes = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;

  img {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }

  .like-number {
    color: grey;
    margin-left: 3px;
  }
`;

const StComment = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-right: 10px;
`;

const StLikeBtn = styled.button`
  background-color: transparent;
  border: none;

  &:hover {
    scale: 1.1;
    cursor: pointer;
  }
`;

const StCommentPosition = styled.div`
  display: flex;
`;

const StCommentEditBtn = styled.button`
  border: none;
  font-size: 1.2rem;
  background-color: transparent;
  color: gray;
  margin-left: 8px;
  cursor: pointer;

  &:hover {
    color: #007bff;
    scale: 1.2;
  }
`;
