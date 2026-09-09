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
  Badge,
  Spin,
  Empty,
  message,
} from 'antd';
import {
  HeartOutlined,
  HomeOutlined,
  SearchOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const { Meta } = Card;
const { TextArea } = Input;

const AdoptionCenter = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/pets');
      const petList = Array.isArray(response.data) ? response.data : [];
      // Show pets that are flagged available or have a shelter attached
      const available = petList.filter(
        (p) => p.availableForAdoption !== false
      );
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
    try {
      const payload = {
        petId: selectedPet.id,
        notes: values.notes,
        reason: values.reason || values.notes,
        status: 'PENDING',
      };
      // Fallback route support if backend uses /adoption-requests
      await api
        .post('/adoptions', payload)
        .catch(() => api.post('/adoption-requests', payload));

      message.success('Adoption request submitted successfully');
      setIsModalOpen(false);
      setSelectedPet(null);
      form.resetFields();
      fetchPets();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to submit adoption request');
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>
                Adoption Center
              </h1>
              <Tag color="green" style={{ borderRadius: 12, padding: '2px 10px', fontWeight: 600 }}>
                {pets.length} Pets Available
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

      {/* Grid of Adoptable Pets */}
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
                      src={
                        pet.imageUrl ||
                        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80'
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80';
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

      {/* Modal for Adoption Request */}
      <Modal
        title={`Adopt ${selectedPet?.petName || 'Pet'}`}
        open={Boolean(isModalOpen)}
        visible={Boolean(isModalOpen)}
        onCancel={handleCancelModal}
        onOk={() => form.submit()}
        okText="Submit Request"
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
            name="notes"
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