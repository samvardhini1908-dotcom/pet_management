import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Card,
  Tag,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Input,
  message,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

const AdoptionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api
        .get('/adoptions')
        .catch(() => api.get('/adoption-requests'));
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to fetch adoption requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api
        .put(`/adoptions/${id}/status`, { status })
        .catch(() => api.put(`/adoptions/${id}`, { status }));

      message.success(`Request ${status.toLowerCase()} successfully`);
      fetchRequests();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Status update failed');
    }
  };

  const getStatusTag = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'APPROVED') {
      return <Tag color="success" style={{ borderRadius: 12 }}>APPROVED</Tag>;
    }
    if (s === 'REJECTED') {
      return <Tag color="error" style={{ borderRadius: 12 }}>REJECTED</Tag>;
    }
    return <Tag color="warning" style={{ borderRadius: 12 }}>PENDING</Tag>;
  };

  const columns = [
    {
      title: 'Applicant',
      dataIndex: 'applicantName',
      key: 'applicantName',
      render: (text, record) => (
        <span style={{ fontWeight: 600, color: '#0f172a' }}>
          {text || record.user?.fullName || record.user?.username || 'Pet Lover'}
        </span>
      ),
    },
    {
      title: 'Pet Name',
      dataIndex: 'petName',
      key: 'petName',
      render: (text, record) => (
        <span style={{ color: '#334155', fontWeight: 500 }}>
          {text || record.pet?.petName || 'Bruno'}
        </span>
      ),
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (date) => (
        <span style={{ color: '#64748b' }}>
          {date ? dayjs(date).format('YYYY-MM-DD') : '—'}
        </span>
      ),
    },
    {
      title: 'Notes / Reason',
      dataIndex: 'notes',
      key: 'notes',
      render: (text, record) => (
        <span style={{ color: '#475569' }}>
          {text || record.reason || 'Looking forward to adopting!'}
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
      render: (_, record) => {
        const isPending = (record.status || 'PENDING') === 'PENDING';
        if (!isPending) return <span style={{ color: '#94a3b8' }}>Processed</span>;

        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <Popconfirm
              title="Approve this adoption request?"
              onConfirm={() => handleUpdateStatus(record.id, 'APPROVED')}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                style={{ borderRadius: 6, backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Approve
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Reject this adoption request?"
              onConfirm={() => handleUpdateStatus(record.id, 'REJECTED')}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                style={{ borderRadius: 6 }}
              >
                Reject
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const pendingCount = requests.filter((r) => (r.status || 'PENDING') === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;

  const filteredRequests = requests.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const applicant = (r.applicantName || r.user?.fullName || '').toLowerCase();
    const pet = (r.petName || r.pet?.petName || '').toLowerCase();
    return applicant.includes(q) || pet.includes(q);
  });

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Metric Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
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
              title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>PENDING APPLICATIONS</span>}
              value={pendingCount}
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16', marginRight: 8 }} />}
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
              borderLeft: '4px solid #52c41a',
            }}
            bodyStyle={{ padding: '16px 20px' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>APPROVED ADOPTIONS</span>}
              value={approvedCount}
              prefix={<FileDoneOutlined style={{ color: '#52c41a', marginRight: 8 }} />}
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
                Adoption Applications
              </h2>
              <Tag color="blue" style={{ borderRadius: 12, padding: '1px 10px', fontWeight: 600 }}>
                {requests.length} Total
              </Tag>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Review applicant backgrounds, check screening notes, and grant approvals
            </p>
          </div>

          <div>
            <Input.Search
              placeholder="Search applicant or pet..."
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 260 }}
            />
          </div>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredRequests}
          loading={loading}
          pagination={{
            pageSize: 8,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} requests`,
          }}
        />
      </Card>
    </div>
  );
};

export default AdoptionRequests;