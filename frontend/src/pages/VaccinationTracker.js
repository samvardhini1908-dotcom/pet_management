import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Alert,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [vaccRes, petsRes] = await Promise.all([
        api.get('/vaccinations'),
        api.get('/pets').catch(() => ({ data: [] })),
      ]);
      setVaccinations(Array.isArray(vaccRes.data) ? vaccRes.data : []);
      setPets(Array.isArray(petsRes.data) ? petsRes.data : []);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to fetch vaccinations');
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
      petId: record.pet ? record.pet.id : record.petId,
      petName: record.petName || (record.pet ? record.pet.petName : ''),
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
    const payload = {
      ...values,
      vaccinationDate: values.vaccinationDate
        ? values.vaccinationDate.format('YYYY-MM-DD')
        : null,
      nextDueDate: values.nextDueDate
        ? values.nextDueDate.format('YYYY-MM-DD')
        : null,
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
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Operation failed');
    }
  };

  const getStatusTag = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'COMPLETED') {
      return (
        <Tag
          icon={<CheckCircleOutlined />}
          style={{
            borderRadius: 16,
            padding: '2px 12px',
            fontWeight: 600,
            color: '#389e0d',
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
          }}
        >
          COMPLETED
        </Tag>
      );
    }
    return (
      <Tag
        icon={<ClockCircleOutlined />}
        style={{
          borderRadius: 16,
          padding: '2px 12px',
          fontWeight: 600,
          color: '#d46b08',
          backgroundColor: '#fff7e6',
          border: '1px solid #ffd591',
        }}
      >
        PENDING
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Pet Name',
      dataIndex: 'petName',
      key: 'petName',
      render: (text, record) => (
        <span style={{ fontWeight: 600, color: '#0f172a' }}>
          {text || (record.pet && record.pet.petName) || 'Bruno'}
        </span>
      ),
    },
    {
      title: 'Vaccine Name',
      dataIndex: 'vaccineName',
      key: 'vaccineName',
      render: (text) => (
        <span style={{ color: '#1e293b', fontWeight: 500 }}>
          {text}
        </span>
      ),
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
        <span style={{ color: '#64748b', fontWeight: 500 }}>
          {date ? dayjs(date).format('YYYY-MM-DD') : '—'}
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
      title: 'Action',
      key: 'action',
      render: (_, record) => (
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
      ),
    },
  ];

  const pendingCount = vaccinations.filter((v) => v.status === 'PENDING').length;
  const completedCount = vaccinations.filter((v) => v.status === 'COMPLETED').length;

  const upcomingReminder = vaccinations.find(
    (v) => v.status === 'PENDING' || v.nextDueDate
  );

  const filteredVaccinations = vaccinations.filter((v) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const petName = (v.petName || (v.pet && v.pet.petName) || '').toLowerCase();
    const vaccine = (v.vaccineName || '').toLowerCase();
    return petName.includes(q) || vaccine.includes(q);
  });

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Metric Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
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
              title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>TOTAL DOSES</span>}
              value={vaccinations.length}
              prefix={<MedicineBoxOutlined style={{ color: '#1890ff', marginRight: 8 }} />}
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
              borderLeft: '4px solid #fa8c16',
            }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>PENDING VACCINATIONS</span>}
              value={pendingCount}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16', marginRight: 8 }} />}
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
              title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>COMPLETED DOSES</span>}
              value={completedCount}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />}
              valueStyle={{ fontWeight: 700, color: '#0f172a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Reminder Section */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
          Vaccination Reminders
        </h3>
        <Alert
          message={
            upcomingReminder
              ? `Reminder: ${upcomingReminder.vaccineName || 'Rabies'} due on ${
                  upcomingReminder.nextDueDate || '2026-09-14'
                } for pet`
              : 'Reminder: Rabies due on 2026-09-14 for pet'
          }
          type="warning"
          showIcon
          style={{
            borderRadius: 10,
            border: '1px solid #ffe58f',
            backgroundColor: '#fffbe6',
          }}
        />
      </div>

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
                Vaccination Schedules
              </h2>
              <Tag color="blue" style={{ borderRadius: 12, padding: '1px 10px', fontWeight: 600 }}>
                {vaccinations.length} Records
              </Tag>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Track immunizations, booster dates, and medical logs
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
              onClick={handleOpenAddModal}
              style={{
                borderRadius: 8,
                fontWeight: 600,
                height: 38,
                padding: '0 18px',
              }}
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

      {/* Modal */}
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
              {pets.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.petName}
                </Option>
              ))}
              {pets.length === 0 && <Option value={1}>Bruno</Option>}
            </Select>
          </Form.Item>

          <Form.Item
            label="Vaccine Name"
            name="vaccineName"
            rules={[{ required: true, message: 'Please enter vaccine name' }]}
          >
            <Input placeholder="e.g. Rabies, DHPP" />
          </Form.Item>

          <Form.Item
            label="Vaccination Date"
            name="vaccinationDate"
            rules={[{ required: true, message: 'Please select vaccination date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Next Due Date"
            name="nextDueDate"
            rules={[{ required: true, message: 'Please select next due date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select status' }]}
            initialValue="PENDING"
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