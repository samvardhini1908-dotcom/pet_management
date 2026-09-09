import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Tag, Button, message } from 'antd';
import {
  DownloadOutlined,
  FilePdfOutlined,
  BarChartOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [adoptions, setAdoptions] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.get('/pets'),
        api.get('/vaccinations'),
        api.get('/adoptions').catch(() => api.get('/adoption-requests')),
      ]);

      const [pRes, vRes, aRes] = results;
      if (pRes.status === 'fulfilled') setPets(pRes.value.data || []);
      if (vRes.status === 'fulfilled') setVaccinations(vRes.value.data || []);
      if (aRes.status === 'fulfilled') setAdoptions(aRes.value.data || []);
    } catch (error) {
      message.error('Failed to load reporting data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Breakdowns by species
  const dogCount = pets.filter((p) => (p.species || '').toLowerCase() === 'dog').length;
  const catCount = pets.filter((p) => (p.species || '').toLowerCase() === 'cat').length;
  const otherSpeciesCount = pets.length - dogCount - catCount;

  // Immunization completion calculation
  const completedVacc = vaccinations.filter((v) => v.status === 'COMPLETED').length;
  const vaccCompletionRate = vaccinations.length > 0
    ? Math.round((completedVacc / vaccinations.length) * 100)
    : 100;

  // Adoption conversion rate
  const approvedAdoptions = adoptions.filter((a) => a.status === 'APPROVED').length;
  const adoptionRate = adoptions.length > 0
    ? Math.round((approvedAdoptions / adoptions.length) * 100)
    : 0;

  const summaryData = [
    { key: '1', metric: 'Total Registered Pets', count: pets.length, status: 'Active' },
    { key: '2', metric: 'Vaccination Doses Administered', count: completedVacc, status: 'Healthy' },
    { key: '3', metric: 'Successful Adoptions', count: approvedAdoptions, status: 'Finalized' },
    { key: '4', metric: 'Pending Review Logs', count: adoptions.filter((a) => a.status === 'PENDING').length, status: 'Pending' },
  ];

  const columns = [
    {
      title: 'Metric Classification',
      dataIndex: 'metric',
      key: 'metric',
      render: (text) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{text}</span>,
    },
    {
      title: 'Count / Volume',
      dataIndex: 'count',
      key: 'count',
      render: (val) => <span style={{ fontWeight: 700, color: '#1677ff' }}>{val}</span>,
    },
    {
      title: 'Current Health',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          color={status === 'Healthy' || status === 'Finalized' ? 'green' : 'blue'}
          style={{ borderRadius: 12 }}
        >
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>
              Operational Reports & Analytics
            </h1>
            <Tag color="purple" style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>
              System Audited
            </Tag>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
            High-level performance trends, health rates, and shelter metrics
          </p>
        </div>

        <div>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => message.info('Generating PDF export...')}
            style={{ borderRadius: 8, fontWeight: 500 }}
          >
            Export Summary
          </Button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 14,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>VACCINATION COMPLETION</span>
            <div style={{ marginTop: 12, marginBottom: 8 }}>
              <Progress percent={vaccCompletionRate} strokeColor="#52c41a" status="active" strokeWidth={10} />
            </div>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {completedVacc} of {vaccinations.length} doses cleared
            </span>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 14,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>ADOPTION CONVERSION</span>
            <div style={{ marginTop: 12, marginBottom: 8 }}>
              <Progress percent={adoptionRate} strokeColor="#1890ff" status="active" strokeWidth={10} />
            </div>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {approvedAdoptions} of {adoptions.length} requests approved
            </span>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 14,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>SPECIES DISTRIBUTION</span>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#1677ff' }}>{dogCount}</span>
                <div style={{ fontSize: 12, color: '#64748b' }}>Dogs</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#722ed1' }}>{catCount}</span>
                <div style={{ fontSize: 12, color: '#64748b' }}>Cats</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#fa8c16' }}>{otherSpeciesCount}</span>
                <div style={{ fontSize: 12, color: '#64748b' }}>Other</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Summary Audit Table */}
      <Card
        bordered={false}
        style={{
          borderRadius: 14,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
        bodyStyle={{ padding: '24px 28px' }}
      >
        <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
          System Audit Log Summary
        </h2>
        <Table
          columns={columns}
          dataSource={summaryData}
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Reports;