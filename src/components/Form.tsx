import { Button, Input, Space, Typography } from "antd";
import { useState } from "react";
import { fetchTasks } from "../redux/operations";
import { useAppDispatch } from "../redux/hooks";
const { Link } = Typography;

export const Form = () => {
  const [url, setURL] = useState("");
  const dispatch = useAppDispatch();

  const pathname = url ? new URL(url).pathname : "";

  return (
    <Space direction="horizontal" style={{ marginBottom: "30px" }}>
      <Input
        value={url}
        style={{ minHeight: "40px", width: "500px" }}
        placeholder="Enter repo URL"
        onChange={(e) => {
          setURL(e.target.value);
        }}
      ></Input>
      <Button
        style={{ minHeight: "40px" }}
        disabled={!url}
        onClick={() => {
          dispatch(fetchTasks(pathname));
          setURL("");
        }}
        type="primary"
      >
        Load issues
      </Button>
      <Space direction="horizontal">
        <Link href="https://ant.design" target="_blank">
          Ant Design (Link)
        </Link>
        <Link href="https://ant.design" target="_blank">
          Ant Design (Link)
        </Link>
      </Space>
    </Space>
  );
};
