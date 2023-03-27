import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import classes from "./App.module.scss";
import LoginPage from "./components/LoginPage/LoginPage";
import MoviePage from "./components/MoviePage/MoviePage";
import Movies from "./components/Movies/Movies";
import { authActions, getMovies } from "./store/store";

function App() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // const loginToken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI0OTcyMjYwfQ.X31cryg_A126WLYT96PD-SLLFWSxb2SeoQZ4cvx3VhU";

  const loginToken = localStorage.getItem("token");

  const auth = useSelector((state) => state.auth.auth);

  useEffect(() => {
    if (loginToken && loginToken !== "undefined") {
      dispatch(getMovies(loginToken));
      dispatch(authActions.editAuth({ loginToken }));
    } else navigate("/login");
  }, [auth.loginToken]);

  // useEffect(() => {
  //   if (loginToken && loginToken !== "undefined") {
  //     dispatch(getMovies(loginToken));
  //     dispatch(authActions.editAuth({ loginToken }));
  //   } else getToken();
  // }, [auth.loginToken]);

  // const getToken = async () => {
  //   const obj = {
  //     email: "petro4@gmail.com",
  //     name: "Petrov Petro",
  //     password: "super-password",
  //     confirmPassword: "super-password",
  //   };

  //   const res = await fetch(process.env.REACT_APP_API_URL + "/users", {
  //     method: "POST",
  //     body: JSON.stringify(obj),
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await res.json();
  //   console.log(res);
  //   console.log(data);

  //   if (data && data.token) {
  //     const loginToken = data.token;
  //     dispatch(authActions.editAuth({ loginToken }));
  //     dispatch(getMovies(loginToken));

  //     localStorage.setItem("token", loginToken);
  //   }
  // };

  return (
    <div className={classes.App}>
      <Routes>
        <Route path="/" element={<Navigate replace to="/movies" />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MoviePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
