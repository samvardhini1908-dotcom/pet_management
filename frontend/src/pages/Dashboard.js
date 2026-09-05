import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Statistic, Progress, Spin, message } from 'antd';
import { useSelector } from 'react-redux';
import api from '../services/api';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [adoptions, setAdoptions] = useState([]);

  const user = useSelector((state) => state.auth?.user);
  const isShelterOrAdmin = user?.role === 'ROLE_SHELTER' || user?.role === 'ROLE_ADMIN';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [petsRes, vaccRes, adoptRes] = await Promise.all([
        api.get('/pets'),
        api.get('/vaccinations'),
        api.get('/adoptions'),
      ]);

      setPets(petsRes.data || []);
      setVaccinations(vaccRes.data || []);
      setAdoptions(adoptRes.data || []);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPets = pets.length;
  const pendingVaccinations = vaccinations.filter((v) => v.status === 'PENDING').length;
  const pendingAdoptions = adoptions.filter((a) => a.status === 'PENDING').length;
  const shelterPetsCount = pets.filter((p) => p.shelter !== null && p.shelter !== undefined).length;
  const maxCapacity = 50;
  const capacityPercentage = Math.min(Math.round((shelterPetsCount / maxCapacity) * 100), 100);

  const getMonthlyCounts = (dataList, dateField) => {
    const counts = [0, 0, 0, 0, 0, 0];
    dataList.forEach((item) => {
      const rawDate = item[dateField];
      if (rawDate) {
        const d = new Date(rawDate);
        const monthIdx = d.getMonth();
        if (monthIdx >= 0 && monthIdx <= 5) {
          counts[monthIdx] += 1;
        }
      }
    });
    return counts;
  };

  const vaccCounts = getMonthlyCounts(vaccinations, 'vaccinationDate');
  const adoptCounts = getMonthlyCounts(adoptions, 'requestDate');
  const maxValue = Math.max(...vaccCounts, ...adoptCounts, 5);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Pets" value={totalPets} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Pending Vaccinations" value={pendingVaccinations} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Pending Adoptions" value={pendingAdoptions} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Shelter Capacity"
              value={`${shelterPetsCount} / ${maxCapacity}`}
            />
          </Card>
        </Col>
      </Row>

      {isShelterOrAdmin && (
        <Card title="Shelter Capacity Status" style={{ marginTop: 24 }}>
          <Progress
            percent={capacityPercentage}
            status={capacityPercentage >= 90 ? 'exception' : 'active'}
            format={() => `${shelterPetsCount} / ${maxCapacity} Pets (${capacityPercentage}%)`}
          />
        </Card>
      )}

      <Card title="Vaccinations and Adoptions Overview" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, backgroundColor: '#1890ff', display: 'inline-block' }}></span>
            <span>Vaccinations</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, backgroundColor: '#52c41a', display: 'inline-block' }}></span>
            <span>Adoptions</span>
          </div>
        </div>

        <div style={{ display: 'flex', height: 260, alignItems: 'flex-end', gap: 16, paddingTop: 20 }}>
          {months.map((month, idx) => {
            const vaccHeight = (vaccCounts[idx] / maxValue) * 200;
            const adoptHeight = (adoptCounts[idx] / maxValue) * 200;
            return (
              <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 200 }}>
                  <div
                    title={`Vaccinations: ${vaccCounts[idx]}`}
                    style={{
                      width: 18,
                      height: `${vaccHeight}px`,
                      backgroundColor: '#1890ff',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                  <div
                    title={`Adoptions: ${adoptCounts[idx]}`}
                    style={{
                      width: 18,
                      height: `${adoptHeight}px`,
                      backgroundColor: '#52c41a',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                </div>
                <span style={{ marginTop: 8, fontSize: 12 }}>{month}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;