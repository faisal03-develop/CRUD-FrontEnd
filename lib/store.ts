import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice'; // Import the new slice
import postsReducer from './features/postSlice'; // 1. Import it


export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      posts: postsReducer, // 2. Add it here
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];


// ... rest of the file stays the same