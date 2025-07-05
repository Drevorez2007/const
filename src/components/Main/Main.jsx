import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Pagination } from 'antd';
import { fetchArticles } from '../store/article/getAllAndDelete/articlesActions';
import { setCurrentPage } from '../store/article/getAllAndDelete/articlesReducer';
import PostItem from '../PostItem/PostItem';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';
import './Main.css';

const Main = () => {
  const dispatch = useDispatch();
  const { articles, loading, currentPage, articlesCount } = useSelector(
    (state) => state.articles
  );
  const userLoaded = useSelector((state) => state.user.userLoaded);

  const pageSize = 5;
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  useEffect(() => {
    const offset = (currentPage - 1) * pageSize;
    dispatch(fetchArticles({ limit: pageSize, offset }));
  }, [dispatch, currentPage, userLoaded]);
  return loading ? (
    <Flex
      align="center"
      gap="middle"
      justify="center"
      style={{ marginTop: '100px' }}
    >
      <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
    </Flex>
  ) : (
    <div className="main">
      <ul className="posts-list">
        {articles.map((article) => (
          <PostItem
            key={article.slug}
            slug={article.slug}
            title={article.title}
            createdAt={article.createdAt}
            favoritesCount={article.favoritesCount}
            userName={article.author.username}
            avatar={article.author.image}
            description={article.description}
            tagList={article.tagList}
            favorited={article.favorited}
          />
        ))}
      </ul>
      <Pagination
        align="center"
        current={currentPage}
        total={articlesCount}
        onChange={handlePageChange}
        pageSize={pageSize}
      />
    </div>
  );
};

export default Main;
