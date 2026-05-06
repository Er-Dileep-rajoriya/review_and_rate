import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchCompanies = createAsyncThunk(
  'companies/fetchAll',
  async ({ page = 1, limit = 5, search = '', city = '', sort = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        search,
        city,
        sort
      });
      const response = await api.get(`/companies?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCompany = createAsyncThunk(
  'companies/add',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/companies', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateCompany = createAsyncThunk(
  'companies/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/companies/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'companies/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/companies/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const companySlice = createSlice({
  name: 'companies',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    page: 1,
    pages: 1,
    total: 0,
    hasMore: true,
    // filters reflect what is currently shown on the screen
    filters: {
      search: '',
      city: '',
      sort: 'Name'
    },
    // tempFilters reflect what the user is currently typing/selecting
    tempFilters: {
      search: '',
      city: '',
      sort: 'Name'
    }
  },
  reducers: {
    resetCompanies: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
    updateTempFilters: (state, action) => {
      state.tempFilters = { ...state.tempFilters, ...action.payload };
    },
    applyFilters: (state) => {
      state.filters = { ...state.tempFilters };
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
    setSort: (state, action) => {
      state.tempFilters.sort = action.payload;
      state.filters.sort = action.payload;
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
    updateCompanyStats: (state, action) => {
      const { companyId, rating, reviews } = action.payload;
      const company = state.items.find(c => c._id === companyId);
      if (company) {
        company.rating = rating;
        company.reviews = reviews;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { companies, page, pages, total } = action.payload;

        if (page === 1) {
          state.items = companies;
        } else {
          state.items = [...state.items, ...companies];
        }

        state.page = page;
        state.pages = pages;
        state.total = total;
        state.hasMore = page < pages;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { resetCompanies, updateTempFilters, applyFilters, setSort, updateCompanyStats } = companySlice.actions;
export default companySlice.reducer;
