import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import {
  setTitle,
  setDescription,
  setBody,
  addTag,
  removeTag,
  setTagList,
} from '../store/article/createAndEdit/createArticleReducer';
import { useParams, useHistory } from 'react-router-dom';
import { editArticle } from '../store/article/createAndEdit/editArticleAction';
import { getArticle } from '../store/article/getArticle/getArticleAction';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

import './Edit-Post.css';

const EditPost = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { slug } = useParams();
  const { title, description, body, tagList } = useSelector(
    (state) => state.createArticle
  );
  const { loading } = useSelector((state) => state.getArticle);
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ПОЛУЧАЮ ИМЕННО ТУ СТРАНИЦУ
  useEffect(() => {
    dispatch(getArticle({ slug }));
  }, [dispatch, slug]);
  const article = useSelector((state) => state.getArticle);

  useEffect(() => {
    if (article) {
      const { title, description, body, tagList } = article;
      setValue('title', title);
      setValue('description', description);
      setValue('body', body);

      dispatch(setTitle(title));
      dispatch(setDescription(description));
      dispatch(setBody(body));
      dispatch(setTagList(tagList.length > 0 ? tagList : ['']));
    }
  }, [article, dispatch, setValue]);

  // СНАЧАЛА ФИЛЬТРУЮ ТЕГИ
  const onSubmit = async () => {
    const filteredTags = tagList.filter((tag) => tag.trim() !== '');
    dispatch(setTagList(filteredTags));

    const result = await dispatch(
      editArticle({
        slug,
        title,
        description,
        body,
        tagList: filteredTags,
      })
    );
    if (editArticle.fulfilled.match(result)) {
      history.push(`/articles/${slug}`);
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
                (value && value.trim() !== '') || 'Title text is required',
            }}
            render={({ field }) => (
              <input
                {...field}
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
        <div className="edit-post__short-description">
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
        <div className="edit-post__text">
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
        <div className="edit-post__tags">
          Tags
          <div className="edit-post__tags-list">
            {tagList.map((tag, index) => (
              <div key={index} className="edit-post__tags-item">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  className="edit-post__tags-input"
                />
                <button
                  className="edit-post__tags-button-delete"
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                >
                  Delete
                </button>
                {index === tagList.length - 1 && (
                  <button
                    className="edit-post__tags-button-add"
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
        <button type="submit" className="edit-post-send-button">
          Send
        </button>
      </div>
    </form>
  );
};

export default EditPost;
