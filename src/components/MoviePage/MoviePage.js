import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import classes from "./MoviePage.module.scss";

import cover from "../../theme/icons/Titanic.jpg";
import { useSelector } from "react-redux";

const MoviePage = () => {
  const params = useParams();

  const navigate = useNavigate();

  const [movieData, setMovieData] = useState(null);

  //   console.log(params.id);

  const auth = useSelector((state) => state.auth.auth);

  const getData = async () => {
    const res = await fetch(
      process.env.REACT_APP_API_URL + `/movies/${params.id}`,
      {
        method: "get",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: auth.loginToken,
        },
      }
    );

    const data = await res.json();

    // console.log(res);
    // console.log(data);
    // console.log(data.data);

    if (data && data.data) setMovieData(data.data);
  };

  // console.log(movieData);

  useEffect(() => {
    if (auth.loginToken) getData();
  }, [params, auth.loginToken]);

  return (
    <div className={classes.page}>
      {movieData && (
        <>
          <img src={cover} alt="cover" className={classes.cover} />
          <div className={classes.title}>{movieData.title}</div>
          <div className={classes.year}>{movieData.year}</div>
          <div className={classes.actors}>
            {movieData.actors.map((e, i, arr) => (
              <>
                <div>{e.name}</div>
                {i !== arr.length - 1 && <div> ,</div>}
              </>
            ))}
          </div>
          <div className={classes.format}>{movieData.format}</div>
          <button
            className={classes["btn-back"]}
            onClick={() => {
              navigate("/movies");
            }}
          >
            Back to movies
          </button>
        </>
      )}
    </div>
  );
};

export default MoviePage;
