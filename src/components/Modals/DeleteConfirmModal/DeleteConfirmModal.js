import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { moviesActions } from "../../../store/store";

import classes from "./DeleteConfirmModal.module.scss";

const DeleteConfirmModal = (props) => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth.auth);

  const handleDelete = async () => {
    const res = await fetch(
      process.env.REACT_APP_API_URL + `/movies/${props.id}`,
      {
        method: "DELETE",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: auth.loginToken,
        },
      }
    );

    const data = await res.json();

    console.log(res);
    console.log(data);
    if (res.ok) dispatch(moviesActions.deleteMovie(props.id));
  };

  return (
    <div className={classes.wrap}>
      <div className={classes.backdrop}></div>
      <div className={classes.modal}>
        <h2>Are you sure you want to delete movie {props.title}?</h2>

        <div className={classes.buttons}>
          <button className={classes["btn-ok"]} onClick={handleDelete}>
            Yes
          </button>
          <button className={classes["btn-cancel"]} onClick={props.handleModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
