import { useRef } from 'react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleCalendarClick = () => {
    if (inputRef.current) {
      if (
        'showPicker' in inputRef.current &&
        typeof (inputRef.current as HTMLInputElement & { showPicker?: () => void }).showPicker ===
          'function'
      ) {
        (inputRef.current as HTMLInputElement & { showPicker: () => void }).showPicker();
      } else {
        inputRef.current.focus();
        inputRef.current.click();
      }
    }
  };

  return (
    <div className={styles.dateInputWrapper}>
      <Input
        ref={inputRef}
        type="date"
        value={value}
        onChange={handleChange}
        required={required}
        max={max}
        min={min}
        width="100%"
        height="40px"
        placeholder={placeholder}
        fontSize="var(--fs-xxsmall)"
        border="1px solid var(--gray-3)"
        focusBorder="1px solid var(--gray-3)"
        style={
          {
            '--placeholder-color': 'var(--gray-2)',
            cursor: 'pointer',
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
