import { useState } from 'react';

import styles from './TextInput.module.scss';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  showCounter?: boolean;
  className?: string;
  error?: string;
  disabled?: boolean;
}

const TextInput = ({
  value,
  onChange,
  placeholder,
  minLength = 0,
  maxLength = 30,
  showCounter = true,
  className = '',
  error,
  disabled = false,
}: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const hasError = error || (value && minLength && value.length < minLength);
  const isOverLimit = maxLength && value.length > maxLength;

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${styles.input} ${hasError || isOverLimit ? styles.error : ''} ${isFocused ? styles.focused : ''}`}
        />

        {showCounter && maxLength && (
          <div
            className={`${styles.counter} ${isOverLimit ? styles.overLimit : ''} ${isFocused ? styles.visible : ''}`}
          >
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      {(hasError || error || isOverLimit) && (
        <div className={styles.errorMessages}>
          {error && <span className={styles.errorText}>{error}</span>}
          {!error && hasError && minLength > 0 && value.length > 0 && value.length < minLength && (
            <span className={styles.errorText}>최소 {minLength}자 이상 입력해주세요</span>
          )}
          {!error && isOverLimit && (
            <span className={styles.errorText}>최대 {maxLength}자까지 입력 가능합니다</span>
          )}
        </div>
      )}
    </div>
  );
};

export default TextInput;
