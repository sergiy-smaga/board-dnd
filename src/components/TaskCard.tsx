import React from 'react';
import { Space, Typography } from 'antd';
import { Draggable } from 'react-beautiful-dnd';
import { type CardProps } from '../redux/types';
import moment from 'moment';
import { getItemStyle } from '../helpers';

const { Text } = Typography;

export const TaskCard: React.FC<CardProps> = ({ task, index }) => {
  return (
    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <Space direction="vertical" style={{ padding: '5px' }}>
            <Text strong>{task.title}</Text>
            <Text>
              #{task.number} opened {moment().diff(task.createdAt, 'days')} days
              ago
            </Text>
            <Text>
              {task.assignee || 'no assignee'} | Comments: {task.comments}
            </Text>
          </Space>
        </div>
      )}
    </Draggable>
  );
};
