import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  Tag,
  Avatar,
  Space,
  message
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import api from '../services/api'; // adjust path to your axios/api instance

const { Option } = Select;

const PetManagement = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [form] = Form.useForm();

  const user = useSelector((state) => state.auth?.user);

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/pets');
      setPets(response.data || []);
    } catch (error) {
      // 500 error handling: display exact message, render empty table without crashing
      message.error('Failed to fetch pets');
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleOpenAddModal = () => {
    setEditingPet(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setEditingPet(record);
    form.setFieldsValue({
      ...record,
      availableForAdoption: record.availableForAdoption !== undefined ? record.availableForAdoption : true,
    });
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingPet(null);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/pets/${id}`);
      message.success('Pet deleted successfully');
      fetchPets();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to delete pet');
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingPet) {
        await api.put(`/pets/${editingPet.id}`, values);
        message.success('Pet updated successfully');
      } else {
        await api.post('/pets', values);
        message.success('Pet created successfully');
      }
      setIsModalOpen(false);
      setEditingPet(null);
      form.resetFields();
      fetchPets();
    } catch (error) {
      if (error?.response?.status === 409) {
        const errorMsg = error?.response?.data?.message || 'conflict: A pet with this title already exists';
        message.error(errorMsg);
      } else {
        message.error(error?.response?.data?.message || 'Failed to save pet');
      }
    }
  };

  const columns = [
    {
      title: 'Photo',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => <Avatar src={imageUrl} alt="pet avatar" />,
    },
    {
      title: 'Name',
      dataIndex: 'petName',
      key: 'petName',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Species',
      dataIndex: 'species',
      key: 'species',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Breed',
      dataIndex: 'breed',
      key: 'breed',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Status',
      dataIndex: 'availableForAdoption',
      key: 'status',
      render: (available) => (
        <Tag color={available ? 'green' : 'volcano'}>
          {available ? 'Available' : 'Adopted'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this pet?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        {user?.role === 'ROLE_ADMIN' && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAddModal}>
            Create New Pet
          </Button>
        )}
        <Button icon={<ReloadOutlined />} onClick={fetchPets}>
          Refresh
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={pets}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingPet ? 'Edit Pet' : 'Add New Pet'}
        open={isModalOpen}
        okText={editingPet ? 'Update' : 'Add'}
        onOk={() => form.submit()}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Pet Name"
            name="petName"
            rules={[{ required: true, message: 'Please enter pet name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Species"
            name="species"
            rules={[{ required: true, message: 'Please select species' }]}
          >
            <Select placeholder="Select species">
              <Option value="Dog">Dog</Option>
              <Option value="Cat">Cat</Option>
              <Option value="Bird">Bird</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Breed" name="breed">
            <Input />
          </Form.Item>

          <Form.Item label="Age" name="age">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Gender" name="gender">
            <Select placeholder="Select gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Image URL" name="imageUrl">
            <Input />
          </Form.Item>

          <Form.Item label="Adoption Status" name="availableForAdoption">
            <Select>
              <Option value={true}>Available for Adoption</Option>
              <Option value={false}>Not Available</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PetManagement;