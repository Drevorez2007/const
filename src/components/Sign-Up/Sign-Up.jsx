import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { registerUser } from "../store/user/newUserActions";
import "./Sign-Up.css";

const SignUp = () => {
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const isLoading = useSelector((state) => state.global.isLoading);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError({});
    const userData = {
      user: {
        username: data.userName,
        email: data.email,
        password: data.password,
      },
    };

    const action = await dispatch(registerUser(userData));
    if (registerUser.rejected.match(action)) {
      setServerError(action.payload);
    } else {
      setIsRegistered(true);
    }
  };

  useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        setIsRegistered(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isRegistered]);

  return (
    <form className="sign-up" onSubmit={handleSubmit(onSubmit)}>
      {isRegistered && (
        <div className="success-message">✅ Вы успешно зарегистрированы!</div>
      )}

      <div className="sing-up__data">
        <div className="sign-up__text">Create new account</div>

        <div className="sign-up__user-name">
          Username
          <input
            type="text"
            placeholder="Username"
            {...register("userName", {
              required: true,
              minLength: 3,
              maxLength: 20,
            })}
          />
          {errors.userName && (
            <p className="error">Username is required (3–20 chars)</p>
          )}
          {serverError.username && (
            <p className="error">
              Username{" "}
              {Array.isArray(serverError.username)
                ? serverError.username.join(", ")
                : serverError.username}
            </p>
          )}
        </div>

        <div className="sign-up__email">
          Email address
          <input
            type="email"
            placeholder="Email address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: "Email must be valid",
              },
            })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
          {serverError.email && (
            <p className="error">
              Email{" "}
              {Array.isArray(serverError.email)
                ? serverError.email.join(", ")
                : serverError.email}
            </p>
          )}
        </div>

        <div className="sign-up__password">
          Password
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: true,
              minLength: 6,
              maxLength: 20,
            })}
          />
          {errors.password && (
            <p className="error">Password must be valid (6–20 chars)</p>
          )}
        </div>

        <div className="sign-up__repeat-password">
          Repeat Password
          <input
            type="password"
            placeholder="Repeat Password"
            {...register("repeatPassword", {
              required: true,
              validate: (value) => value === watch("password"),
            })}
          />
          {errors.repeatPassword && (
            <p className="error">Passwords must match</p>
          )}
        </div>
      </div>

      <div className="sign-up__personal-data">
        <div className="sign-up__personal-data-container">
          <input
            type="checkbox"
            {...register("personaldata", { required: true })}
          />
          <div className="sign-up__personal-data-text">
            I agree to the processing of my personal information
          </div>
        </div>
        {errors.personaldata && <p className="error">Must be checked</p>}
      </div>

      <div className="sign-up__create-acc">
        <button
          disabled={isLoading}
          type="submit"
          className="sign-up__create-acc-button"
        >
          Create
        </button>
        <div className="sign-up__create-acc-info">
          <div className="sign-up__create-acc-info-text">
            Already have an account?
          </div>
          <Link className="sign-up__create-acc-info-sing-in" to="/sign-in">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
