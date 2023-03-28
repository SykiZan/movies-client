import { configureStore, createSlice } from "@reduxjs/toolkit";

const movies = {
  movies: [],
};
const actors = {
  actors: [],
};
const auth = {
  auth: { loginToken: "" },
};

const moviesSlice = createSlice({
  name: "movies",
  initialState: movies,
  reducers: {
    setMovies(state, action) {
      state.movies = [...action.payload];
    },
    addMovie(state, action) {
      state.movies = [...state.movies, action.payload];
    },
    deleteMovie(state, action) {
      state.movies = state.movies.filter((e) => e.id !== action.payload);
    },
  },
});
const authSlice = createSlice({
  name: "auth",
  initialState: auth,
  reducers: {
    editAuth(state, action) {
      state.auth = action.payload;
    },
  },
});
const actorsSlice = createSlice({
  name: "actors",
  initialState: actors,
  reducers: {
    addMovie(state, action) {
      // state.actors = [...state.actors, action.payload];

      let pos = null;
      for (let i = 0; i <= state.actors.length - 1; i++) {
        if (state.actors[i].id == action.payload.id) pos = true;
      }

      if (pos) state.actors = state.actors;
      else state.actors = [...state.actors, action.payload];
    },
    deleteMovies(state, action) {
      state.actors = [];
    },
  },
});

const moviesStore = configureStore({
  reducer: {
    movies: moviesSlice.reducer,
    auth: authSlice.reducer,
    actors: actorsSlice.reducer,
  },
});

export const getMovies = (token) => {
  return async (dispatch) => {
    const getMovies = async () => {
      const res = await fetch(
        process.env.REACT_APP_API_URL + "/movies?limit=100",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: token,
          },
        }
      );

      const data = await res.json();

      // console.log(res);
      // console.log(data);

      return data.data;
    };

    const movies = await getMovies();

    // console.log(movies);
    if (movies) dispatch(moviesActions.setMovies(movies));
    else {
      localStorage.removeItem("token");
      dispatch(authActions.editAuth({ loginToken: "" }));
    }
  };
};

export const moviesActions = moviesSlice.actions;
export const authActions = authSlice.actions;
export const actorsActions = actorsSlice.actions;

export default moviesStore;
