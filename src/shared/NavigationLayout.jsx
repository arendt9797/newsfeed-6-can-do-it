import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthProvider';
import { supabase } from '../supabase/client';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function NavigationLayout() {
  const { isLogin, user } = useContext(AuthContext);
  const navigate = useNavigate();

  //로그아웃 함수
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('로그아웃 오류:', error.message);
        toast.error('로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.');
        return;
      }
      toast.success('로그아웃 되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('오류:', error);
      toast.error('오류가 발생했습니다.');
    }
  };

  return (
    <StBodyDiv>
      <header>
        <Link className="home-link" to="/">
          <img className="logo-img" src="/team_logo.png" alt="logo" />
        </Link>

        <div className="profile-div">
          <Link to={isLogin ? '/my-profile' : '/sign-in'}>
            <img
              src={user?.my_profile_image_url || '/default_user.jpg'}
              alt="profile"
            />
          </Link>
          <div className="tip">
            <p>이미지를 클릭하면 sign in 혹은 My Profile로 이동합니다.</p>
          </div>
          <div>
            {isLogin
              ? `${user?.nickname}님 환영합니다.`
              : '게스트님 환영합니다.'}
          </div>
        </div>

        <nav>
          {isLogin ? (
            <button onClick={handleLogout} className="sign">
              sign out
            </button>
          ) : (
            <Link to="/sign-in" className="sign">
              {' '}
              sign in{' '}
            </Link>
          )}
          <Link to="/category">Categories</Link>
          <Link to={isLogin ? '/create-feed' : '/sign-in'}>Create Feed</Link>
          <Link to="/about-us">About Us</Link>
          {isLogin && <Link to="/my-feed"> My Feed </Link>}
          {isLogin && <Link to="/my-like"> My Like</Link>}
        </nav>

        <footer>
          <p>&copy; 2025. 6 can do it</p>
        </footer>
      </header>
      <StMain>
        <Outlet />
      </StMain>
    </StBodyDiv>
  );
}

export default NavigationLayout;

const StBodyDiv = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  height: 100vh;

  header {
    background-color: #211c1c;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    z-index: 1000;

    .home-link {
      text-decoration: none;
      width: 400px;
      text-align: center;
      margin-top: 50px;
    }

    .logo-img {
      width: 100px;
      margin: 0 auto;
    }

    .profile-div {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 250px;
      margin: 50px auto;

      img {
        width: 60px;
        height: 60px;
        border-radius: 100%;
        object-fit: cover;
      }
      .tip {
        position: relative;
        top: -65px;
        left: 45px;

        font-size: 14px;
        line-height: 26px;
        text-align: center;

        background-color: #46d7ab;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        cursor: default;
      }

      .tip:before {
        content: '?';
        font-weight: bold;
        color: #fff;
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

        background-color: #0065b75d;
        width: 150px;
        padding: 5px;
        border-radius: 3px;
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2),
          -1px -1px 3px rgba(0, 0, 0, 0.2);

        position: absolute;
        right: -132px;

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
    }

    nav {
      display: flex;
      flex-direction: column;
      margin: auto 0;
      margin-top: 0px;

      button {
        all: unset;

        &:hover {
          cursor: pointer;
        }
      }

      a,
      button {
        background-color: #46d7ab;
        border-radius: 5px;
        width: 200px;
        margin: 5px;
        padding: 10px 0;
        text-decoration: none;
        color: black;
        font-size: 20px;
        text-align: center;
        transition-duration: 0.6s;
        transition-timing-function: ease;

        &:hover {
          transform: scale(1.1, 1.1);
          -ms-transform: scale(1.1, 1.1);
          -webkit-transform: scale(1.1, 1.1);
          box-shadow: 0px 5px 5px -2px rgba(0, 0, 0, 0.25);
        }
      }

      .sign {
        background-color: inherit;
        color: white;

        &:hover {
          color: #acacac;
        }
      }
    }

    footer {
      margin-bottom: 15px;
    }
  }
`;

const StMain = styled.main`
  flex: 1;
  margin-left: 400px;
  height: 100vh;
`;
