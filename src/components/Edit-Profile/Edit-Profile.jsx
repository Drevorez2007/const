import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useUpdateUserMutation } from "../store/user/userApi";
import "./Edit-Profile.css";

const EditProfile = () => {
  const history = useHistory();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (currentUser) {
      reset({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        password: "",
        image: currentUser?.image || "",
      });
    }
  }, [currentUser, reset]);

  const onSubmit = async (data) => {
    const cleanData = { ...data };
    if (!cleanData.password) delete cleanData.password;
    if (!cleanData.image) delete cleanData.image;

    try {
      await updateUser(cleanData).unwrap();
      history.push("/");
    } catch (error) {
      console.error("Ошибка при обновлении профиля", error);
    }
  };

  if (!currentUser) {
    return <div>LOADING...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="edit-profile">
      <div className="edit-profile__data">
        <div className="edit-profile__text">Edit Profile</div>

        <div className="edit-profile__user-name">
          Username
          <input
            type="text"
            placeholder="Username"
            {...register("username", {
              required: true,
              minLength: 3,
              maxLength: 20,
            })}
          />
          {errors.username && (
            <p className="error">Username is required (3–20 chars)</p>
          )}
        </div>

        <div className="edit-profile__email">
          Email address
          <input
            type="email"
            placeholder="Email address"
            {...register("email", { required: true })}
          />
          {errors.email && <p className="error">Email must be valid</p>}
        </div>

        <div className="edit-profile__password">
          Password
          <input
            type="password"
            placeholder="Password"
            {...register("password", { minLength: 6, maxLength: 20 })}
          />
          {errors.password && (
            <p className="error">Password must be valid (6–20 chars)</p>
          )}
        </div>

        <div className="edit-profile__avatar">
          Avatar image (url)
          <input
            type="text"
            placeholder="Avatar image"
            {...register("image", {
              pattern: {
                value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i,
                message: "Enter a valid image URL",
              },
            })}
          />
          {errors.image && (
            <p className="error">
              {errors.image.message || "Avatar is required"}
            </p>
          )}
        </div>
      </div>

      <div className="edit-profile__create-acc">
        <button
          disabled={isLoading}
          type="submit"
          className="edit-profile__create-acc-button"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
