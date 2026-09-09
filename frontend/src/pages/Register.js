import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, message } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authService.register(values);
      message.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      message.error(
        error?.response?.data?.message || 'Registration failed. Please try again.'
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
        padding: '32px 20px',
        boxSizing: 'border-box',
      }}
    >
      <Card
        bordered={false}
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 16,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
          border: '1px solid #e2e8f0',
        }}
        bodyStyle={{ padding: '36px 32px' }}
      >
        {/* Brand Paw Badge & Headings */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
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
              marginBottom: 14,
            }}
          >
            {/* Paw Icon */}
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
            Create Account
          </h1>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: 14,
              color: '#64748b',
              fontWeight: 400,
            }}
          >
            Join the PetPulse community
          </p>
        </div>

        {/* Registration Form */}
        <Form
          name="register_form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Please enter your full name' }]}
            style={{ marginBottom: 14 }}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#94a3b8', marginRight: 6 }} />}
              placeholder="Full Name"
              style={{
                height: 42,
                borderRadius: 8,
                borderColor: '#cbd5e1',
                fontSize: 14,
              }}
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter a username' }]}
            style={{ marginBottom: 14 }}
          >
            <Input
              prefix={<IdcardOutlined style={{ color: '#94a3b8', marginRight: 6 }} />}
              placeholder="Username"
              style={{
                height: 42,
                borderRadius: 8,
                borderColor: '#cbd5e1',
                fontSize: 14,
              }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
            style={{ marginBottom: 14 }}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#94a3b8', marginRight: 6 }} />}
              placeholder="Email"
              style={{
                height: 42,
                borderRadius: 8,
                borderColor: '#cbd5e1',
                fontSize: 14,
              }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
            style={{ marginBottom: 14 }}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: '#94a3b8', marginRight: 6 }} />}
              placeholder="Phone Number"
              style={{
                height: 42,
                borderRadius: 8,
                borderColor: '#cbd5e1',
                fontSize: 14,
              }}
            />
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
            style={{ marginBottom: 14 }}
          >
            <Select
              placeholder="Select a role"
              style={{
                height: 42,
                borderRadius: 8,
              }}
            >
              <Option value="ROLE_OWNER">Pet Owner</Option>
              <Option value="ROLE_VET">Veterinarian</Option>
              <Option value="ROLE_ADMIN">System Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter a password' }]}
            style={{ marginBottom: 22 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: 6 }} />}
              placeholder="Password"
              style={{
                height: 42,
                borderRadius: 8,
                borderColor: '#cbd5e1',
                fontSize: 14,
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
                height: 44,
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                backgroundColor: '#1677ff',
                borderColor: '#1677ff',
                boxShadow: '0 2px 4px rgba(22, 119, 255, 0.2)',
              }}
            >
              Register
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#64748b', fontSize: 13 }}>
              Already have an account?{' '}
            </span>
            <Link
              to="/login"
              style={{
                color: '#1677ff',
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              Login here
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;