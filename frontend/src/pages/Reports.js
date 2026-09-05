import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Statistic, List, Typography, Spin, message } from 'antd';
import api from '../services/api'; // adjust path to your API/axios instance

const { Title } = Typography;

const VACCINATION_CATEGORIES = [
  'Core - DHPP',
  'Core - Rabies',
  'Non-Core Bordetella',
  'Non-Core - Lyme',
  'Feline - FVRCP',
];

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [vaccinationReport, setVaccinationReport] = useState({});
  const [adoptionReport, setAdoptionReport] = useState({});
  const [medicalReport, setMedicalReport] = useState({});

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const [vaccRes, adoptRes, medRes] = await Promise.all([
        api.get('/reports/vaccinations'),
        api.get('/reports/adoptions'),
        api.get('/reports/medical'),
      ]);

      setVaccinationReport(vaccRes.data || {});
      setAdoptionReport(adoptRes.data || {});
      setMedicalReport(medRes.data || {});
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to fetch report analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Handle both flat number responses and structured object responses
  const totalVaccinations =
    typeof vaccinationReport === 'number'
      ? vaccinationReport
      : vaccinationReport.total ?? vaccinationReport.count ?? Object.keys(vaccinationReport).length;

  const totalAdoptions =
    typeof adoptionReport === 'number'
      ? adoptionReport
      : adoptionReport.total ?? adoptionReport.count ?? Object.keys(adoptionReport).length;

  const totalMedical =
    typeof medicalReport === 'number'
      ? medicalReport
      : medicalReport.total ?? medicalReport.count ?? Object.keys(medicalReport).length;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Admin Analytics & Control</Title>

      {/* Totals Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Vaccinations"
              value={totalVaccinations}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Adoptions"
              value={totalAdoptions}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Medical Records"
              value={totalMedical}
            />
          </Card>
        </Col>
      </Row>

      {/* Vaccination Categories List */}
      <Card title="Vaccination Categories">
        <List
          bordered
          dataSource={VACCINATION_CATEGORIES}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>{item}</Typography.Text>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Reports;