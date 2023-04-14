import React from 'react';
import { Space, Typography } from 'antd';
import { type ColumnProps, type TaskModel } from '../redux/types';
import { Droppable } from 'react-beautiful-dnd';
import { useAppSelector } from '../redux/hooks';
import { TaskCard } from './TaskCard';
import { getListStyle } from '../helpers';

export const TaskColumn: React.FC<ColumnProps> = ({ columnName }) => {
  const allTasks = useAppSelector((state) => state.columnTasks.tasks);

  return (
    <Droppable droppableId={columnName}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
          {...provided.droppableProps}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space
              align="center"
              direction="vertical"
              style={{ width: '100%' }}
            >
              <Typography.Title level={2}>{columnName}</Typography.Title>
            </Space>
            <Space direction="vertical">
              {allTasks[columnName].map((task: TaskModel, index: number) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
            </Space>
          </Space>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
