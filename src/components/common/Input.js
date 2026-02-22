import React from 'react';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon,
  ...props
}) => {
  
  return (
    <div className={`input-group ${error ? 'input-error' : ''}`}>
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && (
          <span className="input-icon">{icon}</span>
        )}
        
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input ${icon ? 'input-with-icon' : ''}`}
          {...props}
        />
      </div>
      
      {error && (
        <span className="input-error-message">{error}</span>
      )}
    </div>
  );
};

export default Input;
