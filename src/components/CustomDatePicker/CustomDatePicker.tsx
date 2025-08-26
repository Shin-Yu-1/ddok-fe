import React from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styles from './CustomDatePicker.module.scss';

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  customInput: React.ReactElement;
  open: boolean;
  onClickOutside: () => void;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  showMonthDropdown?: boolean;
  showYearDropdown?: boolean;
  dropdownMode?: 'scroll' | 'select';
  yearDropdownItemNumber?: number;
  scrollableYearDropdown?: boolean;
}

const CustomDatePicker = ({
  selected,
  onChange,
  customInput,
  open,
  onClickOutside,
  minDate,
  maxDate,
  dateFormat = 'yyyy-MM-dd',
  showMonthDropdown = true,
  showYearDropdown = true,
  dropdownMode = 'select',
  yearDropdownItemNumber = 15,
  scrollableYearDropdown = true,
}: CustomDatePickerProps) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      customInput={customInput}
      open={open}
      onClickOutside={onClickOutside}
      dateFormat={dateFormat}
      minDate={minDate}
      maxDate={maxDate}
      showPopperArrow={false}
      popperClassName={styles.datePicker}
      showMonthDropdown={showMonthDropdown}
      showYearDropdown={showYearDropdown}
      dropdownMode={dropdownMode}
      yearDropdownItemNumber={yearDropdownItemNumber}
      scrollableYearDropdown={scrollableYearDropdown}
    />
  );
};

export default CustomDatePicker;
