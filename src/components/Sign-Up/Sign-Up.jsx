import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { registerUser } from '../store/user/newUserActions';
import './Sign-Up.css';

const SignUp = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const userData = {
      user: {
        username: data.userName,
        email: data.email,
        password: data.password,
      },
    };
    dispatch(registerUser(userData));
  };
  return (
    <form className="sign-up" onSubmit={handleSubmit(onSubmit)}>
      <div className="sing-up__data">
        <div className="sign-up__text">Create new account</div>
        <div className="sign-up__user-name">
          Username
          <input
            type="text"
            placeholder="Username"
            {...register('userName', {
              required: true,
              minLength: 3,
              maxLength: 20,
            })}
          />
          {errors.userName && (
            <p className="error">Username is required (3–20 chars)</p>
          )}
        </div>
        <div className="sign-up__email">
          Email address
          <input
            type="email"
            placeholder="Email address"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: 'Email must be valid',
              },
            })}
          />
          {errors.email && <p className="error">Email must be valid</p>}
        </div>
        <div className="sign-up__password">
          Password
          <input
            type="text"
            placeholder="Password"
            {...register('password', {
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
            type="text"
            placeholder="Repeat Password"
            {...register('repeatPassword', {
              required: true,
              validate: (value) => value === watch('password'),
            })}
          />
          {errors.repeatPassword && (
            <p className="error">Password must be repeat</p>
          )}
        </div>
      </div>
      <div className="sign-up__personal-data">
        <div className="sign-up__personal-data-container">
          <input
            type="checkbox"
            {...register('personaldata', { required: true })}
          />
          <div className="sign-up__personal-data-text">
            I agree to the processing of my personal information
          </div>
        </div>
        {errors.personaldata && <p className="error">Must be checked</p>}
      </div>
      <div className="sign-up__create-acc">
        <button type="submit" className="sign-up__create-acc-button">
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
