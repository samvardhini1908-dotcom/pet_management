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
  Avatar,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

const { Option } = Select;
const { TextArea } = Input;

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [recRes, petsRes] = await Promise.all([
        api.get('/medical-records').catch(() => api.get('/records')),
        api.get('/pets').catch(() => ({ data: [] })),
      ]);
      setRecords(Array.isArray(recRes?.data) ? recRes.data : []);
      setPets(Array.isArray(petsRes?.data) ? petsRes.data : []);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to fetch medical records');
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
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      recordDate: record.recordDate ? dayjs(record.recordDate) : null,
      notes: record.notes,
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
      recordDate: values.recordDate ? values.recordDate.format('YYYY-MM-DD') : null,
    };

    try {
      if (editingRecord) {
        await api.put(`/medical-records/${editingRecord.id}`, payload);
        message.success('Medical record updated successfully');
      } else {
        await api.post('/medical-records', payload);
        message.success('Medical record added successfully');
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
      await api.delete(`/medical-records/${id}`);
      message.success('Medical record deleted successfully');
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to delete record');
    }
  };

  const columns = [
    {
      title: 'Pet Name',
      dataIndex: 'petName',
      key: 'petName',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar
            style={{
              backgroundColor: '#1890ff',
              fontWeight: 600,
            }}
          >
            {(text || (record.pet && record.pet.petName) || 'P').charAt(0).toUpperCase()}
          </Avatar>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>
            {text || (record.pet && record.pet.petName) || 'Bruno'}
          </span>
        </div>
      ),
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      render: (text) => (
        <Tag
          color="volcano"
          style={{
            borderRadius: 12,
            padding: '2px 10px',
            fontWeight: 600,
          }}
        >
          {text || 'Routine Checkup'}
        </Tag>
      ),
    },
    {
      title: 'Treatment',
      dataIndex: 'treatment',
      key: 'treatment',
      render: (text) => <span style={{ color: '#334155' }}>{text || '—'}</span>,
    },
    {
      title: 'Record Date',
      dataIndex: 'recordDate',
      key: 'recordDate',
      render: (date) => (
        <span style={{ color: '#64748b', fontWeight: 500 }}>
          {date ? dayjs(date).format('YYYY-MM-DD') : '—'}
        </span>
      ),
    },
    {
      title: 'Veterinarian',
      dataIndex: 'veterinarian',
      key: 'veterinarian',
      render: (vet, record) => (
        <span style={{ color: '#475569' }}>
          {vet?.fullName || vet?.username || record.vetName || 'Dr. Vet'}
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
            title="Are you sure you want to delete this record?"
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

  const uniquePatients = new Set(
    records.map((r) => r.petId || (r.pet && r.pet.id) || r.petName)
  ).size;

  const filteredRecords = records.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const petName = (r.petName || (r.pet && r.pet.petName) || '').toLowerCase();
    const diagnosis = (r.diagnosis || '').toLowerCase();
    const treatment = (r.treatment || '').toLowerCase();
    return petName.includes(q) || diagnosis.includes(q) || treatment.includes(q);
  });

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
              borderLeft: '4px solid #1890ff',
            }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>TOTAL RECORDS</span>}
              value={records.length}
              prefix={<FileTextOutlined style={{ color: '#1890ff', marginRight: 8 }} />}
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
              title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>UNIQUE PATIENTS</span>}
              value={uniquePatients}
              prefix={<HeartOutlined style={{ color: '#52c41a', marginRight: 8 }} />}
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
              borderLeft: '4px solid #722ed1',
            }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>ACTIVE TREATMENTS</span>}
              value={records.filter((r) => r.treatment).length}
              prefix={<MedicineBoxOutlined style={{ color: '#722ed1', marginRight: 8 }} />}
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
        {/* Header with Search and Action Button */}
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
                Medical Records
              </h2>
              <Tag color="blue" style={{ borderRadius: 12, padding: '1px 10px', fontWeight: 600 }}>
                {records.length} Entries
              </Tag>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Archive clinical observations, diagnoses, prescriptions, and follow-ups
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Input.Search
              placeholder="Search pet, diagnosis..."
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
              Add Medical Record
            </Button>
          </div>
        </div>

        {/* Records Table */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredRecords}
          loading={loading}
          pagination={{
            pageSize: 8,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
          }}
        />
      </Card>

      {/* Modal for Add / Edit */}
      <Modal
        title={editingRecord ? 'Edit Medical Record' : 'Add Medical Record'}
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
            label="Diagnosis"
            name="diagnosis"
            rules={[{ required: true, message: 'Please enter diagnosis' }]}
          >
            <Input placeholder="e.g. Parvovirus, Ear Infection, Healthy" />
          </Form.Item>

          <Form.Item
            label="Treatment"
            name="treatment"
            rules={[{ required: true, message: 'Please enter treatment' }]}
          >
            <Input placeholder="e.g. Antibiotics 5-day course" />
          </Form.Item>

          <Form.Item
            label="Record Date"
            name="recordDate"
            rules={[{ required: true, message: 'Please select record date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Notes" name="notes">
            <TextArea rows={3} placeholder="Additional medical observations..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicalRecords;