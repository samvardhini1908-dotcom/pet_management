import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Tag, message, orientation } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../services/api'; // adjust path to your API/axios instance

const { Option } = Select;

const AppointmentScheduler = () => {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [appointmentsRes, petsRes, vetsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/pets'),
        api.get('/auth/vets'),
      ]);

      setAppointments(appointmentsRes.data || []);
      setPets(petsRes.data || []);
      setVets(vetsRes.data || []);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to fetch appointment data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const payload = {
      appointmentDate: values.date.toISOString(),
      purpose: values.purpose,
      pet: { id: values.petId },
      veterinarian: { id: values.vetId },
    };

    setSubmitting(true);
    try {
      await api.post('/appointments', payload);
      message.success('Appointment scheduled successfully');
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Scheduling failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      SCHEDULED: 'blue',
      CONFIRMED: 'cyan',
      COMPLETED: 'green',
      PENDING: 'orange',
      CANCELLED: 'red',
    };
    return <Tag color={statusMap[status] || 'default'}>{status || 'PENDING'}</Tag>;
  };

  const columns = [
    {
      title: 'Date & Time',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render: (text) => (text ? new Date(text).toLocaleString() : 'N/A'),
    },
    {
      title: 'Pet',
      key: 'pet',
      render: (_, record) => record.pet?.petName || record.petName || 'N/A',
    },
    {
      title: 'Vet',
      key: 'vet',
      render: (_, record) =>
        record.veterinarian?.fullName ||
        record.veterinarian?.name ||
        record.vetName ||
        'N/A',
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
          Schedule Appointment
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={appointments}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Schedule Appointment"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Pet"
            name="petId"
            rules={[{ required: true, message: 'Please select a pet' }]}
          >
            <Select placeholder="Select pet">
              {pets.map((pet) => (
                <Option key={pet.id} value={pet.id}>
                  {pet.petName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Veterinarian"
            name="vetId"
            rules={[{ required: true, message: 'Please select a veterinarian' }]}
          >
            <Select placeholder="Select veterinarian">
              {vets.map((vet) => (
                <Option key={vet.id} value={vet.id}>
                  {vet.fullName || vet.username || vet.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Date & Time"
            name="date"
            rules={[{ required: true, message: 'Please select date and time' }]}
          >
            <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
            label="Purpose"
            name="purpose"
            rules={[{ required: true, message: 'Please enter purpose of appointment' }]}
          >
            <Input placeholder="Enter purpose" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentScheduler;