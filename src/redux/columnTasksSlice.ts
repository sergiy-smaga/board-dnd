import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchTasks } from './operations';
import {
  ColumnType,
  type GitHubIssue,
  type StateModel,
  type TasksModel,
} from './types';
import { getColumnName, setToLocalStorage } from '../helpers';

export const initialState: StateModel = {
  tasks: {
    [ColumnType.TO_DO]: [],
    [ColumnType.IN_PROGRESS]: [],
    [ColumnType.DONE]: [],
  },
  isLoading: false,
  error: null,
  pathname: '',
};

const columnTasksSlice = createSlice({
  name: 'columnTasks',
  initialState,
  reducers: {
    moveTask: (state, action: PayloadAction<TasksModel>) => {
      setToLocalStorage(action.payload, state.pathname);
      state.tasks = action.payload;
    },
    setPathname: (state, action: PayloadAction<string>) => {
      state.pathname = action.payload;
    },
    setStorageTasks: (state, action: PayloadAction<TasksModel>) => {
      state.tasks = action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        state.isLoading = true;
        state.tasks = initialState.tasks;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        action.payload.forEach((task: GitHubIssue) => {
          const column = getColumnName(task);

          state.tasks[column].push({
            id: task.id,
            title: task.title,
            number: task.number,
            createdAt: task.created_at,
            assignee: task.assignee?.login || 'no assignee',
            comments: task.comments,
            column,
          });
        });
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Something went wrong';
      });
  },
});

export default columnTasksSlice.reducer;
export const { moveTask, setPathname, setStorageTasks } =
  columnTasksSlice.actions;
