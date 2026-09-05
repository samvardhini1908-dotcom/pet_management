import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tag,
  Alert,
  Space,
  Card,
  message
} from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import api from '../services/api'; // adjust path to your API/axios service

const { Option } = Select;

const VaccinationTracker = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const user = useSelector((state) => state.auth?.user);
  const canEdit = user?.role === 'ROLE_VET' || user?.role === 'ROLE_ADMIN';

  // Load vaccinations, reminders, and pets in parallel on mount
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [vaccinationsRes, remindersRes, petsRes] = await Promise.all([
        api.get('/vaccinations'),
        api.get('/vaccinations/reminders'),
        api.get('/pets'),
      ]);

      setVaccinations(vaccinationsRes.data || []);
      setReminders(remindersRes.data || []);
      setPets(petsRes.data || []);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to fetch vaccination data');
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
      petId: record.petId || record.pet?.id,
      vaccineName: record.vaccineName,
      vaccinationDate: record.vaccinationDate ? dayjs(record.vaccinationDate) : null,
      nextDueDate: record.nextDueDate ? dayjs(record.nextDueDate) : null,
      status: record.status,
    });
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    const payload = {
      ...values,
      vaccinationDate: values.vaccinationDate ? values.vaccinationDate.format('YYYY-MM-DD') : null,
      nextDueDate: values.nextDueDate ? values.nextDueDate.format('YYYY-MM-DD') : null,
    };

    try {
      if (editingRecord) {
        await api.put(`/vaccinations/${editingRecord.id}`, payload);
      } else {
        await api.post('/vaccinations', payload);
      }

      message.success('Vaccination recorded/scheduled successfully');
      setIsModalOpen(false);
      setEditingRecord(null);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to save vaccination');
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <Tag color="green">COMPLETED</Tag>;
      case 'PENDING':
        return <Tag color="orange">PENDING</Tag>;
      case 'OVERDUE':
        return <Tag color="red">OVERDUE</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Pet Name',
      dataIndex: 'petName',
      key: 'petName',
      render: (text, record) => record.petName || record.pet?.petName || 'N/A',
    },
    {
      title: 'Vaccine Name',
      dataIndex: 'vaccineName',
      key: 'vaccineName',
    },
    {
      title: 'Vaccination Date',
      dataIndex: 'vaccinationDate',
      key: 'vaccinationDate',
    },
    {
      title: 'Next Due Date',
      dataIndex: 'nextDueDate',
      key: 'nextDueDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    ...(canEdit
      ? [
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleOpenEditModal(record)}
              >
                Edit
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Reminder Alerts Section */}
      <div style={{ marginBottom: 24 }}>
        <h3>Vaccination Reminders</h3>
        {reminders.length > 0 ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            {reminders.map((reminder, idx) => (
              <Alert
                key={reminder.id || idx}
                message={reminder.message || `Reminder: ${reminder.vaccineName} due on ${reminder.nextDueDate} for pet ${reminder.petName || ''}`}
                type="warning"
                showIcon
              />
            ))}
          </Space>
        ) : (
          <Card size="small">No upcoming reminders at this time.</Card>
        )}
      </div>

      {/* Action Header */}
      <Space style={{ orientation: 'horizontal', marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAddModal}>
          Add Vaccination
        </Button>
      </Space>

      {/* Main Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={vaccinations}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Add / Edit Vaccination Modal */}
      <Modal
        title={editingRecord ? 'Edit Vaccination' : 'Add Vaccination'}
        open={isModalOpen}
        okText={editingRecord ? 'Update' : 'Add'}
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
            label="Pet"
            name="petId"
            rules={[{ required: true, message: 'Please select a pet' }]}
          >
            <Select placeholder="Select from pets">
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
            <Input placeholder="Enter vaccine name" />
          </Form.Item>

          <Form.Item
            label="Vaccination Date"
            name="vaccinationDate"
            rules={[{ required: true, message: 'Please select vaccination date' }]}
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
              <Option value="COMPLETED">COMPLETED</Option>
              <Option value="PENDING">PENDING</Option>
              <Option value="OVERDUE">OVERDUE</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VaccinationTracker;