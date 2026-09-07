import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Statistic, Progress, Spin, message } from 'antd';
import { useSelector } from 'react-redux';
import api from '../services/api';

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

  // Compute the rolling past 6 months (e.g., Apr, May, Jun, Jul, Aug, Sep)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  const past6Months = Array.from({ length: 6 }, (_, i) => {
    const month = (currentMonthIdx - 5 + i + 12) % 12;
    return {
      monthIdx: month,
      name: monthNames[month],
    };
  });

  const getMonthlyCounts = (dataList, dateField) => {
    const counts = [0, 0, 0, 0, 0, 0];
    dataList.forEach((item) => {
      const rawDate = item[dateField];
      if (rawDate) {
        const d = new Date(rawDate);
        const itemMonth = d.getMonth();
        const slotIdx = past6Months.findIndex((m) => m.monthIdx === itemMonth);
        if (slotIdx !== -1) {
          counts[slotIdx] += 1;
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
            <span style={{ width: 14, height: 14, backgroundColor: '#1890ff', display: 'inline-block', borderRadius: 2 }} />
            <span>Vaccinations</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, backgroundColor: '#52c41a', display: 'inline-block', borderRadius: 2 }} />
            <span>Adoptions</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            height: 260,
            alignItems: 'flex-end',
            gap: 16,
            paddingTop: 20,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {past6Months.map((mObj, idx) => {
            const vaccCount = vaccCounts[idx];
            const adoptCount = adoptCounts[idx];
            const vaccHeight = vaccCount > 0 ? (vaccCount / maxValue) * 180 : 4;
            const adoptHeight = adoptCount > 0 ? (adoptCount / maxValue) * 180 : 4;

            return (
              <div
                key={mObj.name}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200 }}>
                  {/* Vaccinations Bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {vaccCount > 0 && (
                      <span style={{ fontSize: 11, color: '#1890ff', marginBottom: 2 }}>{vaccCount}</span>
                    )}
                    <div
                      title={`Vaccinations: ${vaccCount}`}
                      style={{
                        width: 20,
                        height: `${vaccHeight}px`,
                        backgroundColor: vaccCount > 0 ? '#1890ff' : '#e6f7ff',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                    />
                  </div>

                  {/* Adoptions Bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {adoptCount > 0 && (
                      <span style={{ fontSize: 11, color: '#52c41a', marginBottom: 2 }}>{adoptCount}</span>
                    )}
                    <div
                      title={`Adoptions: ${adoptCount}`}
                      style={{
                        width: 20,
                        height: `${adoptHeight}px`,
                        backgroundColor: adoptCount > 0 ? '#52c41a' : '#f6ffed',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                    />
                  </div>
                </div>
                <span style={{ marginTop: 8, fontSize: 12, fontWeight: 500, color: '#555' }}>
                  {mObj.name}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;