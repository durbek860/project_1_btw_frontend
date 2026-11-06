import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { useEmployeeLoginMutation } from '../../context/employee';

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useEmployeeLoginMutation();

  const onFinish = async (values) => {
    console.log(values);

    try {
      const response = await login(values).unwrap();

      console.log('Success:', response);
      message.success('successfully logged in');

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      message.error(err?.data?.message || err?.message || 'An error occurred during login');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" bordered={false}>
        <div className="auth-header">
          <h2>Login Page</h2>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Please input your username!' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="••••••••"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="auth-button"
              loading={isLoading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;