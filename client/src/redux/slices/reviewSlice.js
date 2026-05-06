import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchReviews = createAsyncThunk(
  'reviews/fetchByCompany',
  async ({ companyId, sort = 'Newest' }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reviews/${companyId}?sort=${sort}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/create',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const likeReview = createAsyncThunk(
  'reviews/like',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/like`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (reviewId, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    sort: 'Newest'
  },
  reducers: {
    setReviewSort: (state, action) => {
      state.sort = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(likeReview.fulfilled, (state, action) => {
        const index = state.items.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.items = state.items.filter(r => r._id !== action.payload);
      });
  },
});

export const { setReviewSort } = reviewSlice.actions;
export default reviewSlice.reducer;
