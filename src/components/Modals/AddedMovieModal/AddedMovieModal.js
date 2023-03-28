import React from "react";

import classes from "./AddedMovieModal.module.scss";

const AddedMovieModal = (props) => {
  return (
    <div className={classes.wrap}>
      <div className={classes.backdrop}></div>
      <div className={classes.modal}>
        <h2>Success</h2>
        <div>Movie {props.title} was added</div>

        <button className={classes["btn-ok"]} onClick={props.handleModal}>
          OK
        </button>
      </div>
    </div>
  );
};

export default AddedMovieModal;
