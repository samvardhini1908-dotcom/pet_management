// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   Table,
// //   Button,
// //   Modal,
// //   Form,
// //   Input,
// //   Select,
// //   DatePicker,
// //   Popconfirm,
// //   Card,
// //   Row,
// //   Col,
// //   Statistic,
// //   Tag,
// //   message,
// // } from 'antd';
// // import {
// //   PlusOutlined,
// //   EditOutlined,
// //   DeleteOutlined,
// //   CalendarOutlined,
// //   ClockCircleOutlined,
// //   CheckCircleOutlined,
// // } from '@ant-design/icons';
// // import dayjs from 'dayjs';
// // import api from '../services/api';

// // const { Option } = Select;
// // const { TextArea } = Input;

// // const AppointmentScheduler = () => {
// //   const [appointments, setAppointments] = useState([]);
// //   const [pets, setPets] = useState([]);
// //   const [vets, setVets] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [editingRecord, setEditingRecord] = useState(null);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [form] = Form.useForm();

// //   const fetchData = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       const [apptRes, petsRes, vetsRes] = await Promise.all([
// //         api.get('/appointments'),
// //         api.get('/pets').catch(() => ({ data: [] })),
// //         api.get('/auth/vets').catch(() => ({ data: [] })),
// //       ]);
// //       setAppointments(Array.isArray(apptRes.data) ? apptRes.data : []);
// //       setPets(Array.isArray(petsRes.data) ? petsRes.data : []);
// //       setVets(Array.isArray(vetsRes.data) ? vetsRes.data : []);
// //     } catch (error) {
// //       message.error(error?.response?.data?.message || 'Failed to fetch appointments');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     fetchData();
// //   }, [fetchData]);

// //   const handleOpenAddModal = () => {
// //     setEditingRecord(null);
// //     form.resetFields();
// //     setIsModalOpen(true);
// //   };

// //   const handleOpenEditModal = (record) => {
// //     setEditingRecord(record);
// //     form.setFieldsValue({
// //       petId: record.pet?.id || record.petId,
// //       vetId: record.vet?.id || record.vetId,
// //       appointmentDate: record.appointmentDate ? dayjs(record.appointmentDate) : null,
// //       reason: record.reason,
// //       status: record.status || 'SCHEDULED',
// //     });
// //     setIsModalOpen(true);
// //   };

// //   const handleCancelModal = () => {
// //     setIsModalOpen(false);
// //     setEditingRecord(null);
// //     form.resetFields();
// //   };

// //   const handleFormSubmit = async (values) => {
// //     const payload = {
// //       ...values,
// //       appointmentDate: values.appointmentDate
// //         ? values.appointmentDate.format('YYYY-MM-DDTHH:mm:ss')
// //         : null,
// //     };

// //     try {
// //       if (editingRecord) {
// //         await api.put(`/appointments/${editingRecord.id}`, payload);
// //         message.success('Appointment updated successfully');
// //       } else {
// //         await api.post('/appointments', payload);
// //         message.success('Appointment booked successfully');
// //       }
// //       setIsModalOpen(false);
// //       setEditingRecord(null);
// //       form.resetFields();
// //       fetchData();
// //     } catch (error) {
// //       message.error(error?.response?.data?.message || 'Operation failed');
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     try {
// //       await api.delete(`/appointments/${id}`);
// //       message.success('Appointment cancelled successfully');
// //       fetchData();
// //     } catch (error) {
// //       message.error(error?.response?.data?.message || 'Failed to delete appointment');
// //     }
// //   };

// //   const getStatusTag = (status) => {
// //     const s = (status || '').toUpperCase();
// //     if (s === 'COMPLETED') {
// //       return <Tag color="success" style={{ borderRadius: 12 }}>COMPLETED</Tag>;
// //     }
// //     if (s === 'CANCELLED') {
// //       return <Tag color="error" style={{ borderRadius: 12 }}>CANCELLED</Tag>;
// //     }
// //     return <Tag color="processing" style={{ borderRadius: 12 }}>SCHEDULED</Tag>;
// //   };

// //   const columns = [
// //     {
// //       title: 'Pet Name',
// //       dataIndex: 'petName',
// //       key: 'petName',
// //       render: (text, record) => (
// //         <span style={{ fontWeight: 600, color: '#0f172a' }}>
// //           {text || record.pet?.petName || 'Bruno'}
// //         </span>
// //       ),
// //     },
// //     {
// //       title: 'Veterinarian',
// //       dataIndex: 'vetName',
// //       key: 'vetName',
// //       render: (text, record) => (
// //         <span style={{ color: '#334155' }}>
// //           {text || record.vet?.fullName || record.vet?.username || 'Dr. Vet'}
// //         </span>
// //       ),
// //     },
// //     {
// //       title: 'Date & Time',
// //       dataIndex: 'appointmentDate',
// //       key: 'appointmentDate',
// //       render: (date) => (
// //         <span style={{ color: '#64748b' }}>
// //           {date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '—'}
// //         </span>
// //       ),
// //     },
// //     {
// //       title: 'Reason',
// //       dataIndex: 'reason',
// //       key: 'reason',
// //       render: (text) => <span style={{ color: '#475569' }}>{text || 'Checkup'}</span>,
// //     },
// //     {
// //       title: 'Status',
// //       dataIndex: 'status',
// //       key: 'status',
// //       render: (status) => getStatusTag(status),
// //     },
// //     {
// //       title: 'Actions',
// //       key: 'actions',
// //       render: (_, record) => (
// //         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// //           <Button
// //             type="link"
// //             icon={<EditOutlined />}
// //             onClick={() => handleOpenEditModal(record)}
// //             style={{ fontWeight: 500, padding: '4px 8px' }}
// //           >
// //             Edit
// //           </Button>
// //           <Popconfirm
// //             title="Are you sure you want to cancel this appointment?"
// //             onConfirm={() => handleDelete(record.id)}
// //             okText="Yes"
// //             cancelText="No"
// //           >
// //             <Button
// //               type="link"
// //               danger
// //               icon={<DeleteOutlined />}
// //               style={{ fontWeight: 500, padding: '4px 8px' }}
// //             >
// //               Cancel
// //             </Button>
// //           </Popconfirm>
// //         </div>
// //       ),
// //     },
// //   ];

// //   const scheduledCount = appointments.filter((a) => a.status === 'SCHEDULED').length;

// //   const filteredAppointments = appointments.filter((a) => {
// //     if (!searchQuery) return true;
// //     const q = searchQuery.toLowerCase();
// //     const petName = (a.petName || a.pet?.petName || '').toLowerCase();
// //     const reason = (a.reason || '').toLowerCase();
// //     return petName.includes(q) || reason.includes(q);
// //   });

// //   return (
// //     <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
// //       {/* Metrics Row */}
// //       <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
// //         <Col xs={24} sm={12}>
// //           <Card
// //             bordered={false}
// //             style={{
// //               borderRadius: 12,
// //               boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
// //               borderLeft: '4px solid #1890ff',
// //             }}
// //             bodyStyle={{ padding: '16px 20px' }}
// //           >
// //             <Statistic
// //               title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>TOTAL APPOINTMENTS</span>}
// //               value={appointments.length}
// //               prefix={<CalendarOutlined style={{ color: '#1890ff', marginRight: 8 }} />}
// //               valueStyle={{ fontWeight: 700, color: '#0f172a' }}
// //             />
// //           </Card>
// //         </Col>
// //         <Col xs={24} sm={12}>
// //           <Card
// //             bordered={false}
// //             style={{
// //               borderRadius: 12,
// //               boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
// //               borderLeft: '4px solid #fa8c16',
// //             }}
// //             bodyStyle={{ padding: '16px 20px' }}
// //           >
// //             <Statistic
// //               title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>UPCOMING SCHEDULES</span>}
// //               value={scheduledCount}
// //               prefix={<ClockCircleOutlined style={{ color: '#fa8c16', marginRight: 8 }} />}
// //               valueStyle={{ fontWeight: 700, color: '#0f172a' }}
// //             />
// //           </Card>
// //         </Col>
// //       </Row>

// //       {/* Main Table Card */}
// //       <Card
// //         bordered={false}
// //         style={{
// //           borderRadius: 14,
// //           boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
// //         }}
// //         bodyStyle={{ padding: '24px 28px' }}
// //       >
// //         <div
// //           style={{
// //             display: 'flex',
// //             justifyContent: 'space-between',
// //             alignItems: 'center',
// //             flexWrap: 'wrap',
// //             gap: 16,
// //             marginBottom: 24,
// //             paddingBottom: 16,
// //             borderBottom: '1px solid #f1f5f9',
// //           }}
// //         >
// //           <div>
// //             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
// //               <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
// //                 Appointment Scheduler
// //               </h2>
// //               <Tag color="blue" style={{ borderRadius: 12, padding: '1px 10px', fontWeight: 600 }}>
// //                 {appointments.length} Scheduled
// //               </Tag>
// //             </div>
// //             <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
// //               Book clinic visits, consults, and recurring checkups
// //             </p>
// //           </div>

// //           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
// //             <Input.Search
// //               placeholder="Search pet or reason..."
// //               allowClear
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //               style={{ width: 240 }}
// //             />
// //             <Button
// //               type="primary"
// //               icon={<PlusOutlined />}
// //               onClick={handleOpenAddModal}
// //               style={{
// //                 borderRadius: 8,
// //                 fontWeight: 600,
// //                 height: 38,
// //                 padding: '0 18px',
// //               }}
// //             >
// //               Book Appointment
// //             </Button>
// //           </div>
// //         </div>

// //         <Table
// //           rowKey="id"
// //           columns={columns}
// //           dataSource={filteredAppointments}
// //           loading={loading}
// //           pagination={{
// //             pageSize: 8,
// //             showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} appointments`,
// //           }}
// //         />
// //       </Card>

// //       {/* Modal for Book / Edit */}
// //       <Modal
// //         title={editingRecord ? 'Edit Appointment' : 'Book Appointment'}
// //         open={Boolean(isModalOpen)}
// //         visible={Boolean(isModalOpen)}
// //         onCancel={handleCancelModal}
// //         onOk={() => form.submit()}
// //         okText={editingRecord ? 'Update' : 'Book'}
// //         destroyOnClose
// //       >
// //         <Form
// //           form={form}
// //           layout="vertical"
// //           onFinish={handleFormSubmit}
// //           autoComplete="off"
// //           style={{ marginTop: 16 }}
// //         >
// //           <Form.Item
// //             label="Pet"
// //             name="petId"
// //             rules={[{ required: true, message: 'Please select a pet' }]}
// //           >
// //             <Select placeholder="Select pet">
// //               {pets.map((p) => (
// //                 <Option key={p.id} value={p.id}>
// //                   {p.petName}
// //                 </Option>
// //               ))}
// //               {pets.length === 0 && <Option value={1}>Bruno</Option>}
// //             </Select>
// //           </Form.Item>

// //           <Form.Item
// //             label="Veterinarian"
// //             name="vetId"
// //             rules={[{ required: true, message: 'Please select a veterinarian' }]}
// //           >
// //             <Select placeholder="Select vet">
// //               {vets.map((v) => (
// //                 <Option key={v.id} value={v.id}>
// //                   {v.fullName || v.username}
// //                 </Option>
// //               ))}
// //               {vets.length === 0 && <Option value={1}>Dr. Vet</Option>}
// //             </Select>
// //           </Form.Item>

// //           <Form.Item
// //             label="Appointment Date"
// //             name="appointmentDate"
// //             rules={[{ required: true, message: 'Please choose appointment date' }]}
// //           >
// //             <DatePicker showTime style={{ width: '100%' }} />
// //           </Form.Item>

// //           <Form.Item
// //             label="Reason"
// //             name="reason"
// //             rules={[{ required: true, message: 'Please state the reason' }]}
// //           >
// //             <TextArea rows={2} placeholder="e.g. Annual vaccination checkup" />
// //           </Form.Item>

// //           {editingRecord && (
// //             <Form.Item label="Status" name="status">
// //               <Select>
// //                 <Option value="SCHEDULED">SCHEDULED</Option>
// //                 <Option value="COMPLETED">COMPLETED</Option>
// //                 <Option value="CANCELLED">CANCELLED</Option>
// //               </Select>
// //             </Form.Item>
// //           )}
// //         </Form>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default AppointmentScheduler;

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   Select,
//   DatePicker,
//   Popconfirm,
//   Tag,
//   Card,
//   Row,
//   Col,
//   message,
// } from 'antd';
// import {
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   CalendarOutlined,
//   ClockCircleOutlined,
//   CheckCircleOutlined,
// } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import api from '../services/api';

// const { Option } = Select;
// const { TextArea } = Input;

// const AppointmentScheduler = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [pets, setPets] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingRecord, setEditingRecord] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [form] = Form.useForm();

//   // 1. Fetch pets to resolve pet names and populate dropdown options
//   const fetchPets = useCallback(async () => {
//     try {
//       const res = await api.get('/pets');
//       setPets(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error('Failed to load pets:', err);
//     }
//   }, []);

//   // 2. Fetch appointments
//   const fetchAppointments = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/appointments');
//       setAppointments(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       message.error(err?.response?.data?.message || 'Failed to fetch appointments');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPets();
//     fetchAppointments();
//   }, [fetchPets, fetchAppointments]);

//   // Helper to reliably extract pet name
//   const resolvePetName = (record) => {
//     if (!record) return '—';
//     if (record.pet?.petName) return record.pet.petName;
//     if (typeof record.pet === 'string') return record.pet;
//     if (record.petName && record.petName !== '—') return record.petName;

//     const matched = pets.find(
//       (p) => String(p.id) === String(record.pet?.id || record.petId)
//     );
//     if (matched?.petName) return matched.petName;

//     return '—';
//   };

//   // Helper to safely extract veterinarian name as string
//   const resolveVetName = (val) => {
//     if (!val) return 'Dr. Vet';
//     if (typeof val === 'string') return val;
//     if (typeof val === 'object') {
//       return val.fullName || val.username || val.name || 'Dr. Vet';
//     }
//     return 'Dr. Vet';
//   };

//   const handleOpenCreateModal = () => {
//     setEditingRecord(null);
//     form.resetFields();
//     form.setFieldsValue({
//       status: 'SCHEDULED',
//       appointmentDate: dayjs().add(1, 'day'),
//       veterinarian: 'Dr. Vet',
//       petId: pets.length > 0 ? pets[0].id : undefined,
//     });
//     setIsModalOpen(true);
//   };

//   const handleOpenEditModal = (record) => {
//     setEditingRecord(record);

//     // Resolve pet ID
//     const resolvedPetId =
//       record.pet?.id ||
//       record.petId ||
//       pets.find((p) => p.petName === resolvePetName(record))?.id ||
//       (pets.length > 0 ? pets[0].id : undefined);

//     const rawDate = record.appointmentDate || record.dateTime || record.date;

//     form.setFieldsValue({
//       petId: resolvedPetId,
//       veterinarian: resolveVetName(record.veterinarian || record.doctorName),
//       appointmentDate: rawDate ? dayjs(rawDate) : null,
//       reason: record.reason || record.notes || '',
//       status: record.status || 'SCHEDULED',
//     });

//     setIsModalOpen(true);
//   };

//   const handleCancelModal = () => {
//     setIsModalOpen(false);
//     setEditingRecord(null);
//     form.resetFields();
//   };

//   const handleFormSubmit = async (values) => {
//     // 1. Locate selected pet
//     const selectedPet = pets.find(
//       (p) => String(p.id) === String(values.petId) || p.petName === values.petId
//     );

//     const targetPetId = selectedPet ? selectedPet.id : values.petId;
//     const targetPetName = selectedPet ? selectedPet.petName : '';

//     // 2. Format ISO 8601 for Spring Boot LocalDateTime and Date
//     const rawDate = values.appointmentDate;
//     const formattedIso = rawDate ? dayjs(rawDate).format('YYYY-MM-DDTHH:mm:ss') : null;
//     const formattedDateOnly = rawDate ? dayjs(rawDate).format('YYYY-MM-DD') : null;

//     // 3. Build comprehensive payload matching both relational and flat entities
//     const payload = {
//       ...(editingRecord || {}),
//       id: editingRecord?.id,
//       pet: selectedPet
//         ? { id: selectedPet.id, petName: selectedPet.petName }
//         : { id: targetPetId },
//       petId: targetPetId,
//       petName: targetPetName,
//       veterinarian: values.veterinarian || 'Dr. Vet',
//       doctorName: values.veterinarian || 'Dr. Vet',
//       appointmentDate: formattedIso,
//       dateTime: formattedIso,
//       date: formattedDateOnly,
//       reason: values.reason,
//       notes: values.reason,
//       status: values.status || 'SCHEDULED',
//     };

//     try {
//       if (editingRecord) {
//         let updateSuccess = false;
//         let lastError = null;

//         // Try standard PUT /appointments/{id}
//         try {
//           await api.put(`/appointments/${editingRecord.id}`, payload);
//           updateSuccess = true;
//         } catch (err1) {
//           lastError = err1;

//           // Try POST /appointments/{id} or POST /appointments fallback
//           try {
//             await api.post(`/appointments/${editingRecord.id}`, payload);
//             updateSuccess = true;
//           } catch (err2) {
//             lastError = err2;

//             try {
//               await api.post('/appointments', payload);
//               updateSuccess = true;
//             } catch (err3) {
//               lastError = err3;
//             }
//           }
//         }

//         if (!updateSuccess) {
//           throw lastError;
//         }

//         message.success('Appointment updated successfully');
//       } else {
//         await api.post('/appointments', payload);
//         message.success('Appointment booked successfully');
//       }

//       setIsModalOpen(false);
//       setEditingRecord(null);
//       form.resetFields();
//       fetchAppointments();
//     } catch (error) {
//       console.error('Appointment submit error:', error?.response || error);
//       const serverMsg =
//         error?.response?.data?.message ||
//         (typeof error?.response?.data === 'string' ? error.response.data : null) ||
//         'Operation failed';
//       message.error(serverMsg);
//     }
//   };

//   const handleDelete = async (record) => {
//     const id = typeof record === 'object' ? record.id : record;
//     let success = false;
//     let lastError = null;

//     // 1. Try standard DELETE /appointments/{id}
//     try {
//       await api.delete(`/appointments/${id}`);
//       success = true;
//     } catch (err1) {
//       lastError = err1;

//       // 2. Fallback: Check if backend uses soft-delete via status update to CANCELLED
//       if (typeof record === 'object') {
//         try {
//           await api.put(`/appointments/${id}`, {
//             ...record,
//             status: 'CANCELLED',
//           });
//           success = true;
//         } catch (err2) {
//           lastError = err2;

//           try {
//             await api.put(`/appointments/${id}/status?status=CANCELLED`);
//             success = true;
//           } catch (err3) {
//             lastError = err3;
//           }
//         }
//       }
//     }

//     if (success) {
//       message.success('Appointment cancelled successfully');
//       fetchAppointments();
//     } else {
//       console.error('Appointment delete error:', lastError?.response || lastError);
//       const serverMsg =
//         lastError?.response?.data?.message ||
//         (typeof lastError?.response?.data === 'string' ? lastError.response.data : null) ||
//         'Failed to cancel appointment';
//       message.error(serverMsg);
//     }
//   };

//   const getStatusTag = (status) => {
//     const s = (status || 'SCHEDULED').toUpperCase();
//     if (s === 'COMPLETED') {
//       return (
//         <Tag color="success" style={{ borderRadius: 12, fontWeight: 600, padding: '2px 10px' }}>
//           COMPLETED
//         </Tag>
//       );
//     }
//     if (s === 'CANCELLED') {
//       return (
//         <Tag color="error" style={{ borderRadius: 12, fontWeight: 600, padding: '2px 10px' }}>
//           CANCELLED
//         </Tag>
//       );
//     }
//     return (
//       <Tag color="processing" style={{ borderRadius: 12, fontWeight: 600, padding: '2px 10px' }}>
//         SCHEDULED
//       </Tag>
//     );
//   };

//   const columns = [
//     {
//       title: 'Pet Name',
//       key: 'petName',
//       render: (_, record) => (
//         <span style={{ fontWeight: 600, color: '#0f172a' }}>
//           {resolvePetName(record)}
//         </span>
//       ),
//     },
//     {
//       title: 'Veterinarian',
//       key: 'veterinarian',
//       render: (_, record) => (
//         <span style={{ color: '#334155', fontWeight: 500 }}>
//           {resolveVetName(record.veterinarian || record.doctorName)}
//         </span>
//       ),
//     },
//     {
//       title: 'Appointment Date',
//       key: 'appointmentDate',
//       render: (_, record) => {
//         const rawDate = record.appointmentDate || record.dateTime || record.date;
//         return (
//           <span style={{ color: '#64748b' }}>
//             {rawDate ? dayjs(rawDate).format('YYYY-MM-DD HH:mm') : '—'}
//           </span>
//         );
//       },
//     },
//     {
//       title: 'Reason',
//       dataIndex: 'reason',
//       key: 'reason',
//       render: (text) => (
//         <span style={{ color: '#64748b', maxWidth: 220, display: 'inline-block' }}>
//           {typeof text === 'string' ? text : '—'}
//         </span>
//       ),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => getStatusTag(status),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <div style={{ display: 'flex', gap: 8 }}>
//           <Button
//             type="link"
//             icon={<EditOutlined />}
//             onClick={() => handleOpenEditModal(record)}
//             style={{ fontWeight: 500, padding: '4px 8px' }}
//           >
//             Edit
//           </Button>
//           <Popconfirm
//             title="Are you sure you want to cancel this appointment?"
//             onConfirm={() => handleDelete(record)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button
//               type="link"
//               danger
//               icon={<DeleteOutlined />}
//               style={{ fontWeight: 500, padding: '4px 8px' }}
//             >
//               Cancel
//             </Button>
//           </Popconfirm>
//         </div>
//       ),
//     },
//   ];

//   const filteredAppointments = appointments.filter((a) => {
//     if (!searchQuery) return true;
//     const q = searchQuery.toLowerCase();
//     const petName = resolvePetName(a).toLowerCase();
//     const vet = resolveVetName(a.veterinarian || a.doctorName).toLowerCase();
//     const reason = (typeof a.reason === 'string' ? a.reason : '').toLowerCase();
//     return petName.includes(q) || vet.includes(q) || reason.includes(q);
//   });

//   const scheduledCount = appointments.filter(
//     (a) => (a.status || 'SCHEDULED').toUpperCase() === 'SCHEDULED'
//   ).length;

//   const completedCount = appointments.filter(
//     (a) => (a.status || '').toUpperCase() === 'COMPLETED'
//   ).length;

//   return (
//     <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
//       {/* Metric Cards */}
//       <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
//         <Col xs={24} sm={8}>
//           <Card bordered={false} style={{ borderRadius: 12, borderLeft: '4px solid #1677ff' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//               <CalendarOutlined style={{ fontSize: 24, color: '#1677ff' }} />
//               <div>
//                 <div style={{ fontSize: 13, color: '#64748b' }}>TOTAL APPOINTMENTS</div>
//                 <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{appointments.length}</div>
//               </div>
//             </div>
//           </Card>
//         </Col>
//         <Col xs={24} sm={8}>
//           <Card bordered={false} style={{ borderRadius: 12, borderLeft: '4px solid #fa8c16' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//               <ClockCircleOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
//               <div>
//                 <div style={{ fontSize: 13, color: '#64748b' }}>SCHEDULED</div>
//                 <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{scheduledCount}</div>
//               </div>
//             </div>
//           </Card>
//         </Col>
//         <Col xs={24} sm={8}>
//           <Card bordered={false} style={{ borderRadius: 12, borderLeft: '4px solid #52c41a' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//               <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
//               <div>
//                 <div style={{ fontSize: 13, color: '#64748b' }}>COMPLETED</div>
//                 <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{completedCount}</div>
//               </div>
//             </div>
//           </Card>
//         </Col>
//       </Row>

//       {/* Main Table Card */}
//       <Card
//         bordered={false}
//         style={{ borderRadius: 14, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}
//         bodyStyle={{ padding: '24px 28px' }}
//       >
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             flexWrap: 'wrap',
//             gap: 16,
//             marginBottom: 24,
//             paddingBottom: 16,
//             borderBottom: '1px solid #f1f5f9',
//           }}
//         >
//           <div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//               <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
//                 Appointment Scheduler
//               </h2>
//               <Tag color="blue" style={{ borderRadius: 12, padding: '1px 10px', fontWeight: 600 }}>
//                 {appointments.length} Total
//               </Tag>
//             </div>
//             <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
//               Book clinic visits, consults, and recurring checkups
//             </p>
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <Input.Search
//               placeholder="Search pet or reason..."
//               allowClear
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={{ width: 240 }}
//             />
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={handleOpenCreateModal}
//               style={{ borderRadius: 8, fontWeight: 600, height: 38 }}
//             >
//               Book Appointment
//             </Button>
//           </div>
//         </div>

//         <Table
//           rowKey="id"
//           columns={columns}
//           dataSource={filteredAppointments}
//           loading={loading}
//           pagination={{
//             pageSize: 8,
//             showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} appointments`,
//           }}
//         />
//       </Card>

//       {/* Edit / Book Modal */}
//       <Modal
//         title={editingRecord ? 'Edit Appointment' : 'Book Appointment'}
//         open={Boolean(isModalOpen)}
//         visible={Boolean(isModalOpen)}
//         onCancel={handleCancelModal}
//         onOk={() => form.submit()}
//         okText={editingRecord ? 'Update' : 'Book'}
//         destroyOnClose
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleFormSubmit}
//           autoComplete="off"
//           style={{ marginTop: 16 }}
//         >
//           <Form.Item
//             label="Pet"
//             name="petId"
//             rules={[{ required: true, message: 'Please select a pet' }]}
//           >
//             <Select placeholder="Select a pet">
//               {pets.map((pet) => (
//                 <Option key={pet.id} value={pet.id}>
//                   {pet.petName}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Veterinarian"
//             name="veterinarian"
//             rules={[{ required: true, message: 'Please enter veterinarian' }]}
//           >
//             <Select placeholder="Select veterinarian">
//               <Option value="Dr. Vet">Dr. Vet</Option>
//               <Option value="Doctor Vet">Doctor Vet</Option>
//               <Option value="Dr. Sarah Johnson">Dr. Sarah Johnson</Option>
//               <Option value="Dr. Michael Lee">Dr. Michael Lee</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Appointment Date & Time"
//             name="appointmentDate"
//             rules={[{ required: true, message: 'Please select appointment date and time' }]}
//           >
//             <DatePicker
//               showTime
//               style={{ width: '100%' }}
//               format="YYYY-MM-DD HH:mm:ss"
//             />
//           </Form.Item>

//           <Form.Item
//             label="Reason"
//             name="reason"
//             rules={[{ required: true, message: 'Please provide a reason' }]}
//           >
//             <TextArea rows={3} placeholder="Routine checkup, vaccinations, symptoms..." />
//           </Form.Item>

//           <Form.Item label="Status" name="status">
//             <Select placeholder="Select status">
//               <Option value="SCHEDULED">SCHEDULED</Option>
//               <Option value="COMPLETED">COMPLETED</Option>
//               <Option value="CANCELLED">CANCELLED</Option>
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AppointmentScheduler;

import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

const { Option } = Select;
const { TextArea } = Input;

// Guaranteed default entries based on your database
const BASE_VETS = [
  { id: 3, fullName: 'Doctor Vet', username: 'vet', role: 'ROLE_VET' },
  { id: 4, fullName: 'saran', username: 'saran', role: 'ROLE_VET' },
];

const AppointmentScheduler = () => {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState(BASE_VETS);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  // Helper to extract clean veterinarian name string
  const resolveVetName = (val) => {
    if (!val) return 'Doctor Vet';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      return val.fullName || val.username || val.name || 'Doctor Vet';
    }
    return 'Doctor Vet';
  };

  // Helper to extract pet name
  const resolvePetName = (record) => {
    if (!record) return '—';
    if (record.pet?.petName) return record.pet.petName;
    if (typeof record.pet === 'string') return record.pet;
    if (record.petName && record.petName !== '—') return record.petName;

    const matched = pets.find(
      (p) => String(p.id) === String(record.pet?.id || record.petId)
    );
    if (matched?.petName) return matched.petName;

    return '—';
  };

  // 1. Fetch pets
  const fetchPets = useCallback(async () => {
    try {
      const res = await api.get('/pets');
      const petList = Array.isArray(res.data) ? res.data : (res.data?.content || []);
      setPets(petList);
    } catch (err) {
      console.error('Failed to load pets:', err);
    }
  }, []);

  // 2. Fetch veterinarians with robust fallback against 403 errors
  const fetchVets = useCallback(async () => {
    let loadedUsers = [];

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await api.get('/users', { headers });
      loadedUsers = Array.isArray(res.data) ? res.data : (res.data?.content || []);
    } catch (err) {
      console.warn('Backend /api/users 403: falling back to base veterinarians and appointment history');
    }

    // Merge base known vets with any returned from backend
    const combined = [...BASE_VETS];

    if (Array.isArray(loadedUsers) && loadedUsers.length > 0) {
      loadedUsers.forEach((u) => {
        const role = String(u.role || '').toUpperCase();
        if (role.includes('VET') || !role.includes('ADMIN')) {
          const exists = combined.some(
            (c) =>
              String(c.id) === String(u.id) ||
              resolveVetName(c).toLowerCase() === resolveVetName(u).toLowerCase()
          );
          if (!exists) combined.push(u);
        }
      });
    }

    setVets(combined);
  }, []);

  // 3. Fetch appointments
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments');
      const list = Array.isArray(res.data) ? res.data : (res.data?.content || []);
      setAppointments(list);

      // Extract any extra veterinarians already appearing in existing appointments
      setVets((prev) => {
        const updated = [...prev];
        list.forEach((app) => {
          if (app.veterinarian) {
            const vName = resolveVetName(app.veterinarian);
            const exists = updated.some((item) => resolveVetName(item).toLowerCase() === vName.toLowerCase());
            if (!exists && vName !== '—') {
              updated.push({
                id: app.veterinarian.id || `dyn-${vName}`,
                fullName: vName,
                username: vName,
                role: 'ROLE_VET',
              });
            }
          }
        });
        return updated;
      });
    } catch (err) {
      message.error(err?.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
    fetchVets();
    fetchAppointments();
  }, [fetchPets, fetchVets, fetchAppointments]);

  // Open Create Modal
  const handleOpenCreateModal = async () => {
    setEditingRecord(null);
    form.resetFields();
    await fetchVets();
    await fetchPets();

    form.setFieldsValue({
      status: 'SCHEDULED',
      appointmentDate: dayjs().add(1, 'day'),
      veterinarianId: vets[0]?.id || 3,
      petId: pets.length > 0 ? pets[0].id : undefined,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = async (record) => {
    setEditingRecord(record);
    await fetchVets();

    const resolvedPetId =
      record.pet?.id ||
      record.petId ||
      pets.find((p) => p.petName === resolvePetName(record))?.id ||
      undefined;

    const currentVetName = resolveVetName(record.veterinarian);
    const matchedVet = vets.find(
      (v) =>
        String(v.id) === String(record.veterinarian?.id) ||
        resolveVetName(v).toLowerCase() === currentVetName.toLowerCase()
    );

    const rawDate = record.appointmentDate || record.dateTime;

    form.setFieldsValue({
      petId: resolvedPetId,
      veterinarianId: matchedVet ? matchedVet.id : (vets[0]?.id || 3),
      appointmentDate: rawDate ? dayjs(rawDate) : dayjs().add(1, 'day'),
      purpose: record.purpose || record.reason || '',
      status: record.status || 'SCHEDULED',
    });

    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    const selectedPet = pets.find(
      (p) => String(p.id) === String(values.petId) || p.petName === values.petId
    );
    const targetPetId = selectedPet ? selectedPet.id : values.petId;

    const selectedVet = vets.find(
      (v) => String(v.id) === String(values.veterinarianId) || resolveVetName(v) === values.veterinarianId
    );

    const isoDateTime = values.appointmentDate
      ? dayjs(values.appointmentDate).format('YYYY-MM-DDTHH:mm:ss')
      : dayjs().format('YYYY-MM-DDTHH:mm:ss');

    const payload = {
      id: editingRecord?.id,
      pet: targetPetId ? { id: targetPetId } : null,
      veterinarian: selectedVet
        ? {
            id: typeof selectedVet.id === 'number' ? selectedVet.id : null,
            username: selectedVet.username || selectedVet.fullName,
            fullName: selectedVet.fullName || selectedVet.username,
          }
        : { id: 3, username: 'vet', fullName: 'Doctor Vet' },
      appointmentDate: isoDateTime,
      purpose: values.purpose,
      reason: values.purpose,
      status: values.status || 'SCHEDULED',
    };

    try {
      if (editingRecord) {
        let success = false;
        let lastError = null;

        try {
          await api.put(`/appointments/${editingRecord.id}`, payload);
          success = true;
        } catch (err1) {
          lastError = err1;
          try {
            await api.put(
              `/appointments/${editingRecord.id}?status=${values.status || 'SCHEDULED'}`
            );
            success = true;
          } catch (err2) {
            lastError = err2;
          }
        }

        if (!success) throw lastError;
        message.success('Appointment updated successfully');
      } else {
        await api.post('/appointments', payload);
        message.success('Appointment booked successfully');
      }

      setIsModalOpen(false);
      setEditingRecord(null);
      form.resetFields();
      fetchAppointments();
    } catch (error) {
      console.error('Appointment submit error:', error?.response || error);
      const serverMsg =
        error?.response?.data?.message ||
        (typeof error?.response?.data === 'string' ? error.response.data : null) ||
        'Operation failed';
      message.error(serverMsg);
    }
  };

  const handleDelete = async (record) => {
    const id = typeof record === 'object' ? record.id : record;
    let success = false;
    let lastError = null;

    try {
      await api.delete(`/appointments/${id}`);
      success = true;
    } catch (err1) {
      lastError = err1;
      try {
        await api.put(`/appointments/${id}?status=CANCELLED`);
        success = true;
      } catch (err2) {
        lastError = err2;
      }
    }

    if (success) {
      message.success('Appointment cancelled successfully');
      fetchAppointments();
    } else {
      console.error('Appointment delete error:', lastError?.response || lastError);
      message.error('Failed to cancel appointment');
    }
  };

  const getStatusTag = (status) => {
    const s = (status || 'SCHEDULED').toUpperCase();
    if (s === 'COMPLETED') {
      return (
        <Tag color="success" style={{ borderRadius: 12, fontWeight: 600, padding: '2px 10px' }}>
          COMPLETED
        </Tag>
      );
    }
    if (s === 'CANCELLED') {
      return (
        <Tag color="error" style={{ borderRadius: 12, fontWeight: 600, padding: '2px 10px' }}>
          CANCELLED
        </Tag>
      );
    }
    return (
      <Tag color="processing" style={{ borderRadius: 12, fontWeight: 600, padding: '2px 10px' }}>
        SCHEDULED
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Pet Name',
      key: 'petName',
      render: (_, record) => (
        <span style={{ fontWeight: 600, color: '#0f172a' }}>
          {resolvePetName(record)}
        </span>
      ),
    },
    {
      title: 'Veterinarian',
      key: 'veterinarian',
      render: (_, record) => (
        <span style={{ color: '#334155', fontWeight: 500 }}>
          {resolveVetName(record.veterinarian)}
        </span>
      ),
    },
    {
      title: 'Appointment Date',
      key: 'appointmentDate',
      render: (_, record) => {
        const rawDate = record.appointmentDate || record.dateTime;
        return (
          <span style={{ color: '#64748b' }}>
            {rawDate ? dayjs(rawDate).format('YYYY-MM-DD HH:mm') : '—'}
          </span>
        );
      },
    },
    {
      title: 'Reason / Purpose',
      key: 'purpose',
      render: (_, record) => (
        <span style={{ color: '#64748b', maxWidth: 220, display: 'inline-block' }}>
          {record.purpose || record.reason || '—'}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
            style={{ fontWeight: 500, padding: '4px 8px' }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to cancel this appointment?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              style={{ fontWeight: 500, padding: '4px 8px' }}
            >
              Cancel
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const filteredAppointments = appointments.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const petName = resolvePetName(a).toLowerCase();
    const vet = resolveVetName(a.veterinarian).toLowerCase();
    const purpose = (a.purpose || a.reason || '').toLowerCase();
    return petName.includes(q) || vet.includes(q) || purpose.includes(q);
  });

  const scheduledCount = appointments.filter(
    (a) => (a.status || 'SCHEDULED').toUpperCase() === 'SCHEDULED'
  ).length;

  const completedCount = appointments.filter(
    (a) => (a.status || '').toUpperCase() === 'COMPLETED'
  ).length;

  return (
    <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Metric Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, borderLeft: '4px solid #1677ff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CalendarOutlined style={{ fontSize: 24, color: '#1677ff' }} />
              <div>
                <div style={{ fontSize: 13, color: '#64748b' }}>TOTAL APPOINTMENTS</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{appointments.length}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, borderLeft: '4px solid #fa8c16' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ClockCircleOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              <div>
                <div style={{ fontSize: 13, color: '#64748b' }}>SCHEDULED</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{scheduledCount}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 12, borderLeft: '4px solid #52c41a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div>
                <div style={{ fontSize: 13, color: '#64748b' }}>COMPLETED</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{completedCount}</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Table */}
      <Card
        bordered={false}
        style={{ borderRadius: 14, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}
        bodyStyle={{ padding: '24px 28px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                Appointment Scheduler
              </h2>
              <Tag color="blue" style={{ borderRadius: 12, padding: '1px 10px', fontWeight: 600 }}>
                {appointments.length} Total
              </Tag>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Book clinic visits, consults, and recurring checkups
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Input.Search
              placeholder="Search pet or reason..."
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 240 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreateModal}
              style={{ borderRadius: 8, fontWeight: 600, height: 38 }}
            >
              Book Appointment
            </Button>
          </div>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredAppointments}
          loading={loading}
          pagination={{
            pageSize: 8,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} appointments`,
          }}
        />
      </Card>

      {/* Book / Edit Modal */}
      <Modal
        title={editingRecord ? 'Edit Appointment' : 'Book Appointment'}
        open={Boolean(isModalOpen)}
        visible={Boolean(isModalOpen)}
        onCancel={handleCancelModal}
        onOk={() => form.submit()}
        okText={editingRecord ? 'Update' : 'Book'}
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
            label="Pet"
            name="petId"
            rules={[{ required: true, message: 'Please select a pet' }]}
          >
            <Select placeholder="Select a pet">
              {pets.map((pet) => (
                <Option key={pet.id} value={pet.id}>
                  {pet.petName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Veterinarian"
            name="veterinarianId"
            rules={[{ required: true, message: 'Please select a veterinarian' }]}
          >
            <Select placeholder="Select veterinarian">
              {vets.map((v) => (
                <Option key={v.id} value={v.id}>
                  {resolveVetName(v)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Appointment Date & Time"
            name="appointmentDate"
            rules={[{ required: true, message: 'Please select appointment date and time' }]}
          >
            <DatePicker
              showTime
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>

          <Form.Item
            label="Reason / Purpose"
            name="purpose"
            rules={[{ required: true, message: 'Please provide a reason or purpose' }]}
          >
            <TextArea rows={3} placeholder="Routine checkup, vaccinations, symptoms..." />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select placeholder="Select status">
              <Option value="SCHEDULED">SCHEDULED</Option>
              <Option value="COMPLETED">COMPLETED</Option>
              <Option value="CANCELLED">CANCELLED</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentScheduler;