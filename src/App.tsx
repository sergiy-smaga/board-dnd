import { Col, Row, Space, Typography } from "antd";
import {
  DragDropContext,
  DropResult,
  DraggableLocation,
} from "react-beautiful-dnd";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import {
  ColumnType,
  TaskModel,
  TasksModel,
  moveTask,
} from "./redux/columnTasksSlice";
import { TaskColumn } from "./components/TaskColumn";
import { Form } from "./components/Form";

const reorder = (list: TaskModel[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (
  source: TaskModel[],
  destination: TaskModel[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: {
    [key: string]: TaskModel[];
  } = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

export const App = () => {
  const allTasks = useAppSelector((state) => state.columnTasks.tasks);
  const dispatch = useAppDispatch();

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    const sInd: ColumnType = source.droppableId as ColumnType;
    const dInd: ColumnType = destination.droppableId as ColumnType;

    if (source.droppableId === destination.droppableId) {
      const items: TaskModel[] = reorder(
        allTasks[sInd],
        source.index,
        destination.index
      );
      const newState: TasksModel = { ...allTasks };
      newState[sInd] = items;
      dispatch(moveTask(newState));
    } else {
      const result = move(allTasks[sInd], allTasks[dInd], source, destination);
      const newState: TasksModel = { ...allTasks };
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];
      dispatch(moveTask(newState));
    }
  };

  return (
    <Space align="center">
      <Space align="center" direction="vertical" className="full-width">
        <Typography.Title>Task Board</Typography.Title>
        <Form />
        <DragDropContext onDragEnd={onDragEnd}>
          <Row gutter={20}>
            <Col flex="auto">
              <TaskColumn columnName={ColumnType.TO_DO} />
            </Col>
            <Col flex="auto">
              <TaskColumn columnName={ColumnType.IN_PROGRESS} />
            </Col>
            <Col flex="auto">
              <TaskColumn columnName={ColumnType.DONE} />
            </Col>
          </Row>
        </DragDropContext>
      </Space>
    </Space>
  );
};
