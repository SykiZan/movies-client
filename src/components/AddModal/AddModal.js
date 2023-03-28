import React, { useEffect, useRef, useState } from "react";

import classes from "./AddModal.module.scss";

import close from "../../theme/icons/close.png";
import { useDispatch, useSelector } from "react-redux";
import { moviesActions } from "../../store/store";
import FileErrorModal from "../Modals/FileErrorModal/FileErrorModal";
import AddedMovieModal from "../Modals/AddedMovieModal/AddedMovieModal";

const AddModal = (props) => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [format, setFormat] = useState("DVD");
  const [actors, setActors] = useState([]);
  const [file, setFile] = useState(null);
  const [fileParsed, setFileParsed] = useState(null);

  const [isTitleError, setIsTitleError] = useState(false);
  const [isYearError, setIsYearError] = useState(false);
  const [isFileError, setIsFileError] = useState(false);
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [yearErrorMessage, setYearErrorMessage] = useState("");

  const [isFormatError, setIsFormatError] = useState(false);

  const [importedCount, setImportedCount] = useState(0);
  const [notImportedCount, setNotImportedCount] = useState(0);

  const auth = useSelector((state) => state.auth.auth);

  const dispatch = useDispatch();

  const inputFileRef = useRef();

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

  const handleFileModal = () => {
    setIsFileError((prev) => !prev);
    inputFileRef.current.value = "";
  };

  const handleFile = async (e) => {
    setFile(e.target.files[0]);

    // console.log(e.target.files[0]);
    let text = await e.target.files[0].text();

    text = text.trim();

    console.log(text);

    if (text === "") console.log("empty file");

    let arr = text.split("\r\n");

    arr = arr.filter((e) => e !== "");

    // console.log(arr);
    try {
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
    } catch (err) {
      console.log("invalid file structure");
      setIsFileError(true);
    }
  };

  // useEffect(() => {

  // }, [fileParsed])

  // console.log(process.env.REACT_APP_API_URl);

  // console.log(auth.loginToken);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (title.trim() === "") {
      setTitle("");
      setIsTitleError(true);
      setTitleErrorMessage("Title can not be empty");
      return;
    }

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
        props.handleAddedMovie(data.data.title);
        props.handleAddedModal();
      }

      if (data.error) {
        if (data.error.code === "MOVIE_EXISTS") {
          setIsTitleError(true);
          setTitleErrorMessage("Movie already exists");
        }

        if (data.error.fields) {
          if (data.error.fields.format) setIsFormatError(true);
          if (data.error.fields.year) {
            setYearErrorMessage("Year can't be so low");
            setIsYearError(true);
          }

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
          setImportedCount((prev) => prev + 1);
        } else setNotImportedCount((prev) => prev + 1);
      } catch (err) {
        console.log(err);
      }
    });
    // props.handleModal();
  };

  useEffect(() => {
    if (!fileParsed) return;
    if (importedCount + notImportedCount === fileParsed.length) {
      console.log(importedCount, notImportedCount);
      props.handleImportedCount(importedCount);
      props.handleNotImportedCount(notImportedCount);
      props.handleImportedModal();
      props.handleModal();
    }
  }, [importedCount, notImportedCount]);

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
              {!isTitleError && "Title"}
              {isTitleError && titleErrorMessage}
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
              {!isYearError && "Release Year"}
              {isYearError && yearErrorMessage}
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
            {/* <input
              type="text"
              className={classes.input}
              onChange={handleFormat}
              placeholder="DVD/VHS/Blu-Ray"
              style={{ borderColor: `${isFormatError ? "red" : ""}` }}
              onFocus={() => {
                setIsFormatError(false);
              }}
            /> */}
            <select className={classes.select} onChange={handleFormat}>
              <option value="DVD" selected>
                DVD
              </option>
              <option value="VHS">VHS</option>
              <option value="Blu-Ray">Blu-Ray</option>
            </select>
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
        <span>or import from a .txt file</span>
        <div className={classes["import-wrap"]}>
          <input
            type="file"
            accept=".txt"
            className={classes["input-file"]}
            onChange={handleFile}
            ref={inputFileRef}
          />
          <button className={classes["btn-import"]} onClick={handleImport}>
            Import
          </button>
        </div>
      </form>
      {isFileError && <FileErrorModal handleModal={handleFileModal} />}
    </div>
  );
};

export default AddModal;
