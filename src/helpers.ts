import {
  type DraggableLocation,
  type DraggingStyle,
  type NotDraggingStyle,
} from 'react-beautiful-dnd';
import {
  ColumnType,
  type GitHubIssue,
  IssueState,
  type TaskModel,
  type TasksModel,
} from './redux/types';

export const setToLocalStorage = (value: TasksModel, pathname: string) => {
  window.localStorage.setItem(pathname, JSON.stringify(value));
};

export const getFromLocalStorage = (path: string) => {
  return JSON.parse(window.localStorage.getItem(path) || '{}');
};

export const getColumnName = (task: GitHubIssue) => {
  return task.state === IssueState.CLOSED
    ? ColumnType.DONE
    : task.assignee
    ? ColumnType.IN_PROGRESS
    : ColumnType.TO_DO;
};

export const reorder = (
  list: TaskModel[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const move = (
  source: TaskModel[],
  destination: TaskModel[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: Record<string, TaskModel[]> = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

export const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  background: isDraggingOver ? 'skyblue' : '#ccc',
  padding: 8,
  width: 250,
  minHeight: 800,
  borderRadius: 15,
  border: '2px solid gray',
  textAlign: 'center',
});

export const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
): React.CSSProperties => ({
  userSelect: 'none',
  opacity: isDragging ? 0.2 : 1,
  background: isDragging ? 'yellow' : '#aaa',
  borderRadius: 20,
  border: '1px solid black',
  boxShadow: '2px 1px 2px black',
  marginBottom: 10,
  ...draggableStyle,
});
