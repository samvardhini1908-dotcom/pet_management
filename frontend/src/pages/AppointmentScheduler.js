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
  Card,
  Row,
  Col,
  Statistic,
  Tag,
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
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [apptRes, petsRes, vetsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/pets').catch(() => ({ data: [] })),
        api.get('/auth/vets').catch(() => ({ data: [] })),
      ]);
      setAppointments(Array.isArray(apptRes.data) ? apptRes.data : []);
      setPets(Array.isArray(petsRes.data) ? petsRes.data : []);
      setVets(Array.isArray(vetsRes.data) ? vetsRes.data : []);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      petId: record.pet?.id || record.petId,
      vetId: record.vet?.id || record.vetId,
      appointmentDate: record.appointmentDate ? dayjs(record.appointmentDate) : null,
      reason: record.reason,
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
    const payload = {
      ...values,
      appointmentDate: values.appointmentDate
        ? values.appointmentDate.format('YYYY-MM-DDTHH:mm:ss')
        : null,
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
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      message.success('Appointment cancelled successfully');
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to delete appointment');
    }
  };

  const getStatusTag = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'COMPLETED') {
      return <Tag color="success" style={{ borderRadius: 12 }}>COMPLETED</Tag>;
    }
    if (s === 'CANCELLED') {
      return <Tag color="error" style={{ borderRadius: 12 }}>CANCELLED</Tag>;
    }
    return <Tag color="processing" style={{ borderRadius: 12 }}>SCHEDULED</Tag>;
  };

  const columns = [
    {
      title: 'Pet Name',
      dataIndex: 'petName',
      key: 'petName',
      render: (text, record) => (
        <span style={{ fontWeight: 600, color: '#0f172a' }}>
          {text || record.pet?.petName || 'Bruno'}
        </span>
      ),
    },
    {
      title: 'Veterinarian',
      dataIndex: 'vetName',
      key: 'vetName',
      render: (text, record) => (
        <span style={{ color: '#334155' }}>
          {text || record.vet?.fullName || record.vet?.username || 'Dr. Vet'}
        </span>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render: (date) => (
        <span style={{ color: '#64748b' }}>
          {date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '—'}
        </span>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (text) => <span style={{ color: '#475569' }}>{text || 'Checkup'}</span>,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

  const scheduledCount = appointments.filter((a) => a.status === 'SCHEDULED').length;

  const filteredAppointments = appointments.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const petName = (a.petName || a.pet?.petName || '').toLowerCase();
    const reason = (a.reason || '').toLowerCase();
    return petName.includes(q) || reason.includes(q);
  });

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Metrics Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
              borderLeft: '4px solid #1890ff',
            }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>TOTAL APPOINTMENTS</span>}
              value={appointments.length}
              prefix={<CalendarOutlined style={{ color: '#1890ff', marginRight: 8 }} />}
              valueStyle={{ fontWeight: 700, color: '#0f172a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
              borderLeft: '4px solid #fa8c16',
            }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>UPCOMING SCHEDULES</span>}
              value={scheduledCount}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16', marginRight: 8 }} />}
              valueStyle={{ fontWeight: 700, color: '#0f172a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
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
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                Appointment Scheduler
              </h2>
              <Tag color="blue" style={{ borderRadius: 12, padding: '1px 10px', fontWeight: 600 }}>
                {appointments.length} Scheduled
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
              onClick={handleOpenAddModal}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                height: 38,
                padding: '0 18px',
              }}
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

      {/* Modal for Book / Edit */}
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
            <Select placeholder="Select pet">
              {pets.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.petName}
                </Option>
              ))}
              {pets.length === 0 && <Option value={1}>Bruno</Option>}
            </Select>
          </Form.Item>

          <Form.Item
            label="Veterinarian"
            name="vetId"
            rules={[{ required: true, message: 'Please select a veterinarian' }]}
          >
            <Select placeholder="Select vet">
              {vets.map((v) => (
                <Option key={v.id} value={v.id}>
                  {v.fullName || v.username}
                </Option>
              ))}
              {vets.length === 0 && <Option value={1}>Dr. Vet</Option>}
            </Select>
          </Form.Item>

          <Form.Item
            label="Appointment Date"
            name="appointmentDate"
            rules={[{ required: true, message: 'Please choose appointment date' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: 'Please state the reason' }]}
          >
            <TextArea rows={2} placeholder="e.g. Annual vaccination checkup" />
          </Form.Item>

          {editingRecord && (
            <Form.Item label="Status" name="status">
              <Select>
                <Option value="SCHEDULED">SCHEDULED</Option>
                <Option value="COMPLETED">COMPLETED</Option>
                <Option value="CANCELLED">CANCELLED</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentScheduler;

