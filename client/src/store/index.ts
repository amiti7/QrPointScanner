import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import qrReducer from './qrSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    qr: qrReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['auth.user.createdAt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
