import { Space, Typography } from "antd";
import {
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { TaskModel } from "../redux/columnTasksSlice";
import moment from "moment";

const { Text } = Typography;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
): React.CSSProperties => ({
  userSelect: "none",
  opacity: isDragging ? 0.2 : 1,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

export const TaskCard = ({
  task,
  index,
}: {
  task: TaskModel;
  index: number;
}) => {
  return (
    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className="task-card"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <Space direction="vertical" style={{ padding: "5px" }}>
            <Text strong>{task.title}</Text>
            <Text>
              #{task.number} opened {moment().diff(task.createdAt, "days")} days
              ago
            </Text>
            <Text>
              {task.assignee || "no assignee"} | Comments: {task.comments}
            </Text>
          </Space>
        </div>
      )}
    </Draggable>
  );
};
