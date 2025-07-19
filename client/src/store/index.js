import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice.js';
import qrSlice from './qrSlice.js';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    qr: qrSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});