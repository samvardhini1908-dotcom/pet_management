import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
  message,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data || []);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenEditModal = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      role: record.role,
    });
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingUser) {
        await api.put(`/auth/users/${editingUser.id}`, values);
        message.success('User updated successfully');
      }
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/auth/users/${id}`);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleTag = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return (
          <Tag
            icon={<SafetyCertificateOutlined />}
            style={{
              borderRadius: 20,
              padding: '2px 12px',
              fontWeight: 600,
              color: '#c41d7f',
              backgroundColor: '#fff0f6',
              border: '1px solid #ffadd2',
            }}
          >
            ROLE_ADMIN
          </Tag>
        );
      case 'ROLE_VET':
        return (
          <Tag
            icon={<MedicineBoxOutlined />}
            style={{
              borderRadius: 20,
              padding: '2px 12px',
              fontWeight: 600,
              color: '#0958d9',
              backgroundColor: '#e6f4ff',
              border: '1px solid #91caff',
            }}
          >
            ROLE_VET
          </Tag>
        );
      case 'ROLE_OWNER':
      default:
        return (
          <Tag
            icon={<UserOutlined />}
            style={{
              borderRadius: 20,
              padding: '2px 12px',
              fontWeight: 600,
              color: '#389e0d',
              backgroundColor: '#f6ffed',
              border: '1px solid #b7eb8f',
            }}
          >
            {role || 'ROLE_OWNER'}
          </Tag>
        );
    }
  };

  const getAvatarColor = (role) => {
    if (role === 'ROLE_ADMIN') return '#eb2f96';
    if (role === 'ROLE_VET') return '#1677ff';
    return '#52c41a';
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            style={{
              backgroundColor: getAvatarColor(record.role),
              verticalAlign: 'middle',
              fontWeight: 600,
            }}
          >
            {text ? text.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => <span style={{ color: '#334155' }}>{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <span style={{ color: '#64748b' }}>{text}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => getRoleTag(role),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => <span style={{ color: '#64748b' }}>{text || '—'}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
            style={{
              color: '#1677ff',
              fontWeight: 500,
              padding: '4px 8px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              style={{
                fontWeight: 500,
                padding: '4px 8px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Overview metric tallies
  const adminCount = users.filter((u) => u.role === 'ROLE_ADMIN').length;
  const vetCount = users.filter((u) => u.role === 'ROLE_VET').length;
  const ownerCount = users.filter((u) => u.role === 'ROLE_OWNER').length;

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Top Metric Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
              borderLeft: '4px solid #1677ff',
            }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>TOTAL USERS</span>}
              value={users.length}
              prefix={<TeamOutlined style={{ color: '#1677ff', marginRight: 8 }} />}
              valueStyle={{ fontWeight: 700, color: '#0f172a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
              borderLeft: '4px solid #52c41a',
            }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>PET OWNERS</span>}
              value={ownerCount}
              prefix={<UserOutlined style={{ color: '#52c41a', marginRight: 8 }} />}
              valueStyle={{ fontWeight: 700, color: '#0f172a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
              borderLeft: '4px solid #0958d9',
            }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>VETERINARIANS</span>}
              value={vetCount}
              prefix={<MedicineBoxOutlined style={{ color: '#0958d9', marginRight: 8 }} />}
              valueStyle={{ fontWeight: 700, color: '#0f172a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Container */}
      <Card
        bordered={false}
        style={{
          borderRadius: 14,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
            System Users
          </h2>
          <span style={{ fontSize: 13, color: '#64748b' }}>
            Manage platform accounts, role assignments, and member details.
          </span>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={{
            pageSize: 8,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
          }}
        />
      </Card>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isModalOpen}
        visible={isModalOpen}
        onCancel={handleCancelModal}
        onOk={() => form.submit()}
        okText="Update"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          autoComplete="off"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select role">
              <Option value="ROLE_OWNER">Pet Owner</Option>
              <Option value="ROLE_VET">Veterinarian</Option>
              <Option value="ROLE_ADMIN">System Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;