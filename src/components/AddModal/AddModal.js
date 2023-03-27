import React, { useState } from "react";

import classes from "./AddModal.module.scss";

import close from "../../theme/icons/close.png";
import { useDispatch, useSelector } from "react-redux";
import { moviesActions } from "../../store/store";

const AddModal = (props) => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [format, setFormat] = useState("");
  const [actors, setActors] = useState([]);
  const [file, setFile] = useState(null);
  const [fileParsed, setFileParsed] = useState(null);
  const [isTitleError, setIsTitleError] = useState(false);
  const [isYearError, setIsYearError] = useState(false);
  const [isFormatError, setIsFormatError] = useState(false);

  const auth = useSelector((state) => state.auth.auth);

  const dispatch = useDispatch();

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleYear = (e) => {
    setYear(e.target.value);
  };
  const handleFormat = (e) => {
    setFormat(e.target.value);
  };
  const handleActors = (e) => {
    // console.log([...e.target.value.split(",")]);
    setActors([...e.target.value.split(",")]);
  };

  const handleFile = async (e) => {
    setFile(e.target.files[0]);

    // console.log(e.target.files[0]);
    const text = await e.target.files[0].text();

    let arr = text.split("\r\n");

    arr = arr.filter((e) => e !== "");

    // console.log(arr);

    const arrObj = [];

    for (let i = 0; i <= arr.length - 1; i++) {
      arr[i] = arr[i].split(":");
    }
    for (let i = 0; i <= arr.length - 1; i = i + 4) {
      const obj = {
        title: arr[i][1],
        year: arr[i + 1][1],
        format: arr[i + 2][1],
        actors: arr[i + 3][1].split(","),
      };
      arrObj.push(obj);
    }

    for (let i = 0; i <= arrObj.length - 1; i++) {
      arrObj[i].title = arrObj[i].title.trim();
      arrObj[i].year = arrObj[i].year.trim();
      arrObj[i].format = arrObj[i].format.trim();
      for (let j = 0; j <= arrObj[i].actors.length - 1; j++) {
        arrObj[i].actors[j] = arrObj[i].actors[j].trim();
      }
    }

    // console.log(arr);
    // console.log(arrObj);

    setFileParsed(arrObj);
    // console.log(text);
  };

  // useEffect(() => {

  // }, [fileParsed])

  // console.log(process.env.REACT_APP_API_URl);

  // console.log(auth.loginToken);

  const handleAdd = async (e) => {
    e.preventDefault();
    const obj = {
      title,
      year,
      format,
      actors,
    };

    try {
      const res = await fetch(process.env.REACT_APP_API_URL + "/movies", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: auth.loginToken,
        },
      });

      const data = await res.json();
      // console.log(res);
      // console.log(data);

      if (data && data.data) {
        dispatch(moviesActions.addMovie(data.data));
        props.handleModal();
      }

      if (data.error) {
        if (data.error.code === "MOVIE_EXISTS") setIsTitleError(true);

        if (data.error.fields) {
          if (data.error.fields.format) setIsFormatError(true);
          if (data.error.fields.year) setIsYearError(true);
          if (data.error.fields.title) setIsTitleError(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImport = (e) => {
    e.preventDefault();
    fileParsed.forEach(async (el, i, arr) => {
      try {
        const res = await fetch(process.env.REACT_APP_API_URL + "/movies", {
          method: "POST",
          body: JSON.stringify(el),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: auth.loginToken,
          },
        });

        const data = await res.json();
        // console.log(res);
        // console.log(data);

        if (data && data.data) {
          dispatch(moviesActions.addMovie(data.data));
        }
      } catch (err) {
        console.log(err);
      }
    });
    props.handleModal();
  };

  return (
    <div className={classes.wrap}>
      <div className={classes.backdrop} onClick={props.handleModal}></div>
      <form className={classes.form}>
        <img
          src={close}
          alt="close"
          className={classes.close}
          onClick={props.handleModal}
        />
        <div className={classes.fields}>
          <div className={classes["input-wrap"]}>
            <label
              htmlFor=""
              className={`${classes.label} ${
                isTitleError ? classes["label-error"] : ""
              }`}
            >
              Title
            </label>
            <input
              type="text"
              className={classes.input}
              onChange={handleTitle}
              style={{ borderColor: `${isTitleError ? "red" : ""}` }}
              onFocus={() => {
                setIsTitleError(false);
              }}
            />
          </div>
          <div className={classes["input-wrap"]}>
            <label
              htmlFor=""
              className={`${classes.label} ${
                isYearError ? classes["label-error"] : ""
              }`}
            >
              Release Year
            </label>
            <input
              type="text"
              className={classes.input}
              onChange={handleYear}
              style={{ borderColor: `${isYearError ? "red" : ""}` }}
              onFocus={() => {
                setIsYearError(false);
              }}
            />
          </div>
          <div className={classes["input-wrap"]}>
            <label
              htmlFor=""
              className={`${classes.label} ${
                isFormatError ? classes["label-error"] : ""
              }`}
            >
              Format
            </label>
            <input
              type="text"
              className={classes.input}
              onChange={handleFormat}
              placeholder="DVD/VHS/Blu-Ray"
              style={{ borderColor: `${isFormatError ? "red" : ""}` }}
              onFocus={() => {
                setIsFormatError(false);
              }}
            />
          </div>
          <div className={classes["input-wrap"]}>
            <label htmlFor="" className={classes.label}>
              Actors
            </label>
            <input
              type="text"
              className={classes.input}
              onChange={handleActors}
            />
          </div>
        </div>
        <button className={classes["btn-add"]} onClick={handleAdd}>
          Add
        </button>
        <span>or import from file</span>
        <div className={classes["import-wrap"]}>
          <input
            type="file"
            className={classes["input-file"]}
            onChange={handleFile}
          />
          <button className={classes["btn-import"]} onClick={handleImport}>
            Import
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddModal;
