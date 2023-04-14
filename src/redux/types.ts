export interface CardProps {
  task: TaskModel;
  index: number;
}

export interface ColumnProps {
  columnName: ColumnType;
}

export enum ColumnType {
  TO_DO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export enum IssueState {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface GitHubIssue {
  id: number;
  title: string;
  number: number;
  state: IssueState;
  created_at: string;
  assignee: {
    login: string;
  } | null;
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
  pathname: string;
}
