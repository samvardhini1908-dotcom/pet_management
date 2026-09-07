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
  const isShelterOrAdmin =
    user?.role === 'ROLE_SHELTER' || user?.role === 'ROLE_ADMIN';

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" tip="Loading dashboard metrics..." />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Pets',
      value: totalPets,
      accent: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
      border: '#bae7ff',
      textColor: '#096dd9',
    },
    {
      title: 'Pending Vaccinations',
      value: pendingVaccinations,
      accent: 'linear-gradient(135deg, #fa8c16 0%, #ffd666 100%)',
      border: '#ffe7ba',
      textColor: '#d46b08',
    },
    {
      title: 'Pending Adoptions',
      value: pendingAdoptions,
      accent: 'linear-gradient(135deg, #52c41a 0%, #95de64 100%)',
      border: '#d9f7be',
      textColor: '#389e0d',
    },
    {
      title: 'Shelter Capacity',
      value: `${shelterPetsCount} / ${maxCapacity}`,
      accent: 'linear-gradient(135deg, #722ed1 0%, #b37feb 100%)',
      border: '#efdbff',
      textColor: '#531dab',
    },
  ];

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* KPI Statistic Cards */}
      <Row gutter={[20, 20]}>
        {statCards.map((card, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card
              bordered={false}
              style={{
                borderRadius: 14,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                position: 'relative',
                overflow: 'hidden',
                border: `1px solid ${card.border}`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: card.accent,
                }}
              />
              <Statistic
                title={
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {card.title}
                  </span>
                }
                value={card.value}
                valueStyle={{
                  color: card.textColor,
                  fontWeight: 700,
                  fontSize: 28,
                  marginTop: 6,
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Shelter Capacity Progress Card */}
      {isShelterOrAdmin && (
        <Card
          title={
            <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 16 }}>
              Shelter Capacity Status
            </span>
          }
          bordered={false}
          style={{
            marginTop: 24,
            borderRadius: 14,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          }}
          bodyStyle={{ padding: '24px 28px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#64748b', fontSize: 14 }}>Occupancy Rate</span>
            <span style={{ color: '#0f172a', fontWeight: 600, fontSize: 14 }}>
              {shelterPetsCount} of {maxCapacity} slots filled
            </span>
          </div>
          <Progress
            percent={capacityPercentage}
            status={capacityPercentage >= 90 ? 'exception' : 'active'}
            strokeColor={{
              '0%': '#1890ff',
              '100%': capacityPercentage >= 90 ? '#ff4d4f' : '#52c41a',
            }}
            strokeWidth={12}
            format={() => `${shelterPetsCount} / ${maxCapacity} Pets (${capacityPercentage}%)`}
          />
        </Card>
      )}

      {/* Overview Analytics Bar Chart */}
      <Card
        title={
          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 16 }}>
            Vaccinations and Adoptions Overview
          </span>
        }
        bordered={false}
        style={{
          marginTop: 24,
          borderRadius: 14,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
        bodyStyle={{ padding: '24px 28px' }}
      >
        {/* Custom Legend */}
        <div style={{ display: 'flex', gap: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 14,
                height: 14,
                background: 'linear-gradient(180deg, #36cfc9 0%, #1890ff 100%)',
                display: 'inline-block',
                borderRadius: 4,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Vaccinations</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 14,
                height: 14,
                background: 'linear-gradient(180deg, #95de64 0%, #52c41a 100%)',
                display: 'inline-block',
                borderRadius: 4,
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Adoptions</span>
          </div>
        </div>

        {/* Visual Responsive Bar Layout */}
        <div
          style={{
            display: 'flex',
            height: 250,
            alignItems: 'flex-end',
            gap: 16,
            paddingTop: 24,
            borderBottom: '2px solid #f1f5f9',
          }}
        >
          {past6Months.map((mObj, idx) => {
            const vaccCount = vaccCounts[idx];
            const adoptCount = adoptCounts[idx];
            const vaccHeight = vaccCount > 0 ? (vaccCount / maxValue) * 175 : 6;
            const adoptHeight = adoptCount > 0 ? (adoptCount / maxValue) * 175 : 6;

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
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 190 }}>
                  {/* Vaccinations Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {vaccCount > 0 && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#1890ff', marginBottom: 4 }}>
                        {vaccCount}
                      </span>
                    )}
                    <div
                      title={`Vaccinations: ${vaccCount}`}
                      style={{
                        width: 22,
                        height: `${vaccHeight}px`,
                        background:
                          vaccCount > 0
                            ? 'linear-gradient(180deg, #40a9ff 0%, #1890ff 100%)'
                            : '#f0f5ff',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </div>

                  {/* Adoptions Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {adoptCount > 0 && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#52c41a', marginBottom: 4 }}>
                        {adoptCount}
                      </span>
                    )}
                    <div
                      title={`Adoptions: ${adoptCount}`}
                      style={{
                        width: 22,
                        height: `${adoptHeight}px`,
                        background:
                          adoptCount > 0
                            ? 'linear-gradient(180deg, #73d13d 0%, #52c41a 100%)'
                            : '#f6ffed',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </div>
                </div>

                <span
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748b',
                  }}
                >
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