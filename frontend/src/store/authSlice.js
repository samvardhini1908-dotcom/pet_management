import { createSlice } from '@reduxjs/toolkit';

let initialUser = null;
try {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    initialUser = JSON.parse(savedUser);
  }
} catch (e) {
  initialUser = null;
}

const initialState = {
  isLoggedIn: !!initialUser,
  user: initialUser || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;