import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import axios from "axios";

const login = createAsyncThunk<any, { username: string; password: string }, { state: UsersState }>(
  "users/login",
  async (data, { getState }) => {
    const { loading } = getState();
    if (loading !== "pending") {
      return;
    }

    const response = await axios.post("/Admin/login", data);
    return response.data;
  },
);

const checkTokenValidation = createAsyncThunk<any, string, { state: UsersState }>(
  "users/checkTokenValidation",
  async (token, { getState }) => {
    const { loading } = getState();
    if (loading !== "pending") {
      return;
    }

    const response = await axios({
      method: "GET",
      url: "/auth/checkValidToken",
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(token),
      },
    });
    return response.data;
  },
);

const deleteToken = createAsyncThunk<any, string, { state: UsersState }>(
  "user/deleteToken",
  async (token, { getState }) => {
    const { loading } = getState();
    if (loading !== "pending") {
      return;
    }

    const response = await axios({
      method: "POST",
      url: "/Admin/logout",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return response;
  },
);

interface UsersState {
  loading: "idle" | "pending";
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  data: any;
  checkToken: any;
  error: SerializedError | null;
}

const initialState: UsersState = {
  loading: "idle",
  isLoading: false,
  isError: false,
  isSuccess: false,
  data: [],
  checkToken: [],
  error: null,
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.isLoading = true;
          state.isSuccess = false;
          state.isError = false;
        }
      })
      .addCase(login.fulfilled, (state, action) => {
        if (state.loading === "pending") {
          state.loading = "idle";
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.data = action.payload;
        }
      })
      .addCase(login.rejected, (state, action) => {
        if (state.loading === "pending") {
          state.loading = "idle";
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = true;
          state.error = action.error;
        }
      })
      .addCase(checkTokenValidation.pending, (state, action) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.isLoading = true;
          state.isSuccess = false;
          state.isError = false;
        }
      })
      .addCase(checkTokenValidation.fulfilled, (state, action) => {
        if (state.loading === "pending") {
          state.loading = "idle";
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.data = action.payload;
        }
      })
      .addCase(checkTokenValidation.rejected, (state, action) => {
        if (state.loading === "pending") {
          state.loading = "idle";
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = true;
          state.error = action.error;
        }
      })
      .addCase(deleteToken.pending, (state, action) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.isLoading = true;
          state.isSuccess = false;
          state.isError = false;
        }
      })
      .addCase(deleteToken.fulfilled, (state, action) => {
        if (state.loading === "pending") {
          state.loading = "idle";
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.data = action.payload;
        }
      })
      .addCase(deleteToken.rejected, (state, action) => {
        if (state.loading === "pending") {
          state.loading = "idle";
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = true;
          state.error = action.error;
        }
      });
  },
});

// export const { } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const getUser = (state: RootState) => state..data;

export default userSlice.reducer;
