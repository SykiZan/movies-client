import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions, getMovies } from "../../store/store";

import classes from "./LoginPage.module.scss";

const LoginPage = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth.auth);

  const [email, setEmail] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  //   const handleLogin = ()=>{

  //   }

  const getToken = async () => {
    const obj = {
      email: email,
      name: "Petrov Petro",
      password: "super-password",
      confirmPassword: "super-password",
    };

    const res = await fetch(process.env.REACT_APP_API_URL + "/users", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(res);
    console.log(data);

    if (data.hasOwnProperty("error")) {
      setIsEmailError(true);
      return;
    }

    if (data && data.token) {
      const loginToken = data.token;
      dispatch(authActions.editAuth({ loginToken }));
      dispatch(getMovies(loginToken));

      localStorage.setItem("token", loginToken);
      navigate("/");
    }
  };

  return (
    <div className={classes.page}>
      <div className={classes.form}>
        <div className={classes["input-wrap"]}>
          <label
            htmlFor=""
            className={`${classes.label} ${
              isEmailError ? classes["label-error"] : ""
            }`}
          >
            {!isEmailError && "Email"}
            {isEmailError && "error, try another email"}
          </label>
          <input
            type="email"
            className={classes.input}
            onChange={handleEmail}
            style={{ borderColor: `${isEmailError ? "red" : ""}` }}
            onFocus={() => {
              setIsEmailError(false);
            }}
          />
        </div>
        <button className={classes.btn} onClick={getToken}>
          Log in
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
