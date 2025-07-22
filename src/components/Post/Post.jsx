import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import Markdown from "react-markdown";
import { Popconfirm, Button, Flex, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  useDeleteArticleMutation,
  useGetArticleQuery,
  useToggleFavoriteMutation,
} from "../store/article/articleApi";
import "./Post.css";

const Post = () => {
  const { slug } = useParams();
  const history = useHistory();
  const currentUser = useSelector((state) => state.user.currentUser);

  const { data, isLoading: isFetching } = useGetArticleQuery(slug);
  const article = data?.article;
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();
  const [toggleFavorite] = useToggleFavoriteMutation();

  if (isFetching || !article?.author) {
    return (
      <Flex
        align="center"
        gap="middle"
        justify="center"
        style={{ marginTop: "100px" }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
      </Flex>
    );
  }

  const {
    title,
    createdAt,
    favoritesCount,
    description,
    body,
    tagList,
    favorited,
    author: { username, image },
  } = article;

  const isAuthor = currentUser?.username === username;
  const formatCreatedAt = format(new Date(createdAt), "MMMM d, yyyy");

  const handleDelete = async () => {
    try {
      await deleteArticle(slug).unwrap();
      history.push("/");
    } catch (error) {
      console.error("Ошибка при удалении статьи", error);
    }
  };

  const handleFavorite = () => {
    toggleFavorite({ slug, favorited });
  };

  return (
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
                <img src="/Heart_like.svg" alt="liked" />
              ) : (
                <img src="/heart1.svg" alt="not liked" />
              )}{" "}
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
              <div className="data-create-post-item">{formatCreatedAt}</div>
            </div>
            <div className="user-avatar">
              <img src={image} alt="Фото Пользователя" />
            </div>
          </div>
          {isAuthor && (
            <div className="user-info__button">
              <Popconfirm
                title="Вы уверены, что хотите удалить статью?"
                onConfirm={handleDelete}
                okText="Да"
                cancelText="Нет"
              >
                <Button
                  disabled={isDeleting}
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
