import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
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
        backgroundColor: '#090d16',
        backgroundImage: `
          radial-gradient(at 15% 15%, rgba(24, 144, 255, 0.18) 0px, transparent 55%),
          radial-gradient(at 85% 85%, rgba(114, 46, 209, 0.15) 0px, transparent 55%)
        `,
        padding: '24px',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
          padding: '40px 36px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Brand Icon */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)',
              boxShadow: '0 8px 20px rgba(24, 144, 255, 0.35)',
              marginBottom: 18,
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 700,
              color: '#f8fafc',
              letterSpacing: '-0.5px',
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 14,
              color: '#94a3b8',
              fontWeight: 400,
            }}
          >
            Login to your PetPulse account
          </p>
        </div>

        {/* Form Controls */}
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
              prefix={<UserOutlined style={{ color: '#64748b', marginRight: 6 }} />}
              placeholder="Username"
              style={{
                height: 48,
                borderRadius: 10,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderColor: '#334155',
                color: '#f8fafc',
                fontSize: 14,
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
            style={{ marginBottom: 26 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#64748b', marginRight: 6 }} />}
              placeholder="Password"
              style={{
                height: 48,
                borderRadius: 10,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                borderColor: '#334155',
                color: '#f8fafc',
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
                height: 48,
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                border: 'none',
                boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)',
                cursor: 'pointer',
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
                color: '#38bdf8',
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              Register now!
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;