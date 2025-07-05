import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  setTitle,
  setDescription,
  setBody,
  addTag,
  removeTag,
  setTagList,
  resetArticleForm,
} from '../store/article/createAndEdit/createArticleReducer';
import { createPost } from '../store/article/createAndEdit/createArticleAction';

import './Create-Post.css';
const CreatePost = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { tagList, title, description, body } = useSelector(
    (state) => state.createArticle
  );

  useEffect(() => {
    dispatch(resetArticleForm());
  }, [dispatch]);

  const onSubmit = async () => {
    const filteredTags = tagList.filter((tag) => tag.trim() !== '');
    dispatch(setTagList(filteredTags));
    const result = await dispatch(createPost());

    if (createPost.fulfilled.match(result)) {
      history.push(`/`);
    } else {
      console.log('Ошибка при обновлении статьи', result);
    }
  };


  const handleAddTag = () => {
    const lastTag = tagList[tagList.length - 1];
    if (lastTag && lastTag.trim() !== '') {
      dispatch(addTag(''));
    }
  };


  const handleTagChange = (index, value) => {
    const updateTags = [...tagList];
    updateTags[index] = value;
    dispatch(setTagList(updateTags));
  };


  const handleRemoveTag = (index) => {
    if (tagList.length > 1) {
      dispatch(removeTag(index));
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
            rules={{
              validate: (value) =>
                (value && value.trim() !== '') || 'Title text is required',
            }}
            render={({ field }) => (
              <input
                {...field}
                value={title}
                placeholder="Title"
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(setTitle(e.target.value));
                }}
              />
            )}
          />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>
        <div className="create-post__short-description">
          Short description
          <Controller
            name="description"
            control={control}
            rules={{
              validate: (value) =>
                (value && value.trim() !== '') ||
                'Description text is required',
            }}
            render={({ field }) => (
              <textarea
                {...field}
                value={description}
                placeholder="Title"
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(setDescription(e.target.value));
                }}
              />
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
            rules={{
              validate: (value) =>
                (value && value.trim() !== '') || 'Body text is required',
            }}
            render={({ field }) => (
              <textarea
                {...field}
                value={body}
                placeholder="Text"
                onChange={(e) => {
                  field.onChange(e);
                  dispatch(setBody(e.target.value));
                }}
              />
            )}
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
                  className="create-post__tags-button-delete"
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                >
                  Delete
                </button>
                {index === tagList.length - 1 && (
                  <button
                    className="create-post__tags-button-add"
                    type="button"
                    onClick={() => handleAddTag()}
                  >
                    Add tag
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="create-post-send-button">
          Send
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
