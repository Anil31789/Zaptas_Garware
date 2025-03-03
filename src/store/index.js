// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import companyReducer from './companySlice';
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    companyDetails: companyReducer,
    user: userReducer,
  },
});


export default store;
