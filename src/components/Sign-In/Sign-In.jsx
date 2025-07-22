import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../store/user/userApi";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { setUser } from "../store/user/userReducer";
import { articleApi } from "../store/article/articleApi";
import "./Sign-In.css";

const SignIn = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data) => {
    try {
      const response = await login({ user: data }).unwrap();
      dispatch(setUser(response.user));
      localStorage.setItem("user", JSON.stringify(response.user));

      dispatch(articleApi.util.invalidateTags(["Articles"])); 
      history.push("/");
    } catch (error) {
      setServerError("Wrong password or Email");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="sign-in">
      <div className="sign-in__data">
        <div className="sign-in__text">Sign In</div>

        <div className="sign-in__email">
          Email address
          <input
            type="email"
            placeholder="Email address"
            onChange={() => setServerError("")}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Email must be valid",
              },
            })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="sign-in__password">
          Password
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: true,
              minLength: 6,
              maxLength: 20,
            })}
            onChange={() => setServerError("")}
          />
          {errors.password ? (
            <p className="error">Password must be 6–20 characters</p>
          ) : serverError ? (
            <p className="error">{serverError}</p>
          ) : null}
        </div>
      </div>

      <div className="sign-in__create-acc">
        <button disabled={isLoading} className="sign-in__create-acc-button">
          Login
        </button>
        <div className="sign-in__create-acc-info">
          <div className="sign-in__create-acc-info-text">
            Don’t have an account?
          </div>
          <Link className="sign-in__create-acc-info-sign-up" to="/sign-up">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
