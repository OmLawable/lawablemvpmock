import React from 'react';
import { Search, AlertCircle, CheckCircle, Info, X, ChevronRight, Star } from 'lucide-react';

export const Card = ({ children, className = '', style = {}, hover = false, onClick = null, padding = null }) => {
  const customStyle = {
    padding: padding !== null ? padding : 'var(--space-8)',
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };
  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
      style={customStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  style = {}
}) => {
  const btnClasses = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`;
  return (
    <button
      type={type}
      className={btnClasses}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

export const Badge = ({ children, variant = 'neutral', size = 'md', className = '', style = {} }) => {
  return (
    <span className={`badge badge-${variant} ${className}`} style={{ padding: size === 'sm' ? '4px 8px' : '6px 14px', ...style }}>
      {children}
    </span>
  );
};

export const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '', style = {} }) => {
  return (
    <div style={{ position: 'relative', width: '100%', ...style }} className={className}>
      <Search
        size={18}
        style={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-muted)'
        }}
      />
      <input
        type="text"
        className="form-input"
        style={{ paddingLeft: 46, paddingRight: 16, height: 46 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export const StatusChip = ({ status, style = {} }) => {
  let variant = 'neutral';
  let label = status ? status.replace('_', ' ').toUpperCase() : 'UNKNOWN';

  switch (status) {
    case 'completed':
    case 'accepted':
    case 'verified':
    case 'delivered':
    case 'active':
    case 'published':
      variant = 'success';
      break;
    case 'in_progress':
    case 'under_review':
    case 'pending':
    case 'draft':
    case 'in_review':
      variant = 'warning';
      break;
    case 'overdue':
    case 'rejected':
    case 'suspended':
    case 'cancelled':
      variant = 'danger';
      break;
    case 'submitted':
    case 'needs_info':
    case 'info_requested':
      variant = 'info';
      break;
    default:
      variant = 'neutral';
  }

  return <Badge variant={variant} style={style}>{label}</Badge>;
};

export const MetricCard = ({ title, value, subtitle, icon: Icon, trend, className = '', style = {}, onClick }) => {
  return (
    <Card className={className} style={{ cursor: onClick ? 'pointer' : 'default', ...style }} onClick={onClick}>
      <div className="flex items-center justify-between mb-4">
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)' }}>{title}</span>
        {Icon && (
          <div className="icon-box">
            <Icon size={20} />
          </div>
        )}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.2 }} className="mb-2">
        {value}
      </div>
      {subtitle && <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{subtitle}</div>}
    </Card>
  );
};

export const Modal = ({ title, children, onClose, maxWidth = 560 }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="h3" style={{ margin: 0 }}>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: 6 }}>
            <X size={18} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm' }) => {
  if (!isOpen) return null;
  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-body text-secondary mb-6" style={{ fontSize: 14, lineHeight: 1.6 }}>{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
      </div>
    </Modal>
  );
};

export const ToastContainer = ({ toasts = [] }) => {
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.type === 'success' && <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />}
          {t.type === 'danger' && <AlertCircle size={18} style={{ color: 'var(--color-danger)' }} />}
          {t.type === 'warning' && <AlertCircle size={18} style={{ color: 'var(--color-warning)' }} />}
          {t.type === 'info' && <Info size={18} style={{ color: 'var(--color-info)' }} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};
