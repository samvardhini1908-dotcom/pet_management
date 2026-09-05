import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Tag, Space, message } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import api from '../services/api'; // adjust path to your API/axios instance

const { Option } = Select;
const { TextArea } = Input;

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const user = useSelector((state) => state.auth?.user);
  const isVetOrAdmin = user?.role === 'ROLE_VET' || user?.role === 'ROLE_ADMIN';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [recordsRes, petsRes] = await Promise.all([
        api.get('/medical-records'),
        api.get('/pets'),
      ]);

      setRecords(recordsRes.data || []);
      setPets(petsRes.data || []);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to fetch medical records');
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

  const handleCancelModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        pet: { id: values.petId },
        diagnosis: values.diagnosis,
        prescription: values.prescription,
        visitDate: values.visitDate ? values.visitDate.format('YYYY-MM-DD') : null,
      };

      await api.post('/medical-records', payload);
      message.success('Medical record added successfully');
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to create medical record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/medical-records/${id}/approve`);
      message.success('Medical record approved successfully');
      fetchData();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to approve medical record');
    }
  };

  const columns = [
    {
      title: 'Pet',
      key: 'pet',
      render: (_, record) => record.pet?.petName || record.petName || 'N/A',
    },
    {
      title: 'Visit Date',
      dataIndex: 'visitDate',
      key: 'visitDate',
      render: (date) => (date ? new Date(date).toLocaleDateString() : 'N/A'),
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
    },
    {
      title: 'Prescription',
      dataIndex: 'prescription',
      key: 'prescription',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'APPROVED' ? 'green' : 'orange'}>
          {status || 'PENDING'}
        </Tag>
      ),
    },
    ...(isVetOrAdmin
      ? [
          {
            title: 'Action',
            key: 'action',
            render: (_, record) =>
              record.status !== 'APPROVED' ? (
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleApprove(record.id)}
                >
                  Approve
                </Button>
              ) : null,
          },
        ]
      : []),
  ];

  return (
    <div style={{ padding: 24 }}>
      {isVetOrAdmin && (
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
            Add Record
          </Button>
        </div>
      )}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={records}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Add Medical Record"
        open={isModalOpen}
        onCancel={handleCancelModal}
        onOk={() => form.submit()}
        confirmLoading={submitting}
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
            <Select placeholder="Select pet">
              {pets.map((pet) => (
                <Option key={pet.id} value={pet.id}>
                  {pet.petName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Diagnosis"
            name="diagnosis"
            rules={[{ required: true, message: 'Please enter diagnosis' }]}
          >
            <Input placeholder="Enter diagnosis" />
          </Form.Item>

          <Form.Item
            label="Prescription"
            name="prescription"
            rules={[{ required: true, message: 'Please enter prescription details' }]}
          >
            <TextArea rows={4} placeholder="Enter prescription" />
          </Form.Item>

          <Form.Item
            label="Visit Date"
            name="visitDate"
            rules={[{ required: true, message: 'Please select visit date' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MedicalRecords;