import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, HeartFilled } from '@ant-design/icons';
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #eef2f6 0%, #e0e7ff 50%, #f8fafc 100%)',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: 920,
          minHeight: 540,
          backgroundColor: '#ffffff',
          borderRadius: 24,
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Left Side: Visual Brand Hero Panel */}
        <div
          style={{
            flex: 1,
            background: 'linear-gradient(145deg, #1677ff 0%, #0958d9 60%, #003eb3 100%)',
            padding: '48px 40px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HeartFilled style={{ fontSize: 20, color: '#ffffff' }} />
              </div>
              <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
                PetPulse
              </span>
            </div>

            <h2
              style={{
                color: '#ffffff',
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1.3,
                marginBottom: 16,
              }}
            >
              Intelligent Care for Every Companion.
            </h2>
            <p
              style={{
                color: '#bae0ff',
                fontSize: 15,
                lineHeight: 1.6,
                maxWidth: 320,
              }}
            >
              Real-time shelter capacity tracking, verified medical histories, and streamlined pet adoption.
            </p>
          </div>

          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: 14,
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div style={{ fontSize: 13, color: '#e6f4ff', fontWeight: 600 }}>
              🛡️ Role-Based Access Control
            </div>
            <div style={{ fontSize: 12, color: '#bae0ff', marginTop: 4 }}>
              Protected administrative endpoints with Spring Security JWT tokens.
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div
          style={{
            flex: 1.15,
            padding: '48px 44px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ marginBottom: 32, textAlign: 'left' }}>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.5px',
              }}
            >
              Welcome Back
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 14, color: '#64748b' }}>
              Login to your PetPulse account
            </p>
          </div>

          <Form
            name="login_form"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please enter your username' }]}
              style={{ marginBottom: 20 }}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#94a3b8', marginRight: 4 }} />}
                placeholder="Username"
                style={{
                  borderRadius: 10,
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderColor: '#e2e8f0',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
              style={{ marginBottom: 28 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: 4 }} />}
                placeholder="Password"
                style={{
                  borderRadius: 10,
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderColor: '#e2e8f0',
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 18 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 46,
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(22, 119, 255, 0.3)',
                }}
              >
                Log in
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <span style={{ color: '#64748b', fontSize: 14 }}>
                Don't have an account?{' '}
              </span>
              <Link
                to="/register"
                style={{
                  color: '#1677ff',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Register now!
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;