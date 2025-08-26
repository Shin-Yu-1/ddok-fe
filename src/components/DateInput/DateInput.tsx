import { useState, useEffect, forwardRef } from 'react';

import { CalendarDotIcon } from '@phosphor-icons/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [displayValue, setDisplayValue] = useState(value || '');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setDisplayValue(value);
      }
    } else {
      setSelectedDate(null);
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

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

  const handleDatePickerChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      setDisplayValue(dateString);
      onChange(dateString);
    } else {
      setDisplayValue('');
      onChange('');
    }
    setIsDatePickerOpen(false);
  };

  const handleCalendarClick = () => {
    setIsDatePickerOpen(true);
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

  const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    (props, ref) => {
      // DatePicker props를 무시하고 우리가 원하는 값 사용
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { value: _, onChange: __, ...restProps } = props;

      return (
        <Input
          ref={ref}
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
          {...restProps}
        />
      );
    }
  );

  return (
    <div className={styles.dateInputWrapper}>
      <DatePicker
        selected={selectedDate}
        onChange={handleDatePickerChange}
        customInput={<CustomInput />}
        open={isDatePickerOpen}
        onClickOutside={() => setIsDatePickerOpen(false)}
        dateFormat="yyyy-MM-dd"
        minDate={min ? new Date(min) : undefined}
        maxDate={max ? new Date(max) : undefined}
        showPopperArrow={false}
        popperClassName={styles.datePicker}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        yearDropdownItemNumber={15}
        scrollableYearDropdown
      />
    </div>
  );
};

export default DateInput;
