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

/** 로컬 기준 YYYY-MM-DD 문자열로 포맷 */
function toYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 로컬 기준으로 YYYY-MM-DD를 Date로 변환 (시간은 00:00 로컬) */
function parseYmd(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return new Date(y, mo - 1, d, 0, 0, 0, 0); // 로컬 자정
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

  // 외부 value 변경 → 내부 상태 동기화 (UTC 파싱 대신 로컬 파싱 사용)
  useEffect(() => {
    setDisplayValue(value || '');
    if (value) {
      const parsed = parseYmd(value);
      setSelectedDate(parsed);
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return; // 읽기 전용이면 무시

    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    // YYYY-MM-DD 형식만 통과
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(inputValue)) {
      const parsed = parseYmd(inputValue);
      if (parsed) {
        setSelectedDate(parsed);
        onChange(inputValue); // 그대로 문자열 전달
      }
    } else if (inputValue === '') {
      setSelectedDate(null);
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    setShowCalendar(prev => !prev);
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      // ✅ UTC 변환 금지: toISOString() 사용하지 말 것
      const dateString = toYmd(date); // 로컬 기준 YYYY-MM-DD
      const localDate = parseYmd(dateString); // 내부 선택 상태도 로컬 자정으로 고정
      setDisplayValue(dateString);
      setSelectedDate(localDate);
      onChange(dateString);
    }
    setShowCalendar(false);
  };

  const handleClickOutside = () => {
    setShowCalendar(false);
  };

  // min/max도 문자열을 로컬 Date로 변환해서 넘김
  const minDate = min ? (parseYmd(min) ?? undefined) : undefined;
  const maxDate = max ? (parseYmd(max) ?? undefined) : undefined;

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
            minDate={minDate}
            maxDate={maxDate}
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
