import React, { useState } from "react";

import classes from "./MovieCard.module.scss";

import cover from "../../theme/icons/Titanic.jpg";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { moviesActions } from "../../store/store";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal/DeleteConfirmModal";

const MovieCard = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const navigate = useNavigate();

  // console.log(props);

  const handleHover = () => {
    setIsHovered((prev) => !prev);
  };

  const handleDeleteModal = () => {
    handleHover();
    setIsDeleteModal((prev) => !prev);
  };

  return (
    <div
      className={classes.wrap}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
    >
      {isHovered && !isDeleteModal && (
        <div className={classes.overlay}>
          <button
            className={classes["btn-details"]}
            onClick={() => navigate(`/movies/${props.id}`)}
          >
            details
          </button>
          <button className={classes["btn-delete"]} onClick={handleDeleteModal}>
            Delete
          </button>
        </div>
      )}
      <img src={cover} alt="cover" className={classes.cover} />
      <div className={classes.description}>{props.title}</div>
      {isDeleteModal && (
        <DeleteConfirmModal
          id={props.id}
          title={props.title}
          handleModal={handleDeleteModal}
        />
      )}
    </div>
  );
};

export default MovieCard;
