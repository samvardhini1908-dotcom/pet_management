import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import authService from '../services/authService';
import { logout } from '../store/authSlice';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.user);

  const menuItems = [
    { key: '/', label: 'Dashboard' },
    { key: '/pets', label: 'My Pets' },
    { key: '/vaccinations', label: 'Vaccinations' },
    { key: '/medical', label: 'Medical Records' },
    { key: '/adoptions', label: 'Adoption Center' },
    { key: '/appointments', label: 'Appointments' },
  ];

  if (user?.role === 'ROLE_ADMIN') {
    menuItems.push({
      key: '/users',
      label: 'User Management',
    });
  }

  if (user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_SHELTER') {
    menuItems.push(
      { key: '/reports', label: 'Reports' },
      { key: '/adoption-requests', label: 'Adoption Requests' }
    );
  }

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    if (authService && typeof authService.logout === 'function') {
      authService.logout();
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light" style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          PetPulse
        </div>

        <nav role="navigation" style={{ flex: 1 }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
          />
        </nav>

        <div style={{ padding: 16, marginTop: 'auto' }}>
          <Button type="primary" danger block onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <span>{user?.fullName}</span>
        </Header>

        <Content style={{ margin: 24, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;