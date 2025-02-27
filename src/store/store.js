// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { resumeApi } from '../services/api/resumeApi';

export const store = configureStore({
  reducer: {
    [resumeApi.reducerPath]: resumeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(resumeApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});