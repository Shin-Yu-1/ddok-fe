import { useRef, useState, useEffect } from 'react';

import { CalendarDotIcon } from '@phosphor-icons/react';

import Input from '@/components/Input/Input';

import styles from './DateInput.module.scss';

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
  required?: boolean;
  max?: string;
  min?: string;
  placeholder?: string;
}

const DateInput = ({
  value,
  onChange,
  required = false,
  max,
  min,
  placeholder,
}: DateInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenDateInputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState(value || '');

  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(inputValue) || inputValue === '') {
      onChange(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      '-',
    ];

    if (allowedKeys.includes(e.key) || (e.key >= '0' && e.key <= '9') || e.ctrlKey || e.metaKey) {
      return;
    }

    e.preventDefault();
  };

  const handleCalendarClick = () => {
    if (hiddenDateInputRef.current) {
      hiddenDateInputRef.current.focus();
      hiddenDateInputRef.current.click();

      const input = hiddenDateInputRef.current as HTMLInputElement & { showPicker?: () => void };
      if ('showPicker' in input && typeof input.showPicker === 'function') {
        try {
          input.showPicker();
        } catch {
          console.log('showPicker not supported or failed');
        }
      }
    }
  };

  const handleHiddenDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setDisplayValue(selectedDate);
    onChange(selectedDate);
  };

  return (
    <div className={styles.dateInputWrapper}>
      <input
        ref={hiddenDateInputRef}
        type="date"
        value={value}
        onChange={handleHiddenDateChange}
        max={max}
        min={min}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 0,
          height: 0,
          pointerEvents: 'none',
        }}
        tabIndex={-1}
      />

      <Input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        required={required}
        width="100%"
        height="40px"
        placeholder={placeholder || 'YYYY-MM-DD'}
        fontSize="var(--fs-xxsmall)"
        border="1px solid var(--gray-3)"
        focusBorder="1px solid var(--gray-3)"
        style={
          {
            '--placeholder-color': 'var(--gray-2)',
            cursor: 'text',
            marginBottom: '1.5rem',
          } as React.CSSProperties
        }
        iconSize={24}
        rightIcon={
          <button
            type="button"
            onClick={handleCalendarClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <CalendarDotIcon width={24} height={24} color="var(--black-1)" />
          </button>
        }
      />
    </div>
  );
};

export default DateInput;
