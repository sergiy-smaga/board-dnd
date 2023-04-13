import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { fetchTasks } from "./operations";

export enum ColumnType {
  TO_DO = "Todo",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
}

export enum IssueState {
  OPEN = "open",
  CLOSED = "closed",
}

export interface GitHubIssue {
  id: number;
  title: string;
  number: number;
  state: IssueState;
  created_at: string;
  assignee: {
    login: string;
  };
  comments: number;
}
export interface TaskModel {
  id: number;
  title: string;
  number: number;
  createdAt: string;
  assignee: string;
  comments: number;
  column: ColumnType;
}

export interface TasksModel {
  [ColumnType.TO_DO]: TaskModel[];
  [ColumnType.IN_PROGRESS]: TaskModel[];
  [ColumnType.DONE]: TaskModel[];
}

export interface StateModel {
  tasks: TasksModel;
  isLoading: boolean;
  error: null | string;
}

const initialState: StateModel = {
  tasks: {
    [ColumnType.TO_DO]: [],
    [ColumnType.IN_PROGRESS]: [],
    [ColumnType.DONE]: [],
  },
  isLoading: false,
  error: null,
};
const columnTasksSlice = createSlice({
  name: "columnTasks",
  initialState,
  reducers: {
    moveTask: (state, action: PayloadAction<TasksModel>) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state: { isLoading: boolean }, action) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        action.payload.forEach((task: GitHubIssue) => {
          const column =
            task.state === IssueState.CLOSED
              ? ColumnType.DONE
              : task.assignee
              ? ColumnType.IN_PROGRESS
              : ColumnType.TO_DO;

          state.tasks[column].push({
            id: task.id,
            title: task.title,
            number: task.number,
            createdAt: task.created_at,
            assignee: task.assignee?.login,
            comments: task.comments,
            column,
          });
        });
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.errorMessage || "Something went wrong";
      });
  },
});

export default columnTasksSlice.reducer;
export const { moveTask } = columnTasksSlice.actions;
