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
  Avatar,
  message,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  const user = useSelector((state) => state.auth?.user);

  const showCreateButton =
    propIsAdmin !== undefined
      ? propIsAdmin
      : user
      ? user.role === 'ROLE_ADMIN' || user.role === 'ADMIN'
      : true;

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/pets');
      setPets(Array.isArray(response.data) ? response.data : []);
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
    form.setFieldsValue({
      species: 'Dog',
      age: 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setEditingPet(record);
    const pName = record.petName || '';
    const pSpecies = record.species || 'Dog';
    setPetNameValue(pName);
    setSpeciesValue(pSpecies);

    form.setFieldsValue({
      petName: pName,
      species: pSpecies,
      breed: record.breed || '',
      age: record.age !== undefined && record.age !== null ? record.age : 0,
      gender: record.gender || '',
      imageUrl: record.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setEditingPet(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    // 1. Resolve petName and species
    const finalPetName = values.petName || petNameValue || '';
    const finalSpecies = values.species || speciesValue || 'Dog';

    // 2. Resolve age: Backend requires @NotNull int age
    const rawAge = values.age;
    const finalAge =
      rawAge !== undefined && rawAge !== '' && rawAge !== null
        ? Number(rawAge)
        : editingPet?.age !== undefined
        ? editingPet.age
        : 0;

    // 3. Build payload strictly adhering to Pet.java model
    const payload = {
      ...(editingPet || {}),
      petName: finalPetName.trim(),
      species: finalSpecies,
      breed: values.breed ? values.breed.trim() : (editingPet?.breed || ''),
      age: finalAge,
      gender: values.gender || editingPet?.gender || 'Unknown',
      imageUrl: values.imageUrl ? values.imageUrl.trim() : (editingPet?.imageUrl || ''),
      availableForAdoption: editingPet ? editingPet.availableForAdoption : true,
    };

    // Keep relations if present
    if (editingPet?.shelter) payload.shelter = editingPet.shelter;
    if (editingPet?.owner) payload.owner = editingPet.owner;

    try {
      if (editingPet) {
        const res = await api.put(`/pets/${editingPet.id}`, payload);
        message.success(
          typeof res?.data === 'string' ? res.data : 'Pet updated successfully.'
        );
      } else {
        const res = await api.post('/pets', payload);
        message.success(
          typeof res?.data === 'string' ? res.data : 'Pet created successfully.'
        );
      }
      setIsModalOpen(false);
      setEditingPet(null);
      form.resetFields();
      fetchPets();
    } catch (error) {
      console.error('Pet Save Error:', error?.response || error);
      const serverMsg =
        error?.response?.data?.message ||
        (typeof error?.response?.data === 'string' ? error.response.data : null) ||
        'Operation failed';
      message.error(serverMsg);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/pets/${id}`);
      message.success(
        typeof res?.data === 'string' ? res.data : 'Pet deleted successfully.'
      );
      fetchPets();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to delete pet');
    }
  };

  const getSpeciesTag = (species) => {
    const s = (species || '').toLowerCase();
    let color = 'blue';
    if (s.includes('cat')) color = 'purple';
    if (s.includes('bird')) color = 'cyan';
    if (s.includes('rabbit')) color = 'orange';

    return (
      <Tag
        color={color}
        style={{
          borderRadius: 16,
          padding: '2px 12px',
          fontWeight: 600,
        }}
      >
        {species}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Pet Name',
      dataIndex: 'petName',
      key: 'petName',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            style={{
              backgroundColor: '#1890ff',
              fontWeight: 600,
            }}
          >
            {text ? text.charAt(0).toUpperCase() : 'P'}
          </Avatar>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>{text}</span>
        </div>
      ),
    },
    {
      title: 'Species',
      dataIndex: 'species',
      key: 'species',
      render: (species) => getSpeciesTag(species),
    },
    {
      title: 'Breed',
      dataIndex: 'breed',
      key: 'breed',
      render: (text) => <span style={{ color: '#475569' }}>{text || '—'}</span>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      render: (age) => (
        <span style={{ color: '#475569', fontWeight: 500 }}>
          {age !== undefined && age !== null ? `${age} yrs` : '—'}
        </span>
      ),
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
              fontWeight: 500,
              padding: '4px 8px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this pet?"
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

  const filteredPets = pets.filter((pet) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (pet.petName && pet.petName.toLowerCase().includes(q)) ||
      (pet.species && pet.species.toLowerCase().includes(q)) ||
      (pet.breed && pet.breed.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 14,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
        bodyStyle={{ padding: '24px 28px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                My Pets Directory
              </h1>
              <Tag color="blue" style={{ borderRadius: 12, padding: '1px 10px', fontWeight: 600 }}>
                {pets.length} Registered
              </Tag>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Track pet records, breed classifications, and health updates
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Input.Search
              placeholder="Search by name, species, breed..."
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 280 }}
            />
            {showCreateButton && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                aria-label="Create New Pet"
                onClick={handleOpenCreateModal}
                style={{
                  borderRadius: 8,
                  fontWeight: 600,
                  height: 38,
                  padding: '0 18px',
                }}
              >
                Add Pet
              </Button>
            )}
          </div>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredPets}
          loading={loading}
          pagination={{
            pageSize: 8,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} pets`,
          }}
        />
      </Card>

      <Modal
        title={editingPet ? 'Edit Pet' : 'Create New Pet'}
        open={Boolean(isModalOpen)}
        visible={Boolean(isModalOpen)}
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
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="Pet Name"
            name="petName"
            rules={[{ required: true, message: 'Please enter pet name' }]}
          >
            <Input
              id="petName"
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
              id="species"
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

          <Form.Item label="Breed" name="breed">
            <Input placeholder="Enter breed" />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: 'Please enter age' }]}
          >
            <Input type="number" min={0} placeholder="Enter age" />
          </Form.Item>

          <Form.Item label="Image URL" name="imageUrl">
            <Input placeholder="https://example.com/pet.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PetManagement;