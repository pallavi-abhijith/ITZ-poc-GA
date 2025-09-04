import React from 'react';
import ReactDOM from 'react-dom';

const ModalPortal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  let portalRoot = document.getElementById('portal-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'portal-root');
    document.body.appendChild(portalRoot);
  }

  return ReactDOM.createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    portalRoot
  );
};

export default ModalPortal;