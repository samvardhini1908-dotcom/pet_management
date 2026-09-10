// import React, { useState, useEffect, useCallback } from 'react';
// import { Row, Col, Card, Statistic, Progress, Spin, Button, Tag, message } from 'antd';
// import { ReloadOutlined } from '@ant-design/icons';
// import { useSelector } from 'react-redux';
// import api from '../services/api';

// const Dashboard = () => {
//   const [loading, setLoading] = useState(false);
//   const [pets, setPets] = useState([]);
//   const [vaccinations, setVaccinations] = useState([]);
//   const [adoptions, setAdoptions] = useState([]);

//   const user = useSelector((state) => state.auth?.user);
//   const isShelterOrAdmin =
//     user?.role === 'ROLE_SHELTER' || user?.role === 'ROLE_ADMIN';

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const results = await Promise.allSettled([
//         api.get('/pets'),
//         api.get('/vaccinations'),
//         api.get('/adoptions').catch(() => api.get('/adoption-requests')),
//       ]);

//       const [petsRes, vaccRes, adoptRes] = results;

//       if (petsRes.status === 'fulfilled') {
//         setPets(Array.isArray(petsRes.value.data) ? petsRes.value.data : []);
//       }
//       if (vaccRes.status === 'fulfilled') {
//         setVaccinations(Array.isArray(vaccRes.value.data) ? vaccRes.value.data : []);
//       }
//       if (adoptRes.status === 'fulfilled') {
//         setAdoptions(Array.isArray(adoptRes.value.data) ? adoptRes.value.data : []);
//       }

//       if (
//         petsRes.status === 'rejected' &&
//         vaccRes.status === 'rejected' &&
//         adoptRes.status === 'rejected'
//       ) {
//         message.error('Failed to fetch dashboard data');
//       }
//     } catch (error) {
//       message.error(error?.response?.data?.message || 'Failed to fetch dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const totalPets = pets.length;
//   const pendingVaccinations = vaccinations.filter((v) => v.status === 'PENDING').length;
//   const pendingAdoptions = adoptions.filter((a) => a.status === 'PENDING').length;
//   const shelterPetsCount = pets.filter((p) => p.shelter !== null && p.shelter !== undefined).length;
//   const maxCapacity = 50;
//   const capacityPercentage = Math.min(Math.round((shelterPetsCount / maxCapacity) * 100), 100);

//   // Dynamic 6-month window ending on current month
//   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const currentMonthIdx = new Date().getMonth();
//   const past6Months = Array.from({ length: 6 }, (_, i) => {
//     const month = (currentMonthIdx - 5 + i + 12) % 12;
//     return {
//       monthIdx: month,
//       name: monthNames[month],
//     };
//   });

//   const getMonthlyCounts = (dataList, dateField) => {
//     const counts = [0, 0, 0, 0, 0, 0];
//     dataList.forEach((item) => {
//       const rawDate = item[dateField];
//       if (rawDate) {
//         const d = new Date(rawDate);
//         const itemMonth = d.getMonth();
//         const slotIdx = past6Months.findIndex((m) => m.monthIdx === itemMonth);
//         if (slotIdx !== -1) {
//           counts[slotIdx] += 1;
//         }
//       }
//     });
//     return counts;
//   };

//   const vaccCounts = getMonthlyCounts(vaccinations, 'vaccinationDate');
//   const adoptCounts = getMonthlyCounts(adoptions, 'requestDate');
//   const maxValue = Math.max(...vaccCounts, ...adoptCounts, 5);

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
//         <Spin size="large" />
//       </div>
//     );
//   }

//   const statCards = [
//     {
//       title: 'Total Pets',
//       value: totalPets,
//       accent: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
//       border: '#bae7ff',
//       textColor: '#096dd9',
//     },
//     {
//       title: 'Pending Vaccinations',
//       value: pendingVaccinations,
//       accent: 'linear-gradient(135deg, #fa8c16 0%, #ffd666 100%)',
//       border: '#ffe7ba',
//       textColor: '#d46b08',
//     },
//     {
//       title: 'Pending Adoptions',
//       value: pendingAdoptions,
//       accent: 'linear-gradient(135deg, #52c41a 0%, #95de64 100%)',
//       border: '#d9f7be',
//       textColor: '#389e0d',
//     },
//     {
//       title: 'Shelter Capacity',
//       value: `${shelterPetsCount} / ${maxCapacity}`,
//       accent: 'linear-gradient(135deg, #722ed1 0%, #b37feb 100%)',
//       border: '#efdbff',
//       textColor: '#531dab',
//     },
//   ];

//   return (
//     <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
//       {/* Top Page Header */}
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           flexWrap: 'wrap',
//           gap: 16,
//           marginBottom: 24,
//           paddingBottom: 16,
//           borderBottom: '1px solid #e2e8f0',
//         }}
//       >
//         <div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>
//               Dashboard Overview
//             </h1>
//             <Tag color="cyan" style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>
//               Live Metrics
//             </Tag>
//           </div>
//           <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
//             Real-time statistics on pet population, medical schedules, and shelter status
//           </p>
//         </div>

//         <div>
//           <Button
//             icon={<ReloadOutlined />}
//             onClick={fetchData}
//             style={{ borderRadius: 8, fontWeight: 500 }}
//           >
//             Refresh
//           </Button>
//         </div>
//       </div>

//       {/* KPI Statistic Cards */}
//       <Row gutter={[20, 20]}>
//         {statCards.map((card, idx) => (
//           <Col xs={24} sm={12} lg={6} key={idx}>
//             <Card
//               bordered={false}
//               style={{
//                 borderRadius: 14,
//                 boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
//                 position: 'relative',
//                 overflow: 'hidden',
//                 border: `1px solid ${card.border}`,
//               }}
//               bodyStyle={{ padding: '20px 24px' }}
//             >
//               <div
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   height: 4,
//                   background: card.accent,
//                 }}
//               />
//               <Statistic
//                 title={card.title}
//                 value={card.value}
//                 valueStyle={{
//                   color: card.textColor,
//                   fontWeight: 700,
//                   fontSize: 28,
//                   marginTop: 6,
//                 }}
//               />
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       {/* Shelter Capacity Progress Card */}
//       {isShelterOrAdmin && (
//         <Card
//           title="Shelter Capacity Status"
//           bordered={false}
//           style={{
//             marginTop: 24,
//             borderRadius: 14,
//             boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
//           }}
//           bodyStyle={{ padding: '24px 28px' }}
//         >
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//             <span style={{ color: '#64748b', fontSize: 14 }}>Occupancy Rate</span>
//             <span style={{ color: '#0f172a', fontWeight: 600, fontSize: 14 }}>
//               {shelterPetsCount} of {maxCapacity} slots filled
//             </span>
//           </div>
//           <Progress
//             percent={capacityPercentage}
//             status={capacityPercentage >= 90 ? 'exception' : 'active'}
//             strokeColor={{
//               '0%': '#1890ff',
//               '100%': capacityPercentage >= 90 ? '#ff4d4f' : '#52c41a',
//             }}
//             strokeWidth={12}
//             format={() => `${shelterPetsCount} / ${maxCapacity} Pets (${capacityPercentage}%)`}
//           />
//         </Card>
//       )}

//       {/* Overview Analytics Bar Chart */}
//       <Card
//         title="Vaccinations and Adoptions Overview"
//         bordered={false}
//         style={{
//           marginTop: 24,
//           borderRadius: 14,
//           boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
//         }}
//         bodyStyle={{ padding: '24px 28px' }}
//       >
//         {/* Legend */}
//         <div style={{ display: 'flex', gap: 28, marginBottom: 24 }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <span
//               style={{
//                 width: 14,
//                 height: 14,
//                 backgroundColor: '#1890ff',
//                 display: 'inline-block',
//                 borderRadius: 4,
//               }}
//             />
//             <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Vaccinations</span>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <span
//               style={{
//                 width: 14,
//                 height: 14,
//                 backgroundColor: '#52c41a',
//                 display: 'inline-block',
//                 borderRadius: 4,
//               }}
//             />
//             <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>Adoptions</span>
//           </div>
//         </div>

//         {/* Responsive Bar Container */}
//         <div
//           style={{
//             display: 'flex',
//             height: 250,
//             alignItems: 'flex-end',
//             gap: 16,
//             paddingTop: 24,
//             borderBottom: '2px solid #f1f5f9',
//           }}
//         >
//           {past6Months.map((mObj, idx) => {
//             const vaccCount = vaccCounts[idx];
//             const adoptCount = adoptCounts[idx];
//             const vaccHeight = vaccCount > 0 ? (vaccCount / maxValue) * 175 : 8;
//             const adoptHeight = adoptCount > 0 ? (adoptCount / maxValue) * 175 : 8;

//             return (
//               <div
//                 key={mObj.name}
//                 style={{
//                   flex: 1,
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   height: '100%',
//                   justifyContent: 'flex-end',
//                 }}
//               >
//                 <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 190 }}>
//                   {/* Vaccinations Column */}
//                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                     {vaccCount > 0 && (
//                       <span style={{ fontSize: 11, fontWeight: 600, color: '#1890ff', marginBottom: 4 }}>
//                         {vaccCount}
//                       </span>
//                     )}
//                     <div
//                       title={`Vaccinations: ${vaccCount}`}
//                       style={{
//                         width: 22,
//                         height: `${vaccHeight}px`,
//                         background:
//                           vaccCount > 0
//                             ? 'linear-gradient(180deg, #40a9ff 0%, #1890ff 100%)'
//                             : '#f0f5ff',
//                         borderRadius: '6px 6px 0 0',
//                         transition: 'height 0.35s ease',
//                       }}
//                     />
//                   </div>

//                   {/* Adoptions Column */}
//                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                     {adoptCount > 0 && (
//                       <span style={{ fontSize: 11, fontWeight: 600, color: '#52c41a', marginBottom: 4 }}>
//                         {adoptCount}
//                       </span>
//                     )}
//                     <div
//                       title={`Adoptions: ${adoptCount}`}
//                       style={{
//                         width: 22,
//                         height: `${adoptHeight}px`,
//                         background:
//                           adoptCount > 0
//                             ? 'linear-gradient(180deg, #73d13d 0%, #52c41a 100%)'
//                             : '#f6ffed',
//                         borderRadius: '6px 6px 0 0',
//                         transition: 'height 0.35s ease',
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <span
//                   style={{
//                     marginTop: 10,
//                     fontSize: 12,
//                     fontWeight: 600,
//                     color: '#64748b',
//                   }}
//                 >
//                   {mObj.name}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Progress, Tag, Table, Spin, Button } from 'antd';
import {
  HeartOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [adoptions, setAdoptions] = useState([]);

  // Safely extract user from Redux or localStorage
  const reduxUser = useSelector((state) => state.auth?.user);
  let storedUser = null;
  try {
    const raw = localStorage.getItem('user');
    storedUser = raw ? JSON.parse(raw) : null;
  } catch (e) {
    storedUser = null;
  }
  const currentUser = reduxUser || storedUser;
  const isAdmin =
    currentUser?.role === 'ROLE_ADMIN' ||
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'admin';

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [petsRes, vaccRes, apptRes, adoptRes] = await Promise.allSettled([
        api.get('/pets'),
        api.get('/vaccinations'),
        api.get('/appointments'),
        api.get('/adoptions'),
      ]);

      if (petsRes.status === 'fulfilled' && Array.isArray(petsRes.value.data)) {
        setPets(petsRes.value.data);
      }
      if (vaccRes.status === 'fulfilled' && Array.isArray(vaccRes.value.data)) {
        setVaccinations(vaccRes.value.data);
      }
      if (apptRes.status === 'fulfilled' && Array.isArray(apptRes.value.data)) {
        setAppointments(apptRes.value.data);
      }
      if (adoptRes.status === 'fulfilled' && Array.isArray(adoptRes.value.data)) {
        setAdoptions(adoptRes.value.data);
      }
    } catch (err) {
      console.error('Dashboard data fetching error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Safe navigation handler
  const handleNavigate = (path) => {
    if (typeof navigate === 'function') {
      try {
        navigate(path);
      } catch (e) {
        if (typeof window !== 'undefined') window.location.href = path;
      }
    } else if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  // 1. Dynamic Pet Counts: If admin, count all pets; if owner, count user's pets unless unassigned
  const displayPets = isAdmin
    ? pets
    : pets.filter((p) => {
        const ownerId = p.owner?.id || p.ownerId || p.userId;
        return !ownerId || String(ownerId) === String(currentUser?.id);
      });

  const petCount = displayPets.length;
  const maxCapacity = 50;
  const capacityPercent = Math.min(Math.round((petCount / maxCapacity) * 100), 100);

  // 2. Dynamic Appointments
  const scheduledAppts = appointments.filter(
    (a) => (a.status || 'SCHEDULED').toUpperCase() === 'SCHEDULED'
  );

  // 3. Dynamic Vaccinations Pending
  const pendingVaccines = vaccinations.filter(
    (v) => (v.status || 'PENDING').toUpperCase() === 'PENDING'
  );

  // 4. Adoption Requests Available / Pending
  const pendingAdoptions = adoptions.filter(
    (a) => (a.status || 'PENDING').toUpperCase() === 'PENDING'
  );

  // Quick Table Columns for Recent Appointments
  const appointmentColumns = [
    {
      title: 'Pet Name',
      key: 'petName',
      render: (_, record) => {
        const name =
          record.pet?.petName ||
          record.petName ||
          pets.find((p) => String(p.id) === String(record.pet?.id || record.petId))?.petName ||
          '—';
        return <span style={{ fontWeight: 600, color: '#0f172a' }}>{name}</span>;
      },
    },
    {
      title: 'Date & Time',
      key: 'appointmentDate',
      render: (_, record) => {
        const d = record.appointmentDate || record.dateTime;
        return <span style={{ color: '#64748b' }}>{d ? dayjs(d).format('YYYY-MM-DD HH:mm') : '—'}</span>;
      },
    },
    {
      title: 'Reason / Purpose',
      key: 'purpose',
      render: (_, record) => (
        <span style={{ color: '#64748b' }}>{record.purpose || record.reason || '—'}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const s = (status || 'SCHEDULED').toUpperCase();
        return (
          <Tag
            color={s === 'COMPLETED' ? 'success' : s === 'CANCELLED' ? 'error' : 'processing'}
            style={{ borderRadius: 10, fontWeight: 600 }}
          >
            {s}
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Banner */}
      <Card
        bordered={false}
        style={{
          borderRadius: 14,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          marginBottom: 24,
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
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>
              Welcome back, {currentUser?.username || 'User'}!
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
              Here is your pet wellness, vaccination, and appointment overview.
            </p>
          </div>

          <Tag color="blue" style={{ borderRadius: 12, padding: '4px 14px', fontSize: 13, fontWeight: 600 }}>
            {isAdmin ? 'Administrator Mode' : 'Pet Care Portal'}
          </Tag>
        </div>
      </Card>

      {/* Main Metric Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Total Pets Card */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            hoverable
            onClick={() => handleNavigate('/pets')}
            style={{
              borderRadius: 14,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
              borderLeft: '4px solid #1677ff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Registered Pets
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                  {petCount} <span style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8' }}>/ {maxCapacity}</span>
                </div>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#e6f4ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1677ff',
                  fontSize: 22,
                }}
              >
                <HeartOutlined />
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <Progress percent={capacityPercent} showInfo={false} strokeColor="#1677ff" size="small" />
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                {capacityPercent}% capacity registered
              </div>
            </div>
          </Card>
        </Col>

        {/* Scheduled Appointments Card */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            hoverable
            onClick={() => handleNavigate('/appointments')}
            style={{
              borderRadius: 14,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
              borderLeft: '4px solid #fa8c16',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Upcoming Visits
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                  {scheduledAppts.length}
                </div>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#fff7e6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fa8c16',
                  fontSize: 22,
                }}
              >
                <CalendarOutlined />
              </div>
            </div>
            <div style={{ marginTop: 22, fontSize: 13, color: '#64748b' }}>
              Active clinic bookings scheduled
            </div>
          </Card>
        </Col>

        {/* Pending Vaccinations Card */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            hoverable
            onClick={() => handleNavigate('/vaccinations')}
            style={{
              borderRadius: 14,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
              borderLeft: '4px solid #52c41a',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Vaccines Pending
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                  {pendingVaccines.length}
                </div>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#f6ffed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#52c41a',
                  fontSize: 22,
                }}
              >
                <MedicineBoxOutlined />
              </div>
            </div>
            <div style={{ marginTop: 22, fontSize: 13, color: '#64748b' }}>
              Immunizations requiring booster
            </div>
          </Card>
        </Col>

        {/* Adoption Applications Card */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            hoverable
            onClick={() => handleNavigate('/adoption-requests')}
            style={{
              borderRadius: 14,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
              borderLeft: '4px solid #722ed1',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Adoptions In Review
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
                  {pendingAdoptions.length}
                </div>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#f9f0ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#722ed1',
                  fontSize: 22,
                }}
              >
                <ShopOutlined />
              </div>
            </div>
            <div style={{ marginTop: 22, fontSize: 13, color: '#64748b' }}>
              Applications awaiting approval
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Access & Appointments Table */}
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
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              Upcoming Schedule Overview
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748b' }}>
              Next planned consultations and health checkups
            </p>
          </div>

          <Button
            type="link"
            onClick={() => handleNavigate('/appointments')}
            style={{ fontWeight: 600, padding: 0, display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            View All Appointments <ArrowRightOutlined />
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin />
          </div>
        ) : (
          <Table
            rowKey="id"
            columns={appointmentColumns}
            dataSource={appointments.slice(0, 5)}
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;