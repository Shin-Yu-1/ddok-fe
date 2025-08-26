import React, { forwardRef } from 'react';

import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'password';
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', icon, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`${styles.inputContainer} ${className}`}>
        <div className={`${styles.inputWrapper} ${variant === 'password' ? styles.password : ''}`}>
          <input ref={ref} id={inputId} className={styles.input} {...props} />
          {icon && <div className={styles.inputIcon}>{icon}</div>}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
