import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { type AxiosError } from 'axios';
import { type GitHubIssue } from './types';

export const fetchTasks = createAsyncThunk<
  GitHubIssue[],
  string,
  {
    rejectValue: AxiosError;
  }
>('tasks/fetchAll', async (pathname: string, thunkAPI) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos${pathname}/issues?page=1&per_page=30`
    );
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error as AxiosError);
  }
});
