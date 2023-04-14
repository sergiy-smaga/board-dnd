import React from 'react';
import { Button, Input, Space, Typography, Form, message } from 'antd';
import { fetchTasks } from '../redux/operations';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getFromLocalStorage } from '../helpers';
import { setPathname, setStorageTasks } from '../redux/columnTasksSlice';
const { Link } = Typography;

const SearchForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const pathname = useAppSelector((state) => state.columnTasks.pathname);
  const isLoading = useAppSelector((state) => state.columnTasks.isLoading);

  const [form] = Form.useForm();

  const onFinish = (values: { url: string }) => {
    const path = values.url ? new URL(values.url).pathname : '';

    const storageTasks = getFromLocalStorage(path);
    if (Object.keys(storageTasks).length > 0) {
      dispatch(setStorageTasks(storageTasks));
    } else {
      dispatch(fetchTasks(path));
    }

    dispatch(setPathname(path));
    message.success('Submit success!');
    form.resetFields();
  };

  return (
    <Space direction="vertical" style={{ marginBottom: '30px' }}>
      <Form form={form} layout="inline" onFinish={onFinish} autoComplete="off">
        <Form.Item
          name="url"
          rules={[{ required: true }, { type: 'url' }, { type: 'string' }]}
        >
          <Input style={{ width: '500px' }} placeholder="Enter repo URL" />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              disabled={
                !form.isFieldsTouched(true) ||
                !(
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length === 0
                )
              }
            >
              Load issues
            </Button>
          )}
        </Form.Item>
      </Form>
      <Space direction="horizontal">
        <Link
          href={`https://github.com/${pathname.split('/')[1]}`}
          target="_blank"
        >
          {pathname.split('/')[1]}
        </Link>
        <Link href={`https://github.com${pathname}`} target="_blank">
          {pathname.split('/')[2]}
        </Link>
      </Space>
    </Space>
  );
};

export default React.memo(SearchForm);
