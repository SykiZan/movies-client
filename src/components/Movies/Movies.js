import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actorsActions } from "../../store/store";
import AddModal from "../AddModal/AddModal";
import AddedMovieModal from "../Modals/AddedMovieModal/AddedMovieModal";
import ImportedCount from "../Modals/ImportedCount/ImportedCount";
import MovieCard from "../MovieCard/MovieCard";

import classes from "./Movies.module.scss";

const Movies = () => {
  const [isAddModal, setIsAddModal] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const [sorted, setSorted] = useState(null);
  const [searchVal, setSearchVal] = useState("");
  const [finalData, setFinalData] = useState(null);
  const [actorsArr, setActorsArr] = useState([]);

  const [isMovieAdded, setIsMovieAdded] = useState(false);
  const [addedMovie, setAddedMovie] = useState("");

  const [importedCount, setImportedCount] = useState(0);
  const [notImportedCount, setNotImportedCount] = useState(0);
  const [isImportedModal, setIsImportedModal] = useState(false);

  const [notFound, setNotfound] = useState(false);

  const movies = useSelector((state) => state.movies.movies);
  const actors = useSelector((state) => state.actors.actors);
  const auth = useSelector((state) => state.auth.auth);

  const dispatch = useDispatch();

  // console.log(movies);
  // console.log(actors);

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();

        handleSearch();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [searchVal]);

  const handleAddedModal = () => {
    setIsMovieAdded((prev) => !prev);
  };
  const handleAddedMovie = (val) => {
    setAddedMovie(val);
  };

  const handleAddModal = () => {
    setIsAddModal((prev) => !prev);
  };

  const handleSort = () => {
    setIsSort((prev) => !prev);
    getSorted();
  };

  const handleSearchVal = (e) => {
    setSearchVal(e.target.value);
  };
  const handleImportedCount = (val) => {
    setImportedCount(val);
  };
  const handleNotImportedCount = (val) => {
    setNotImportedCount(val);
  };

  const handleImportedModal = () => {
    setIsImportedModal((prev) => !prev);
  };

  const getSorted = () => {
    let arr = JSON.parse(JSON.stringify(finalData));

    arr.sort(function (a, b) {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      }
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    setSorted(arr);
  };

  const getActors = () => {
    // if (actors.length >= movies.length) return;
    let arr = [];

    const idArr = movies.map((e) => e.id);
    // console.log(idArr);

    try {
      idArr.forEach(async (el, i, arr) => {
        // console.log(el);

        const res = await fetch(
          process.env.REACT_APP_API_URL + `/movies/${el}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: auth.loginToken,
            },
          }
        );

        const data = await res.json();

        // console.log(data);

        const obj = JSON.parse(JSON.stringify(data.data));

        // console.log(obj);

        dispatch(actorsActions.addMovie(obj));
      });
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(actorsArr);

  useEffect(() => {
    dispatch(actorsActions.deleteMovies());

    getActors();
    setFinalData(movies);
  }, [movies]);

  // useEffect(() => {
  //   setFinalData(actors);
  // }, [actors]);

  useEffect(() => {
    if (finalData) getSorted();
  }, [finalData]);

  const handleSearch = () => {
    const arr = [];
    for (let i = 0; i < actors.length; i++) {
      if (actors[i].title.toLowerCase().includes(searchVal.toLowerCase()))
        arr.push(actors[i]);
      const myActors = actors[i].actors;
      for (let j = 0; j < myActors.length; j++) {
        if (myActors[j].name.toLowerCase().includes(searchVal.toLowerCase()))
          if (!arr.includes(actors[i])) arr.push(actors[i]);
      }
    }

    if (arr.length === 0) setNotfound(true);
    else setNotfound(false);

    // console.log(arr);
    setFinalData(arr);
  };

  return (
    <div className={classes.page}>
      <div className={classes["search-wrapper"]}>
        <input
          type="text"
          placeholder="movie or actor name"
          className={classes["input-search"]}
          onChange={handleSearchVal}
        />
        <button className={classes["btn-search"]} onClick={handleSearch}>
          Search
        </button>
      </div>
      <button className={classes["btn-add"]} onClick={handleAddModal}>
        Add new movie
      </button>
      <button
        className={`${classes["btn-sort"]} ${
          isSort ? classes["btn-sort-active"] : ""
        }`}
        onClick={handleSort}
      >
        {!isSort && "Sort alphabetically"}
        {isSort && "disable sort"}
      </button>
      <section className={classes.movies}>
        {finalData &&
          (isSort ? sorted : finalData).map((e) => (
            // finalData.map((e) => (
            <MovieCard key={e.id} id={e.id} title={e.title} />
          ))}
      </section>
      {movies.length === 0 && <h3>No movies yet</h3>}
      {notFound && movies.length > 0 && <h3>No movies found</h3>}
      {isAddModal && (
        <AddModal
          handleModal={handleAddModal}
          handleAddedModal={handleAddedModal}
          handleAddedMovie={handleAddedMovie}
          handleImportedCount={handleImportedCount}
          handleNotImportedCount={handleNotImportedCount}
          handleImportedModal={handleImportedModal}
        />
      )}
      {isMovieAdded && (
        <AddedMovieModal title={addedMovie} handleModal={handleAddedModal} />
      )}
      {isImportedModal && (
        <ImportedCount
          imported={importedCount}
          notImported={notImportedCount}
          handleModal={handleImportedModal}
        />
      )}
    </div>
  );
};

export default Movies;
