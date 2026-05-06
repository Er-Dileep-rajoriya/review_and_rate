import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import companyReducer from './slices/companySlice';
import reviewReducer from './slices/reviewSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    companies: companyReducer,
    reviews: reviewReducer,
    auth: authReducer,
  },
});
