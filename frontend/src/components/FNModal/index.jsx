import React from 'react';
import { Modal } from 'antd';

const FNModal = ({ children, showModal, handleClose, lg, title }) => {
  return (
    <Modal
      open={showModal}
      onCancel={handleClose}
      footer={null}
      title={<span style={{ color: '#fff', fontWeight: 600 }}>{title}</span>}
      width={lg ? 900 : 520}
      centered
      bodyStyle={{ background: 'var(--moh-header-bg)', color: 'var(--moh-primary)', borderBottomLeftRadius: 8, borderBottomRightRadius: 8, fontFamily: 'Inter, Arial, sans-serif' }}
      titleStyle={{ background: '#556ee6', borderTopLeftRadius: 8, borderTopRightRadius: 8, fontFamily: 'Inter, Arial, sans-serif' }}
      style={{ fontFamily: 'Inter, Arial, sans-serif' }}
      closeIcon={<span style={{ color: '#fff', fontSize: 18 }}>&times;</span>}
      maskClosable={false}
    >
      {children}
    </Modal>
  );
};

export default FNModal;