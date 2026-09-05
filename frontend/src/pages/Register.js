import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Typography } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService'; // adjust path if needed

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authService.register(values);
      message.success('Registration successfull Please login.');
      navigate('/login');
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Registration failed';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container" style={{ maxWidth: 450, margin: '40px auto', padding: 24 }}>
      <Title level={2}>Create Account</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Join the PetPulse community
      </Text>

      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input placeholder="Full Name" />
        </Form.Item>

        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please enter your username' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input type="email" placeholder="Email" />
        </Form.Item>

        <Form.Item name="phone">
          <Input placeholder="Phone Number" />
        </Form.Item>

        <Form.Item
          name="role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select a role">
            <Option value="ROLE_OWNER">Pet Owner</Option>
            <Option value="ROLE_VET">Veterinarian</Option>
            <Option value="ROLE_SHELTER">Shelter Manager</Option>
            <Option value="ROLE_ADMIN">Administrator</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Register
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Link to="/login">Login here</Link>
        </div>
      </Form>
    </div>
  );
};

export default Register;