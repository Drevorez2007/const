import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Pagination, Spin, Flex } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useGetArticlesQuery } from "../store/article/articleApi";
import PostItem from "../PostItem/PostItem";
import "./Main.css";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Main = () => {
  const query = useQuery();
  const history = useHistory();

  const initialPage = parseInt(query.get("page")) || 1;
  const initialPageSize = parseInt(query.get("limit")) || 5;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const offset = (currentPage - 1) * pageSize;

  const { data, isLoading } = useGetArticlesQuery(
    { limit: pageSize, offset },
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    history.push(`/?page=${currentPage}&limit=${pageSize}`);
  }, [currentPage, pageSize, history]);

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ marginTop: "100px" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
      </Flex>
    );
  }

  const articles = data?.articles || [];
  const articlesCount = data?.articlesCount || 0;

  return (
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
            body={article.body}
          />
        ))}
      </ul>
      <Pagination
        current={currentPage}
        total={articlesCount}
        pageSize={pageSize}
        pageSizeOptions={["5", "10", "20"]}
        showSizeChanger
        onChange={(page, newSize) => {
          setCurrentPage(page);
          setPageSize(newSize);
        }}
        style={{ textAlign: "center", marginTop: 16 }}
      />
    </div>
  );
};

export default Main;
