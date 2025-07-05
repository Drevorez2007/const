import React, { useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getArticle } from '../store/article/getArticle/getArticleAction';
import { format } from 'date-fns';
import Markdown from 'react-markdown';
import { deleteArticle } from '../store/article/getAllAndDelete/deleteArticleAction';
import { Popconfirm, Button, Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { favoritedLike } from '../store/article/favoritedLike/favoritedLikeAction';
import './Post.css';

const Post = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { slug } = useParams();
  const userLoaded = useSelector((state) => state.user.userLoaded);
  useEffect(() => {
    if (!userLoaded) return;
    dispatch(getArticle({ slug }));
  }, [dispatch, slug, userLoaded]);

  const currentUser = useSelector((state) => state.user.currentUser);
  const article = useSelector((state) => state.getArticle);
  if (article.loading || !article.author) {
    return (
      <Flex
        align="center"
        gap="middle"
        justify="center"
        style={{ marginTop: '100px' }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
      </Flex>
    );
  }
  const { username, image } = article.author;


  const isAuthor = currentUser && currentUser.username === username;

  const {
    title,
    createdAt,
    favoritesCount,
    description,
    body,
    tagList,
    favorited,
  } = article;
  const formatCreatedAt = format(new Date(createdAt), 'MMMM d, yyyy');

  // УДАЛЕНИЕ СТАТЬИ
  const handleDelete = async () => {
    const result = await dispatch(deleteArticle({ slug }));
    if (deleteArticle.fulfilled.match(result)) {
      history.push('/');
    } else {
      console.log('Ошибка при удалении статьи', result);
    }
  };

  const handleFavorite = () => {
    dispatch(favoritedLike({ slug, favorited }));
  };
  return article.loading ? (
    <Flex
      align="center"
      gap="middle"
      justify="center"
      style={{ marginTop: '100px' }}
    >
      <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
    </Flex>
  ) : (
    <div className="post">
      <div className="post-up">
        <div className="post-info">
          <div className="title-likes-info">
            <div className="title-text">{title}</div>
            <button
              className="likes-button"
              onClick={handleFavorite}
              disabled={!currentUser}
            >
              {favorited ? (
                <img src="/Heart_like.svg" alt="" />
              ) : (
                <img src="/heart1.svg" alt="" />
              )}{' '}
              {favoritesCount}
            </button>
          </div>
          <ul className="post-tags-list-info">
            {tagList.map((tag, index) => (
              <li key={index} className="tag-item">
                {tag}
              </li>
            ))}
          </ul>
          <div className="post-text-info">{description}</div>
        </div>
        <div className="user-info">
          <div className="user-info__information">
            <div className="user-name-data-create-post-item">
              <div className="user-name">{username}</div>
              <div className="data-create-post-item">{formatCreatedAt} </div>
            </div>
            <div className="user-avatar">
              <img src={image} alt="Фото Пользователя" />
            </div>
          </div>
          {isAuthor ? (
            <div className="user-info__button">
              <Popconfirm
                title="Вы уверены, что хотите удалить статью?"
                onConfirm={handleDelete}
                okText="Да"
                cancelText="Нет"
              >
                <Button
                  danger
                  type="primary"
                  className="user-info__button-delete"
                >
                  Delete
                </Button>
              </Popconfirm>
              <Link
                className="user-info__button-edit"
                to={`/articles/${slug}/edit`}
              >
                Edit
              </Link>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className="post-down">
        <Markdown>{body}</Markdown>
      </div>
    </div>
  );
};

export default Post;
