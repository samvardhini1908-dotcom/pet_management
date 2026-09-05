import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Statistic, Progress, Spin, message } from 'antd';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../services/api'; // adjust path to your axios/api instance

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  // Metric Computations
  const totalPets = pets.length;
  const pendingVaccinations = vaccinations.filter((v) => v.status === 'PENDING').length;
  const pendingAdoptions = adoptions.filter((a) => a.status === 'PENDING').length;
  const shelterPetsCount = pets.filter((p) => p.shelter !== null && p.shelter !== undefined).length;
  const maxCapacity = 50;
  const capacityPercentage = Math.min(Math.round((shelterPetsCount / maxCapacity) * 100), 100);

  // Month bucket helper for Jan - Jun
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const getMonthlyCounts = (dataList, dateField) => {
    const counts = [0, 0, 0, 0, 0, 0];
    dataList.forEach((item) => {
      const rawDate = item[dateField];
      if (rawDate) {
        const d = new Date(rawDate);
        const monthIdx = d.getMonth(); // 0 = Jan, 5 = Jun
        if (monthIdx >= 0 && monthIdx <= 5) {
          counts[monthIdx] += 1;
        }
      }
    });
    return counts;
  };

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Vaccinations',
        data: getMonthlyCounts(vaccinations, 'vaccinationDate'),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Adoptions',
        data: getMonthlyCounts(adoptions, 'requestDate'),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Vaccinations & Adoptions Overview',
      },
    },
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Stat Cards */}
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

      {/* Shelter / Admin Capacity Progress Bar */}
      {isShelterOrAdmin && (
        <Card title="Shelter Capacity Status" style={{ marginTop: 24 }}>
          <Progress
            percent={capacityPercentage}
            status={capacityPercentage >= 90 ? 'exception' : 'active'}
            format={() => `${shelterPetsCount} / ${maxCapacity} Pets (${capacityPercentage}%)`}
          />
        </Card>
      )}

      {/* Bar Chart Section */}
      <Card title="Trends" style={{ marginTop: 24 }}>
        <div style={{ height: 350 }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;