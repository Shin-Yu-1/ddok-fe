import { useState, useEffect } from 'react';

import { CalendarDotIcon } from '@phosphor-icons/react';
import DatePicker from 'react-datepicker';

import Input from '@/components/Input/Input';

import styles from './DateInput.module.scss';
import 'react-datepicker/dist/react-datepicker.css';

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
  required?: boolean;
  max?: string;
  min?: string;
  placeholder?: string;
  readOnly?: boolean;
}

const DateInput = ({
  value,
  onChange,
  required = false,
  max,
  min,
  placeholder,
  readOnly = false,
}: DateInputProps) => {
  const [displayValue, setDisplayValue] = useState(value || '');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setDisplayValue(value || '');
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // readOnly일 때는 입력 변경을 무시
    if (readOnly) return;

    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    // 날짜 형식 검증 (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(inputValue)) {
      const date = new Date(inputValue);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        onChange(inputValue);
      }
    } else if (inputValue === '') {
      setSelectedDate(null);
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // readOnly일 때는 모든 키 입력 차단
    if (readOnly) {
      e.preventDefault();
      return;
    }

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

  const handleCalendarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCalendar(!showCalendar);
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      setDisplayValue(dateString);
      setSelectedDate(date);
      onChange(dateString);
    }
    setShowCalendar(false);
  };

  const handleClickOutside = () => {
    setShowCalendar(false);
  };

  return (
    <div className={styles.dateInputWrapper}>
      <Input
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        required={required}
        width="100%"
        height="40px"
        placeholder={placeholder || 'YYYY-MM-DD'}
        fontSize="var(--fs-xxsmall)"
        border="1px solid var(--gray-3)"
        focusBorder="1px solid var(--gray-3)"
        readOnly={readOnly}
        style={
          {
            '--placeholder-color': 'var(--gray-2)',
            cursor: readOnly ? 'pointer' : 'text',
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
      {showCalendar && (
        <div className={styles.calendarContainer}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateSelect}
            onClickOutside={handleClickOutside}
            minDate={min ? new Date(min) : undefined}
            maxDate={max ? new Date(max) : undefined}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            inline
            calendarClassName={styles.inlineCalendar}
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;
