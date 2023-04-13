import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { GitHubIssue } from "./columnTasksSlice";

interface MyKnownError {
  errorMessage: string;
}

export const fetchTasks = createAsyncThunk<
  GitHubIssue[],
  string,
  {
    rejectValue: MyKnownError;
  }
>("tasks/fetchAll", async (pathname: string, thunkAPI) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos${pathname}/issues?page=1&per_page=30`
    );
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error as MyKnownError);
  }
});
