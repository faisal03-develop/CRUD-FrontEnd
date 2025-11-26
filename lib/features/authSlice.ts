import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the User object
export interface User {
  id: number;
  username: string;
  email: string;
}

// Define the state for Authentication
interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Run this when the user logs in
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Sync with localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    // Run this when the user logs out
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    // Run this when the app starts to load data from localStorage
    initializeAuth: (state) => {
         const token = localStorage.getItem('token');
         const user = localStorage.getItem('user');
         if (token && user) {
             state.token = token;
             state.user = JSON.parse(user);
         }
    }
  },
});

export const { setCredentials, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;