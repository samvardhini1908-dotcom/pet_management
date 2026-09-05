import React, { useEffect } from 'react';

const ToastItem = ({ notification, onDismiss }) => {
  useEffect(() => {
    let timeoutMs = null;
    if (notification.type === 'success') {
      timeoutMs = 3000;
    } else if (notification.type === 'error') {
      timeoutMs = 5000;
    } else if (notification.duration) {
      timeoutMs = notification.duration;
    }

    if (timeoutMs) {
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, timeoutMs);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  const getStyleByType = (type) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
          color: '#389e0d',
        };
      case 'error':
        return {
          backgroundColor: '#fff2f0',
          border: '1px solid #ffccc7',
          color: '#cf1322',
        };
      case 'warning':
        return {
          backgroundColor: '#fffbe6',
          border: '1px solid #ffe58f',
          color: '#d48806',
        };
      case 'info':
      default:
        return {
          backgroundColor: '#e6f7ff',
          border: '1px solid #91d5ff',
          color: '#096dd9',
        };
    }
  };

  const styleProps = getStyleByType(notification.type);

  return (
    <div
      role="alert"
      style={{
        ...styleProps,
        minWidth: '280px',
        maxWidth: '400px',
        padding: '12px 16px',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontSize: '14px',
        transition: 'all 0.3s ease',
      }}
    >
      <span style={{ flex: 1 }}>{notification.message}</span>
      <button
        type="button"
        aria-label="Close"
        onClick={() => onDismiss(notification.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'inherit',
          padding: 0,
          lineHeight: 1,
        }}
      >
        &times;
      </button>
    </div>
  );
};

const NotificationStack = ({ notifications = [], onDismiss = () => {} }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div
      className="notification-stack-container"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'auto',
      }}
    >
      {notifications.map((item) => (
        <ToastItem key={item.id} notification={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default NotificationStack;