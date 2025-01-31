import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

// Redux reducer define
export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;