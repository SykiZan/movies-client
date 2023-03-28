import React from "react";

import classes from "./FileErrorModal.module.scss";

const FileErrorModal = (props) => {
  return (
    <div className={classes.wrap}>
      <div className={classes.backdrop}></div>
      <div className={classes.modal}>
        <h2>Must be a .txt file of the following structure</h2>
        <a
          href="https://gist.github.com/k0stik/3028d42973544dd61c3b4ad863378cad"
          target="_blank"
          className={classes.link}
        >
          https://gist.github.com/k0stik/3028d42973544dd61c3b4ad863378cad
        </a>
        <button className={classes["btn-ok"]} onClick={props.handleModal}>
          OK
        </button>
      </div>
    </div>
  );
};
export default FileErrorModal;
