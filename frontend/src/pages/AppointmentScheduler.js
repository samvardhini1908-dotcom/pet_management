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
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

const { Option } = Select;
const { TextArea } = Input;

const AppointmentScheduler = () => {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  // 1. Fetch pets to populate dropdown and resolve accurate pet names
  const fetchPets = useCallback(async () => {
    try {
      const res = await api.get('/pets');
      setPets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load pets:', err);
    }
  }, []);

  // 2. Fetch appointment records
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments');
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
    fetchAppointments();
  }, [fetchPets, fetchAppointments]);

  // Helper to reliably extract the pet name
  const resolvePetName = (record) => {
    if (record.pet?.petName) return record.pet.petName;
    if (record.petName && record.petName !== '—') return record.petName;

    const matched = pets.find(
      (p) => String(p.id) === String(record.pet?.id || record.petId)
    );
    if (matched?.petName) return matched.petName;

    return '—';
  };

  const handleOpenCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'SCHEDULED',
      appointmentDate: dayjs().add(1, 'day'),
      veterinarian: 'Dr. Vet',
      petId: pets.length > 0 ? pets[0].id : undefined,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setEditingRecord(record);

    // Resolve the accurate Pet ID matching the selected pet
    const resolvedPetId =
      record.pet?.id ||
      record.petId ||
      pets.find((p) => p.petName === record.petName || p.petName === record.pet?.petName)?.id;

    const rawDate = record.appointmentDate || record.dateTime || record.date;

    form.setFieldsValue({
      petId: resolvedPetId,
      veterinarian: record.veterinarian || record.doctorName || 'Dr. Vet',
      appointmentDate: rawDate ? dayjs(rawDate) : null,
      reason: record.reason || record.notes || '',
      status: record.status || 'SCHEDULED',
    });

    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    // Find the chosen pet object
    const selectedPet = pets.find(
      (p) => String(p.id) === String(values.petId) || p.petName === values.petId
    );

    const targetPetId = selectedPet ? selectedPet.id : values.petId;
    const targetPetName = selectedPet ? selectedPet.petName : '';

    // Convert date to strict ISO format (YYYY-MM-DDTHH:mm:ss) required by Spring Boot LocalDateTime
    const formattedDateTime = values.appointmentDate
      ? dayjs(values.appointmentDate).format('YYYY-MM-DDTHH:mm:ss')
      : null;

    // Construct entity payload satisfying JPA relationships
    const payload = {
      ...(editingRecord || {}),
      pet: selectedPet ? { id: selectedPet.id, petName: selectedPet.petName } : { id: targetPetId },
      petId: targetPetId,
      petName: targetPetName,
      veterinarian: values.veterinarian,
      doctorName: values.veterinarian,
      appointmentDate: formattedDateTime,
      dateTime: formattedDateTime,
      reason: values.reason,
      notes: values.reason,
      status: values.status || 'SCHEDULED',
    };

    try {
      if (editingRecord) {
        await api.put(`/appointments/${editingRecord.id}`, payload);
        message.success('Appointment updated successfully');
      } else {
        await api.post('/appointments', payload);
        message.success('Appointment booked successfully');
      }
      setIsModalOpen(false);
      setEditingRecord(null);
      form.resetFields();
      fetchAppointments();
    } catch (error) {
      console.error('Appointment submit error:', error?.response || error);
      const serverMsg =
        error?.response?.data?.message ||
        (typeof error?.response?.data === 'string' ? error.response.data : null) ||
        'Operation failed';
      message.error(serverMsg);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      message.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const getStatusTag = (status) => {
    const s = (status || 'SCHEDULED').toUpperCase();
    if (s === 'COMPLETED') {
      return (
        <Tag color="success" style={{ borderRadius: 12, fontWeight: 600, padding: '2px 10px' }}>
          COMPLETED
        </Tag>
      );
    }
    if (s === 'CANCELLED') {
      return (
        <Tag color="error" style={{ borderRadius: 12, fontWeight: 600, padding: '2px 10px' }}>
          CANCELLED
        </Tag>
      );
    }
    return (
      <Tag color="processing" style={{ borderRadius: 12, fontWeight: 600, padding: '2px 10px' }}>
        SCHEDULED
      </Tag>
    );
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
      title: 'Veterinarian',
      key: 'veterinarian',
      render: (_, record) => (
        <span style={{ color: '#334155', fontWeight: 500 }}>
          {record.veterinarian || record.doctorName || 'Dr. Vet'}
        </span>
      ),
    },
    {
      title: 'Appointment Date',
      key: 'appointmentDate',
      render: (_, record) => {
        const rawDate = record.appointmentDate || record.dateTime;
        return (
          <span style={{ color: '#64748b' }}>
            {rawDate ? dayjs(rawDate).format('YYYY-MM-DD HH:mm') : '—'}
          </span>
        );
      },
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (text) => (
        <span style={{ color: '#64748b', maxWidth: 220, display: 'inline-block' }}>
          {text || '—'}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
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
            title="Are you sure you want to cancel this appointment?"
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
              Cancel
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const filteredAppointments = appointments.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const petName = resolvePetName(a).toLowerCase();
    const vet = (a.veterinarian || a.doctorName || '').toLowerCase();
    const reason = (a.reason || '').toLowerCase();
    return petName.includes(q) || vet.includes(q) || reason.includes(q);
  });

  const scheduledCount = appointments.filter(
    (a) => (a.status || 'SCHEDULED').toUpperCase() === 'SCHEDULED'
  ).length;

  const completedCount = appointments.filter(
    (a) => (a.status || '').toUpperCase() === 'COMPLETED'
  ).length;

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Metrics Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, borderLeft: '4px solid #1677ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CalendarOutlined style={{ fontSize: 24, color: '#1677ff' }} />
              <div>
                <div style={{ fontSize: 13, color: '#64748b' }}>TOTAL APPOINTMENTS</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{appointments.length}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, borderLeft: '4px solid #fa8c16' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ClockCircleOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              <div>
                <div style={{ fontSize: 13, color: '#64748b' }}>SCHEDULED</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{scheduledCount}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, borderLeft: '4px solid #52c41a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div>
                <div style={{ fontSize: 13, color: '#64748b' }}>COMPLETED</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{completedCount}</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
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
                Appointment Scheduler
              </h2>
              <Tag color="blue" style={{ borderRadius: 12, padding: '1px 10px', fontWeight: 600 }}>
                {appointments.length} Total
              </Tag>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Book clinic visits, consults, and recurring checkups
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Input.Search
              placeholder="Search pet or reason..."
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
              Book Appointment
            </Button>
          </div>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredAppointments}
          loading={loading}
          pagination={{
            pageSize: 8,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} appointments`,
          }}
        />
      </Card>

      {/* Edit / Book Modal */}
      <Modal
        title={editingRecord ? 'Edit Appointment' : 'Book Appointment'}
        open={Boolean(isModalOpen)}
        visible={Boolean(isModalOpen)}
        onCancel={handleCancelModal}
        onOk={() => form.submit()}
        okText={editingRecord ? 'Update' : 'Book'}
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
            label="Veterinarian"
            name="veterinarian"
            rules={[{ required: true, message: 'Please enter veterinarian' }]}
          >
            <Select placeholder="Select veterinarian">
              <Option value="Dr. Vet">Dr. Vet</Option>
              <Option value="Dr. Sarah Johnson">Dr. Sarah Johnson</Option>
              <Option value="Dr. Michael Lee">Dr. Michael Lee</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Appointment Date & Time"
            name="appointmentDate"
            rules={[{ required: true, message: 'Please select appointment date and time' }]}
          >
            <DatePicker
              showTime
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: 'Please provide a reason' }]}
          >
            <TextArea rows={3} placeholder="Routine checkup, vaccinations, symptoms..." />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select placeholder="Select status">
              <Option value="SCHEDULED">SCHEDULED</Option>
              <Option value="COMPLETED">COMPLETED</Option>
              <Option value="CANCELLED">CANCELLED</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentScheduler;