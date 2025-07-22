import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useCreateArticleMutation } from "../store/article/articleApi";
import "./Create-Post.css";

const CreatePost = () => {
  const history = useHistory();
  const [tagList, setTagList] = useState([""]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [createArticle, { isLoading }] = useCreateArticleMutation();

  const onSubmit = async (data) => {
    const filteredTags = tagList.filter((tag) => tag.trim() !== "");
    const articleData = {
      title: data.title.trim(),
      description: data.description.trim(),
      body: data.body.trim(),
      tagList: filteredTags.length > 0 ? filteredTags : ["general"],
    };

    try {
      const response = await createArticle(articleData).unwrap();
      const slug = response.article.slug;
      if (slug) {
        history.push(`/articles/${slug}`);
      } else {
        history.push("/");
      }
    } catch (err) {
      console.error("Ошибка при создании статьи", err);
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

  return (
    <form className="create-post" onSubmit={handleSubmit(onSubmit)}>
      <div className="create-post__title">Create new article</div>
      <div className="create-post__info">
        <div className="create-post__info-title">
          Title
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{
              validate: (value) =>
                (value && value.trim() !== "") || "Title text is required",
            }}
            render={({ field }) => <input {...field} placeholder="Title" />}
          />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>

        <div className="create-post__short-description">
          Short description
          <Controller
            name="description"
            control={control}
            defaultValue=""
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

        <div className="create-post__text">
          Text
          <Controller
            name="body"
            control={control}
            defaultValue=""
            rules={{
              validate: (value) =>
                (value && value.trim() !== "") || "Body text is required",
            }}
            render={({ field }) => <textarea {...field} placeholder="Text" />}
          />
          {errors.body && <p className="error">{errors.body.message}</p>}
        </div>

        <div className="create-post__tags">
          Tags
          <div className="create-post__tags-list">
            {tagList.map((tag, index) => (
              <div key={index} className="create-post__tags-item">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  className="create-post__tags-input"
                />
                <button
                  disabled={isLoading}
                  className="create-post__tags-button-delete"
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                >
                  Delete
                </button>
                {index === tagList.length - 1 && (
                  <button
                    disabled={isLoading}
                    className="create-post__tags-button-add"
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
          disabled={isLoading}
          type="submit"
          className="create-post-send-button"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
