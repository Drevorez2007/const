import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store/user/userReducer';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.user);
  const currentUser = useSelector((state) => state.user.currentUser);
  const username = currentUser?.username;
  const image = currentUser?.image;
  const isLoading = useSelector((state) => state.global.isLoading);

  return (
    <div className="App-header">
      <Link className="to-main-page" to="/">
        Realworld Blog
      </Link>
      {isLogin ? (
        <div className="App-header__login">
          <Link className="App-header__login-create-article" to="/new-article">
            Create article
          </Link>
          <div className="App-header__login-user-name-avatar">
            <div className="App-header__login-user-name">
              <Link to="/profile" className="App-header__login-user-name">
                {username}
              </Link>
            </div>
            <Link to="/profile" className="App-header__login-user-avatar">
              <img
                className="App-header__login-user-avatar"
                src={image || '/user-avatar.png'}
                alt="User Avatar"
              ></img>
            </Link>
          </div>
          <Link
            className="App-header__login-logout"
            to="/"
            onClick={() => dispatch(logout())}
          >
            Log Out
          </Link>
        </div>
      ) : (
        <div className="sign-in-sign-up-buttons">
          <Link className="sign-in-buttons" to="/sign-in">
            Sign In
          </Link>
          <Link className="sign-up-buttons" to="/sign-up">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
