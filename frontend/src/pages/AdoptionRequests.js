import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Tag, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import api from '../services/api'; // adjust path to your API/axios instance

const AdoptionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdoptionRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/adoptions');
      setRequests(response.data || []);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to fetch adoption requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdoptionRequests();
  }, [fetchAdoptionRequests]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/adoptions/${id}`, null, { params: { status } });
      message.success(`Adoption request ${status.toLowerCase()} successfully`);
      fetchAdoptionRequests();
    } catch (error) {
      message.error(error?.response?.data?.message || `Failed to update status to ${status}`);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'PENDING':
        return <Tag color="orange">PENDING</Tag>;
      case 'APPROVED':
        return <Tag color="green">APPROVED</Tag>;
      case 'REJECTED':
        return <Tag color="red">REJECTED</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Applicant',
      key: 'applicant',
      render: (_, record) =>
        record.applicant?.fullName ||
        record.applicant?.name ||
        record.applicant?.username ||
        record.applicantName ||
        'N/A',
    },
    {
      title: 'Pet',
      key: 'pet',
      render: (_, record) =>
        record.pet?.petName ||
        record.pet?.name ||
        record.petName ||
        'N/A',
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (date) => (date ? new Date(date).toLocaleDateString() : 'N/A'),
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
        <Space size="middle">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            disabled={record.status === 'APPROVED'}
            onClick={() => handleUpdateStatus(record.id, 'APPROVED')}
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            disabled={record.status === 'REJECTED'}
            onClick={() => handleUpdateStatus(record.id, 'REJECTED')}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={requests}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AdoptionRequests;