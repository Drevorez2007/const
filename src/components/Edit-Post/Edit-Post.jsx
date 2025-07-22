import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useHistory } from "react-router-dom";
import {
  useGetArticleQuery,
  useEditArticleMutation,
} from "../store/article/articleApi";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import "./Edit-Post.css";

const EditPost = () => {
  const { slug } = useParams();
  const history = useHistory();

  const { data, isLoading, isFetching } = useGetArticleQuery(slug);
  const [editArticle, { isLoading: isSaving }] = useEditArticleMutation();

  const currentUser = useSelector((state) => state.user.currentUser);
  const article = data?.article;

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [tagList, setTagList] = useState([""]);

  useEffect(() => {
    if (article) {
      setValue("title", article.title);
      setValue("description", article.description);
      setValue("body", article.body);
      setTagList(article.tagList.length > 0 ? article.tagList : [""]);
    }
  }, [article, setValue]);

  const isAuthor =
    currentUser?.username && article?.author?.username
      ? currentUser.username === article.author.username
      : false;

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!isFetching && !isAuthor) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [isFetching, isAuthor]);

  const onSubmit = async (formData) => {
    const filteredTags = tagList.filter((tag) => tag.trim() !== "");
    const updatedArticle = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      body: formData.body.trim(),
      tagList: filteredTags.length > 0 ? filteredTags : ["general"],
    };

    try {
      await editArticle({ slug, ...updatedArticle }).unwrap();
      history.push(`/articles/${slug}`);
    } catch (err) {
      console.error("Ошибка при обновлении статьи", err);
    }
  };

  const handleAddTag = () => {
    const lastTag = tagList[tagList.length - 1];
    if (lastTag.trim() !== "") {
      setTagList([...tagList, ""]);
    }
  };

  const handleTagChange = (index, value) => {
    const updated = [...tagList];
    updated[index] = value;
    setTagList(updated);
  };

  const handleRemoveTag = (index) => {
    if (tagList.length > 1) {
      setTagList(tagList.filter((_, i) => i !== index));
    }
  };

  if (isLoading) {
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

  if (showWarning) {
    return (
      <div className="edit-post__error">
        <p className="edit-post__error-text">
          ❌ You are not allowed to edit this article.
        </p>
        <button
          onClick={() => history.push(`/articles/${slug}`)}
          className="edit-post__error-button"
          type="button"
        >
          Go back to article
        </button>
      </div>
    );
  }

  return (
    <form className="edit-post" onSubmit={handleSubmit(onSubmit)}>
      <div className="edit-post__title">Edit article</div>
      <div className="edit-post__info">
        <div className="edit-post__info-title">
          Title
          <Controller
            name="title"
            control={control}
            rules={{
              validate: (value) =>
                (value && value.trim() !== "") || "Title text is required",
            }}
            render={({ field }) => <input {...field} placeholder="Title" />}
          />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>

        <div className="edit-post__short-description">
          Short description
          <Controller
            name="description"
            control={control}
            rules={{
              validate: (value) =>
                (value && value.trim() !== "") ||
                "Description text is required",
            }}
            render={({ field }) => (
              <textarea {...field} placeholder="Short description" />
            )}
          />
          {errors.description && (
            <p className="error">{errors.description.message}</p>
          )}
        </div>

        <div className="edit-post__text">
          Text
          <Controller
            name="body"
            control={control}
            rules={{
              validate: (value) =>
                (value && value.trim() !== "") || "Body text is required",
            }}
            render={({ field }) => <textarea {...field} placeholder="Text" />}
          />
          {errors.body && <p className="error">{errors.body.message}</p>}
        </div>

        <div className="edit-post__tags">
          Tags
          <div className="edit-post__tags-list">
            {tagList.map((tag, index) => (
              <div key={index} className="edit-post__tags-item">
                <input
                  type="text"
                  value={tag ?? ""}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  className="edit-post__tags-input"
                />
                <button
                  disabled={isSaving}
                  className="edit-post__tags-button-delete"
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                >
                  Delete
                </button>
                {index === tagList.length - 1 && (
                  <button
                    disabled={isSaving}
                    className="edit-post__tags-button-add"
                    type="button"
                    onClick={handleAddTag}
                  >
                    Add tag
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          disabled={isSaving}
          type="submit"
          className="edit-post-send-button"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default EditPost;
