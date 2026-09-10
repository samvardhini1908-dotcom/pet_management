import React, { useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Tag,
  Spin,
  Empty,
  message,
} from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import api from '../services/api';

const { Meta } = Card;
const { TextArea } = Input;

// Helper to provide species-appropriate fallbacks with Paw graphic for "other"
const getDefaultImage = (species) => {
  const s = (species || '').toLowerCase();

  if (s.includes('cat')) {
    return 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80';
  }

  if (s.includes('dog')) {
    return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
  }

  if (s.includes('bird')) {
    return 'https://images.unsplash.com/photo-1522926197415-e55c22c88c71?auto=format&fit=crop&w=600&q=80';
  }

  // "Other" / unknown: SVG Paw print graphic
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="none"><rect width="400" height="250" fill="%23e6f4ff"/><g fill="%231677ff" transform="translate(160, 85) scale(3.5)"><ellipse cx="8.5" cy="4.5" rx="1.8" ry="2.5"/><ellipse cx="15.5" cy="4.5" rx="1.8" ry="2.5"/><ellipse cx="4.5" cy="9.5" rx="1.8" ry="2.5"/><ellipse cx="19.5" cy="9.5" rx="1.8" ry="2.5"/><path d="M12 9.5c-3.2 0-5.5 2.5-5.5 5.5 0 2.2 1.8 4 4 4 .5 0 1-.1 1.5-.4.5.3 1 .4 1.5.4 2.2 0 4-1.8 4-4 0-3-2.3-5.5-5.5-5.5z"/></g></svg>`;
};

const AdoptionCenter = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  // Get current user safely from Redux or localStorage
  const reduxUser = useSelector((state) => state.auth?.user);
  let storedUser = null;
  try {
    storedUser = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;
  } catch (e) {
    storedUser = null;
  }

  const currentUser = reduxUser || storedUser;

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      // First attempt dedicated adoption endpoint, fallback to /pets
      let res;
      try {
        res = await api.get('/pets/adoption');
      } catch (e) {
        res = await api.get('/pets');
      }
      const petList = Array.isArray(res.data) ? res.data : [];
      const available = petList.filter((p) => p.availableForAdoption !== false);
      setPets(available);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to load adoption pets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleOpenAdoptModal = (pet) => {
    setSelectedPet(pet);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setSelectedPet(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    if (!selectedPet) return;
    setSubmitting(true);

    const nowIso = new Date().toISOString().split('T')[0];
    const userId = currentUser?.id || currentUser?.userId;

    // Comprehensive payload matching various Spring Boot Adoption models
    const payload = {
      petId: selectedPet.id,
      pet: { id: selectedPet.id },
      reason: values.reason,
      notes: values.reason,
      status: 'PENDING',
      requestDate: nowIso,
      applicationDate: nowIso,
      adoptionDate: nowIso,
    };

    if (userId) {
      payload.userId = userId;
      payload.user = { id: userId };
    }

    try {
      // Try standard adoption endpoints in succession
      let response;
      let errorOccurred = null;

      try {
        response = await api.post('/adoptions', payload);
      } catch (err1) {
        if (err1?.response?.status === 404 || err1?.response?.status === 405) {
          try {
            response = await api.post('/adoption-requests', payload);
          } catch (err2) {
            errorOccurred = err2;
          }
        } else {
          errorOccurred = err1;
        }
      }

      if (errorOccurred && !response) {
        throw errorOccurred;
      }

      message.success('Adoption request submitted successfully');
      setIsModalOpen(false);
      setSelectedPet(null);
      form.resetFields();
      fetchPets();
    } catch (error) {
      console.error('Adoption Submission Error:', error?.response || error);
      const serverMsg =
        error?.response?.data?.message ||
        (typeof error?.response?.data === 'string' ? error.response.data : null) ||
        'Failed to submit adoption request';
      message.error(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPets = pets.filter((pet) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (pet.petName && pet.petName.toLowerCase().includes(q)) ||
      (pet.breed && pet.breed.toLowerCase().includes(q)) ||
      (pet.species && pet.species.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Card */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>
                Adoption Center
              </h1>
              <Tag color="green" style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>
                {pets.length} Available
              </Tag>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
              Browse lovable rescues waiting for a permanent, caring home
            </p>
          </div>

          <div>
            <Input.Search
              placeholder="Search by name, breed, species..."
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 280 }}
            />
          </div>
        </div>
      </Card>

      {/* Pet Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      ) : filteredPets.length === 0 ? (
        <Card style={{ borderRadius: 14, textAlign: 'center', padding: 40 }}>
          <Empty description="No pets currently available for adoption" />
        </Card>
      ) : (
        <Row gutter={[20, 20]}>
          {filteredPets.map((pet) => (
            <Col xs={24} sm={12} md={8} lg={6} key={pet.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                  border: '1px solid #f1f5f9',
                }}
                cover={
                  <div style={{ position: 'relative', height: 180, overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                    <img
                      alt={pet.petName}
                      src={pet.imageUrl || getDefaultImage(pet.species)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getDefaultImage(pet.species);
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Tag
                      color="blue"
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        borderRadius: 10,
                        fontWeight: 600,
                      }}
                    >
                      {pet.species || 'Pet'}
                    </Tag>
                  </div>
                }
                actions={[
                  <Button
                    type="primary"
                    icon={<HeartOutlined />}
                    onClick={() => handleOpenAdoptModal(pet)}
                    style={{
                      borderRadius: 8,
                      fontWeight: 600,
                      width: '85%',
                    }}
                  >
                    Adopt Me
                  </Button>,
                ]}
              >
                <Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>{pet.petName}</span>
                      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                        {pet.age ? `${pet.age} yrs` : 'Young'}
                      </span>
                    </div>
                  }
                  description={
                    <div style={{ marginTop: 6, fontSize: 13, color: '#64748b' }}>
                      <div><strong>Breed:</strong> {pet.breed || 'Mixed'}</div>
                      <div><strong>Gender:</strong> {pet.gender || 'Unknown'}</div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Adoption Request Modal */}
      <Modal
        title={`Adopt ${selectedPet?.petName || 'Pet'}`}
        open={Boolean(isModalOpen)}
        visible={Boolean(isModalOpen)}
        onCancel={handleCancelModal}
        onOk={() => form.submit()}
        okText="Submit Request"
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          autoComplete="off"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="Reason for Adoption"
            name="reason"
            rules={[{ required: true, message: 'Please share your reason for adopting' }]}
          >
            <TextArea
              rows={4}
              placeholder="Tell us about your home environment, experience with pets, and daily schedule..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdoptionCenter;