import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import api from '../services/api';

const { Option } = Select;

const PetManagement = ({ isAdmin: propIsAdmin }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [petNameValue, setPetNameValue] = useState('');
  const [speciesValue, setSpeciesValue] = useState('Dog');
  const [form] = Form.useForm();

  const user = useSelector((state) => state.auth?.user);
  
  // Renders if prop is true, or if prop is undefined and user is admin or default
  const showCreateButton =
    propIsAdmin !== undefined
      ? propIsAdmin
      : user ? user.role === 'ROLE_ADMIN' || user.role === 'ADMIN' : true;

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/pets');
      setPets(response.data || []);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to fetch pets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleOpenCreateModal = () => {
    setEditingPet(null);
    setPetNameValue('');
    setSpeciesValue('Dog');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setEditingPet(record);
    setPetNameValue(record.petName || '');
    setSpeciesValue(record.species || 'Dog');
    form.setFieldsValue({
      petName: record.petName,
      species: record.species,
      breed: record.breed,
      age: record.age,
      gender: record.gender,
    });
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setEditingPet(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    const payload = {
      ...values,
      petName: petNameValue || values.petName,
      species: speciesValue || values.species,
    };

    try {
      if (editingPet) {
        const res = await api.put(`/pets/${editingPet.id}`, payload);
        message.success(res?.data || 'Pet updated successfully.');
      } else {
        const res = await api.post('/pets', payload);
        message.success(res?.data || 'Pet created successfully.');
      }
      setIsModalOpen(false);
      setEditingPet(null);
      form.resetFields();
      fetchPets();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/pets/${id}`);
      message.success(res?.data || 'Pet deleted successfully.');
      fetchPets();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to delete pet');
    }
  };

  const columns = [
    {
      title: 'Pet Name',
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this pet?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {showCreateButton && (
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenCreateModal}
          >
            Create New Pet
          </Button>
        </div>
      )}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={pets}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingPet ? 'Edit Pet' : 'Create New Pet'}
        open={isModalOpen}
        visible={isModalOpen}
        onCancel={handleCancelModal}
        onOk={() => form.submit()}
        okText={editingPet ? 'Update' : 'Add'}
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
            <Input
              placeholder="Enter pet name"
              value={petNameValue}
              onChange={(e) => setPetNameValue(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Species"
            name="species"
            rules={[{ required: true, message: 'Please select species' }]}
          >
            <Select
              placeholder="Select species"
              value={speciesValue}
              onChange={(val) => setSpeciesValue(val)}
            >
              <Option value="Dog">Dog</Option>
              <Option value="Cat">Cat</Option>
              <Option value="Bird">Bird</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PetManagement;