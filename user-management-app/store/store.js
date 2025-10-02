import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

const normalizeUser = user => ({
  id: String(user.id ?? nanoid()),
  name: user.name ?? '',
  email: user.email ?? '',
  phone: user.phone ?? '',
  website: user.website ?? '',
  company: {
    name: user.company?.name ?? ''
  },
  address: {
    street: user.address?.street ?? '',
    suite: user.address?.suite ?? '',
    city: user.address?.city ?? '',
    zipcode: user.address?.zipcode ?? ''
  }
});

export const fetchUsers = createAsyncThunk('users/fetch', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Unable to fetch users');
  }
  const data = await response.json();
  return data.map(normalizeUser);
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    search: ''
  },
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    addUser: {
      reducer(state, action) {
        state.items = [action.payload, ...state.items];
      },
      prepare(payload) {
        return {
          payload: normalizeUser({ ...payload, id: nanoid() })
        };
      }
    },
    updateUser(state, action) {
      const index = state.items.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = normalizeUser({ ...state.items[index], ...action.payload });
      }
    },
    deleteUser(state, action) {
      state.items = state.items.filter(user => user.id !== action.payload);
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setSearch, addUser, updateUser, deleteUser } = usersSlice.actions;

export const selectUsersState = state => state.users;
export const selectFilteredUsers = state => {
  const { items, search } = selectUsersState(state);
  if (!search.trim()) {
    return items;
  }
  const query = search.trim().toLowerCase();
  return items.filter(user => {
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });
};
export const selectUserById = (state, id) => selectUsersState(state).items.find(user => user.id === id);

export const store = configureStore({
  reducer: {
    users: usersSlice.reducer
  }
});
