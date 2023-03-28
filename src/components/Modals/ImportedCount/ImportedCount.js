import React from "react";

import classes from "./ImportedCount.module.scss";

const ImportedCount = (props) => {
  return (
    <div className={classes.wrap}>
      <div className={classes.backdrop}></div>
      <div className={classes.modal}>
        <div>
          Imported movies:
          <span className={classes.imported}> {props.imported}</span>
        </div>
        <div>
          Not imported movies:
          <span className={classes["not-imported"]}> {props.notImported}</span>
        </div>
        <button className={classes["btn-ok"]} onClick={props.handleModal}>
          OK
        </button>
      </div>
    </div>
  );
};

export default ImportedCount;
