import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col,
  Alert,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

const { Option } = Select;

const VaccinationTracker = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  // 1. Fetch pets
  const fetchPets = useCallback(async () => {
    try {
      const res = await api.get('/pets');
      setPets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load pets:', err);
    }
  }, []);

  // 2. Fetch vaccination records
  const fetchVaccinations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/vaccinations');
      setVaccinations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to fetch vaccinations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
    fetchVaccinations();
  }, [fetchPets, fetchVaccinations]);

  const handleOpenCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'PENDING',
      vaccinationDate: dayjs(),
      nextDueDate: dayjs().add(1, 'year'),
      petId: pets.length > 0 ? pets[0].id : undefined,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setEditingRecord(record);

    // Resolve the actual pet ID from the record
    const petId =
      record.pet?.id ||
      record.petId ||
      pets.find((p) => p.petName === record.petName)?.id;

    form.setFieldsValue({
      petId: petId,
      vaccineName: record.vaccineName,
      vaccinationDate: record.vaccinationDate ? dayjs(record.vaccinationDate) : null,
      nextDueDate: record.nextDueDate ? dayjs(record.nextDueDate) : null,
      status: record.status || 'PENDING',
    });
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    // Look up selected pet from our loaded pets list
    const selectedPet = pets.find(
      (p) => String(p.id) === String(values.petId) || p.petName === values.petId
    );

    const targetPetId = selectedPet ? selectedPet.id : values.petId;
    const targetPetName = selectedPet ? selectedPet.petName : '';

    const vDate = values.vaccinationDate
      ? dayjs(values.vaccinationDate).format('YYYY-MM-DD')
      : null;
    const nDate = values.nextDueDate
      ? dayjs(values.nextDueDate).format('YYYY-MM-DD')
      : null;

    // Send payload matching both Spring Boot JPA @ManyToOne and Flat fields
    const payload = {
      ...(editingRecord || {}),
      // Nested JPA entity (Standard Spring Boot requirement)
      pet: selectedPet ? { id: selectedPet.id, petName: selectedPet.petName } : { id: targetPetId },
      // Direct fields
      petId: targetPetId,
      petName: targetPetName,
      vaccineName: values.vaccineName,
      vaccinationDate: vDate,
      nextDueDate: nDate,
      status: values.status || 'PENDING',
    };

    try {
      if (editingRecord) {
        await api.put(`/vaccinations/${editingRecord.id}`, payload);
        message.success('Vaccination updated successfully');
      } else {
        await api.post('/vaccinations', payload);
        message.success('Vaccination added successfully');
      }
      setIsModalOpen(false);
      setEditingRecord(null);
      form.resetFields();
      fetchVaccinations();
    } catch (error) {
      console.error('Vaccination save error:', error?.response || error);
      message.error(error?.response?.data?.message || 'Failed to save vaccination');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/vaccinations/${id}`);
      message.success('Vaccination deleted successfully');
      fetchVaccinations();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to delete vaccination');
    }
  };

  // Helper to reliably extract the pet name
  const resolvePetName = (record) => {
    if (record.pet?.petName) return record.pet.petName;
    if (record.petName && record.petName !== '—') return record.petName;
    
    // Cross-reference with loaded pets state
    const matched = pets.find(
      (p) => String(p.id) === String(record.pet?.id || record.petId)
    );
    if (matched?.petName) return matched.petName;

    return '—';
  };

  const columns = [
    {
      title: 'Pet Name',
      key: 'petName',
      render: (_, record) => (
        <span style={{ fontWeight: 600, color: '#0f172a' }}>
          {resolvePetName(record)}
        </span>
      ),
    },
    {
      title: 'Vaccine Name',
      dataIndex: 'vaccineName',
      key: 'vaccineName',
      render: (text) => <span style={{ color: '#334155', fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Vaccination Date',
      dataIndex: 'vaccinationDate',
      key: 'vaccinationDate',
      render: (date) => (
        <span style={{ color: '#64748b' }}>
          {date ? dayjs(date).format('YYYY-MM-DD') : '—'}
        </span>
      ),
    },
    {
      title: 'Next Due Date',
      dataIndex: 'nextDueDate',
      key: 'nextDueDate',
      render: (date) => (
        <span style={{ color: '#64748b' }}>
          {date ? dayjs(date).format('YYYY-MM-DD') : '—'}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const s = (status || 'PENDING').toUpperCase();
        return s === 'COMPLETED' ? (
          <Tag color="success" style={{ borderRadius: 12, fontWeight: 600, padding: '2px 10px' }}>
            COMPLETED
          </Tag>
        ) : (
          <Tag color="warning" style={{ borderRadius: 12, fontWeight: 600, padding: '2px 10px' }}>
            PENDING
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
            style={{ fontWeight: 500, padding: '4px 8px' }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this vaccination?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              style={{ fontWeight: 500, padding: '4px 8px' }}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const filteredVaccinations = vaccinations.filter((v) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const petName = resolvePetName(v).toLowerCase();
    const vaccineName = (v.vaccineName || '').toLowerCase();
    return petName.includes(q) || vaccineName.includes(q);
  });

  const upcomingReminders = vaccinations.filter((v) => {
    if (!v.nextDueDate) return false;
    const due = dayjs(v.nextDueDate);
    const now = dayjs();
    const diffDays = due.diff(now, 'day');
    return diffDays >= 0 && diffDays <= 14;
  });

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Reminders Alert */}
      {upcomingReminders.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {upcomingReminders.slice(0, 2).map((item, idx) => (
            <Alert
              key={idx}
              message={`Reminder: ${item.vaccineName} due on ${dayjs(item.nextDueDate).format('YYYY-MM-DD')}`}
              type="warning"
              showIcon
              style={{ marginBottom: 8, borderRadius: 8 }}
            />
          ))}
        </div>
      )}

      {/* Metric Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, borderLeft: '4px solid #1677ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <MedicineBoxOutlined style={{ fontSize: 24, color: '#1677ff' }} />
              <div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Total Vaccinations</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{vaccinations.length}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, borderLeft: '4px solid #fa8c16' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ClockCircleOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              <div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Pending / Due</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                  {vaccinations.filter((v) => (v.status || 'PENDING').toUpperCase() === 'PENDING').length}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, borderLeft: '4px solid #52c41a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div>
                <div style={{ fontSize: 13, color: '#64748b' }}>Completed</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                  {vaccinations.filter((v) => (v.status || '').toUpperCase() === 'COMPLETED').length}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Schedules Table */}
      <Card
        bordered={false}
        style={{ borderRadius: 14, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}
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
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                Vaccination Schedules
              </h2>
              <Tag color="blue" style={{ borderRadius: 12, padding: '1px 10px', fontWeight: 600 }}>
                {vaccinations.length} Recorded
              </Tag>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Track immunizations, booster dates, and pending medical alerts
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Input.Search
              placeholder="Search pet or vaccine..."
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 240 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreateModal}
              style={{ borderRadius: 8, fontWeight: 600, height: 38 }}
            >
              Add Vaccination
            </Button>
          </div>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredVaccinations}
          loading={loading}
          pagination={{
            pageSize: 8,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
          }}
        />
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        title={editingRecord ? 'Edit Vaccination' : 'Add Vaccination'}
        open={Boolean(isModalOpen)}
        visible={Boolean(isModalOpen)}
        onCancel={handleCancelModal}
        onOk={() => form.submit()}
        okText={editingRecord ? 'Update' : 'Add'}
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
            label="Pet"
            name="petId"
            rules={[{ required: true, message: 'Please select a pet' }]}
          >
            <Select placeholder="Select a pet">
              {pets.map((pet) => (
                <Option key={pet.id} value={pet.id}>
                  {pet.petName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Vaccine Name"
            name="vaccineName"
            rules={[{ required: true, message: 'Please enter vaccine name' }]}
          >
            <Input placeholder="e.g. Rabies, DHPP, Bordetella" />
          </Form.Item>

          <Form.Item
            label="Vaccination Date"
            name="vaccinationDate"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="Next Due Date"
            name="nextDueDate"
            rules={[{ required: true, message: 'Please select next due date' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="PENDING">PENDING</Option>
              <Option value="COMPLETED">COMPLETED</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VaccinationTracker;