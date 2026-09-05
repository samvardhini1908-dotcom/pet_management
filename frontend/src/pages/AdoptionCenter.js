import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Button, Modal, Empty, Spin, message, Typography } from 'antd';
import { useSelector } from 'react-redux';
import api from '../services/api';

const { Meta } = Card;
const { Text } = Typography;

const AdoptionCenter = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth?.user);

  const fetchAvailablePets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/pets/adoption');
      setPets(response.data || []);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to fetch adoption pets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailablePets();
  }, [fetchAvailablePets]);

  const handleAdoptClick = (pet) => {
    Modal.confirm({
      title: `Adopt ${pet.petName}?`,
      content: `Are you sure you want to submit an adoption request for ${pet.petName}?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          const payload = {
            pet: { id: pet.id },
            applicant: { id: user?.id },
            requestDate: new Date().toISOString(),
          };

          await api.post('/adoptions', payload);
          message.success('Adoption request sent successfully!');
          fetchAvailablePets();
        } catch (error) {
          message.error(error?.response?.data?.message || 'Failed to submit adoption request');
        }
      },
    });
  };

  return (
    <div style={{ padding: 24 }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : pets.length === 0 ? (
        <Empty description="No pets available for adoption at the moment." />
      ) : (
        <Row gutter={[16, 16]}>
          {pets.map((pet) => (
            <Col xs={24} sm={12} md={8} lg={6} key={pet.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={pet.petName}
                    src={pet.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Button type="primary" onClick={() => handleAdoptClick(pet)}>
                    Adopt
                  </Button>,
                ]}
              >
                <Meta
                  title={pet.petName}
                  description={
                    <div>
                      <div><Text strong>Species:</Text> {pet.species}</div>
                      {pet.breed && <div><Text strong>Breed:</Text> {pet.breed}</div>}
                      {pet.age !== undefined && <div><Text strong>Age:</Text> {pet.age} years</div>}
                      {pet.gender && <div><Text strong>Gender:</Text> {pet.gender}</div>}
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default AdoptionCenter;