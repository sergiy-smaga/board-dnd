import React from 'react';
import { Col, Row, Space, Typography } from 'antd';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { ColumnType, type TaskModel, type TasksModel } from './redux/types';
import { moveTask } from './redux/columnTasksSlice';

import { TaskColumn } from './components/TaskColumn';
import SearchForm from './components/SearchForm';
import { move, reorder } from './helpers';

export const App: React.FC = () => {
  const allTasks = useAppSelector((state) => state.columnTasks.tasks);
  const error = useAppSelector((state) => state.columnTasks.error);

  const dispatch = useAppDispatch();

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (destination == null) {
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
      <Space align="center" direction="vertical" style={{ width: '100vw' }}>
        <Typography.Title>Task Board</Typography.Title>
        <SearchForm />
        {error ? (
          <Typography.Title type="danger">{error}</Typography.Title>
        ) : (
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
        )}
      </Space>
    </Space>
  );
};
