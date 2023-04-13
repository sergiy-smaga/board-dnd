import { Space, Typography } from "antd";
import { ColumnType, TaskModel } from "../redux/columnTasksSlice";
import { Droppable } from "react-beautiful-dnd";
import { useAppSelector } from "../redux/hooks";
import { TaskCard } from "./TaskCard";

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: 8,
  width: 250,
});

export const TaskColumn = ({ columnName }: { columnName: ColumnType }) => {
  const allTasks = useAppSelector((state) => state.columnTasks.tasks);

  const columnTasks = allTasks[columnName].map(
    (task: TaskModel, index: number) => {
      return <TaskCard key={task.id} task={task} index={index} />;
    }
  );

  return (
    <Droppable droppableId={columnName}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className="text-center task-column"
          style={getListStyle(snapshot.isDraggingOver)}
          {...provided.droppableProps}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space
              className="task-column-header"
              align="center"
              direction="vertical"
            >
              <Typography.Title level={2}>{columnName}</Typography.Title>
            </Space>
            <Space direction="vertical">{columnTasks}</Space>
          </Space>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
