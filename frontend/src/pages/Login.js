import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import authService from '../services/authService';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authService.login(values.username, values.password);

      const token =
        response?.token ||
        response?.accessToken ||
        response?.data?.token ||
        response?.data?.accessToken;

      const userData = response?.data || response;

      if (token) {
        localStorage.setItem('token', token);
      }
      localStorage.setItem('user', JSON.stringify(userData));

      if (loginSuccess) {
        dispatch(loginSuccess(userData));
      }

      message.success('Login successful!');
      navigate('/');
    } catch (error) {
      message.error(
        error?.response?.data?.message || 'Invalid username or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <Card
        bordered={false}
        style={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 16,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
          border: '1px solid #e2e8f0',
        }}
        bodyStyle={{ padding: '40px 36px' }}
      >
        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: '#e6f4ff',
              color: '#1677ff',
              marginBottom: 16,
            }}
          >
            {/* Paw Print Icon */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <ellipse cx="8.5" cy="4.5" rx="1.8" ry="2.5" />
              <ellipse cx="15.5" cy="4.5" rx="1.8" ry="2.5" />
              <ellipse cx="4.5" cy="9.5" rx="1.8" ry="2.5" />
              <ellipse cx="19.5" cy="9.5" rx="1.8" ry="2.5" />
              <path d="M12 9.5c-3.2 0-5.5 2.5-5.5 5.5 0 2.2 1.8 4 4 4 .5 0 1-.1 1.5-.4.5.3 1 .4 1.5.4 2.2 0 4-1.8 4-4 0-3-2.3-5.5-5.5-5.5z" />
            </svg>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.5px',
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: 14,
              color: '#64748b',
              fontWeight: 400,
            }}
          >
            Login to your PetPulse account
          </p>
        </div>

        {/* Login Form */}
        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
            style={{ marginBottom: 18 }}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#94a3b8', marginRight: 6 }} />}
              placeholder="Username"
              style={{
                height: 44,
                borderRadius: 8,
                borderColor: '#cbd5e1',
                fontSize: 14,
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
            style={{ marginBottom: 24 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: 6 }} />}
              placeholder="Password"
              style={{
                height: 44,
                borderRadius: 8,
                borderColor: '#cbd5e1',
                fontSize: 14,
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 20 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 44,
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                backgroundColor: '#1677ff',
                borderColor: '#1677ff',
                boxShadow: '0 2px 4px rgba(22, 119, 255, 0.2)',
              }}
            >
              Log in
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#64748b', fontSize: 13 }}>
              Don't have an account?{' '}
            </span>
            <Link
              to="/register"
              style={{
                color: '#1677ff',
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              Register now!
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;