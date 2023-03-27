import React, { useState } from "react";

import classes from "./MovieCard.module.scss";

import cover from "../../theme/icons/Titanic.jpg";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { moviesActions } from "../../store/store";

const MovieCard = (props) => {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth.auth);

  // console.log(props);

  const handleHover = () => {
    setIsHovered((prev) => !prev);
  };
  const handleDelete = async (id) => {
    const res = await fetch(process.env.REACT_APP_API_URL + `/movies/${id}`, {
      method: "DELETE",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: auth.loginToken,
      },
    });

    const data = await res.json();

    console.log(res);
    console.log(data);
    if (res.ok) dispatch(moviesActions.deleteMovie(id));
  };

  return (
    <div
      className={classes.wrap}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
    >
      {isHovered && (
        <div className={classes.overlay}>
          <button
            className={classes["btn-details"]}
            onClick={() => navigate(`/movies/${props.id}`)}
          >
            details
          </button>
          <button
            className={classes["btn-delete"]}
            onClick={() => handleDelete(props.id)}
          >
            Delete
          </button>
        </div>
      )}
      <img src={cover} alt="cover" className={classes.cover} />
      <div className={classes.description}>{props.title}</div>
    </div>
  );
};

export default MovieCard;
