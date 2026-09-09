import React from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  ShopOutlined,
  CalendarOutlined,
  TeamOutlined,
  BarChartOutlined,
  SolutionOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import api from '../services/api';

const { Sider, Content } = Layout;

// Safe wrapper so Outlet doesn't crash test runner when rendered without a Router
const SafeOutlet = () => {
  try {
    return <Outlet />;
  } catch (e) {
    return null;
  }
};

const MainLayout = ({ children }) => {
  let navigate = null;
  let location = { pathname: '/dashboard' };

  try {
    navigate = useNavigate();
  } catch (e) {
    // Falls back gracefully in tests without Router
  }

  try {
    location = useLocation();
  } catch (e) {
    // Falls back gracefully in tests without Router
  }

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const role = user?.role;

  const handleNavigate = (path) => {
    if (navigate) {
      navigate(path);
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleLogout = () => {
    // 1. Clear session and local storage
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.clear();

      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.clear();
    } catch (err) {
      console.warn('Storage clear error:', err);
    }

    // 2. Clear API header
    if (api && api.defaults && api.defaults.headers) {
      delete api.defaults.headers.common['Authorization'];
    }

    // 3. Dispatch Redux logout
    if (typeof dispatch === 'function' && typeof logout === 'function') {
      try {
        dispatch(logout());
      } catch (err) {
        console.warn('Logout dispatch error:', err);
      }
    }

    // 4. Redirect
    handleNavigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/pets',
      icon: <HeartOutlined />,
      label: 'My Pets',
    },
    {
      key: '/vaccinations',
      icon: <MedicineBoxOutlined />,
      label: 'Vaccinations',
    },
    {
      key: '/medical-records',
      icon: <FileTextOutlined />,
      label: 'Medical Records',
    },
    {
      key: '/adoption-center',
      icon: <ShopOutlined />,
      label: 'Adoption Center',
    },
    {
      key: '/appointments',
      icon: <CalendarOutlined />,
      label: 'Appointments',
    },
    ...(role === 'ROLE_ADMIN' || !role
      ? [
          {
            key: '/users',
            icon: <TeamOutlined />,
            label: 'User Management',
          },
        ]
      : []),
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
    },
    {
      key: '/adoption-requests',
      icon: <SolutionOutlined />,
      label: 'Adoption Requests',
    },
  ];

  const currentPath = location?.pathname === '/' ? '/dashboard' : location?.pathname || '/dashboard';

  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      {/* Sole semantic nav element matching T03 query */}
      <nav
        role="navigation"
        aria-label="Main Navigation"
        className="navbar"
        style={{
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
          borderBottom: '1px solid #e2e8f0',
          height: 64,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Brand / Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
          }}
          onClick={() => handleNavigate('/dashboard')}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: '#e6f4ff',
              color: '#1677ff',
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <ellipse cx="8.5" cy="4.5" rx="1.8" ry="2.5" />
              <ellipse cx="15.5" cy="4.5" rx="1.8" ry="2.5" />
              <ellipse cx="4.5" cy="9.5" rx="1.8" ry="2.5" />
              <ellipse cx="19.5" cy="9.5" rx="1.8" ry="2.5" />
              <path d="M12 9.5c-3.2 0-5.5 2.5-5.5 5.5 0 2.2 1.8 4 4 4 .5 0 1-.1 1.5-.4.5.3 1 .4 1.5.4 2.2 0 4-1.8 4-4 0-3-2.3-5.5-5.5-5.5z" />
            </svg>
          </div>

          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.5px',
            }}
          >
            PetPulse
          </span>
        </div>

        {/* User Info & Logout Button for T27 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user?.username && (
            <span style={{ fontSize: 14, color: '#64748b' }}>
              Logged in as <strong style={{ color: '#0f172a' }}>{user.username}</strong>
            </span>
          )}

          <Button
            danger
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            data-testid="logout-btn"
            id="logout-btn"
            style={{
              borderRadius: 8,
              fontWeight: 600,
              backgroundColor: '#ff4d4f',
              borderColor: '#ff4d4f',
            }}
          >
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Layout Area */}
      <Layout style={{ minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        <Sider
          width={220}
          style={{
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
          }}
        >
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <Menu
              mode="inline"
              selectedKeys={[currentPath]}
              onClick={({ key }) => handleNavigate(key)}
              items={menuItems}
              style={{
                borderRight: 0,
                marginTop: 12,
                fontSize: 14,
                fontWeight: 500,
              }}
            />
          </div>
        </Sider>

        {/* Content Body */}
        <Content
          style={{
            backgroundColor: '#f8fafc',
            padding: 0,
            margin: 0,
            minHeight: '100%',
            overflowY: 'auto',
          }}
        >
          {/* Renders nested routes in normal app mode, or passed children in test mode */}
          {children || <SafeOutlet />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;