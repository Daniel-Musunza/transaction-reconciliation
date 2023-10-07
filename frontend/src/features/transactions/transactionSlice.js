import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import transactionService from './transactionService'

const initialState = {
  transactions: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get user transactions
export const gettransactions = createAsyncThunk(
  'transactions/getAll',
  async (_, thunkAPI) => {
    try {
     
      return await transactionService.gettransactions()
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)


export const addtransaction = createAsyncThunk(
  'transactions/create',
  async (transactionData, thunkAPI) => {
    try {
      return await transactionService.addtransaction(transactionData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(gettransactions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(gettransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.transactions = action.payload
      })
      .addCase(gettransactions.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(addtransaction.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addtransaction.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.transactions.push(action.payload)
      })
      .addCase(addtransaction.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      
  },
})

export const { reset } = transactionSlice.actions
export default transactionSlice.reducer
