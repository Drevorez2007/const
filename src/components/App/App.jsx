import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { takeUserFromLocalStorage } from '../store/user/userReducer.jsx';
import Header from '../Header/Header.jsx';
import Main from '../Main/Main.jsx';
import SignUp from '../Sign-Up/Sign-Up.jsx';
import Post from '../Post/Post.jsx';
import SignIn from '../Sign-In/Sign-In.jsx';
import EditProfile from '../Edit-Profile/Edit-Profile.jsx';
import CreatePost from '../Create-Post/Create-Post.jsx';
import EditPost from '../Edit-Post/Edit-Post.jsx';
import PrivateRoute from '../PrivateRoute/PrivateRoute.jsx';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      dispatch(takeUserFromLocalStorage(JSON.parse(savedUser)));
    }
  }, [dispatch]);
  return (
    <Router>
      <div className="App">
        <Header />
        <Route path="/" component={Main} exact />
        <Route path="/articles/:slug" component={Post} exact />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/profile" component={EditProfile} />
        <PrivateRoute path="/new-article" component={CreatePost} />
        <Route path="/articles/:slug/edit" component={EditPost} exact />
      </div>
    </Router>
  );
};

export default App;
