import { Minus, Plus } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { Slider } from 'radix-ui';

import 'dayjs/locale/ko';
import styles from './PostDurationSlider.module.scss';

dayjs.locale('ko');

interface PostDurationSliderProps {
  value: number;
  onChange: (months: number) => void;
  startDate?: string;
}

const PostDurationSlider = ({ value, onChange, startDate }: PostDurationSliderProps) => {
  const handleValueChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  const handleDecrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < 36) {
      onChange(value + 1);
    }
  };

  const getEndDate = () => {
    if (!startDate) return null;

    const endDate = dayjs(startDate).add(value, 'month');

    return endDate.format('YYYY년 M월 D일 (ddd)');
  };

  // 실제 진행 일수 계산
  const getTotalDays = () => {
    if (!startDate) return null;

    const start = dayjs(startDate);
    const end = dayjs(startDate).add(value, 'month');

    return end.diff(start, 'day');
  };

  return (
    <div className={styles.container}>
      <p className={styles.sectionSubtitle}>몇 개월 동안 진행하실 예정인가요?</p>

      <div className={styles.sliderContainer}>
        <div className={styles.valueDisplay}>
          <button
            className={`${styles.arrowButton} ${value <= 1 ? styles.disabled : ''}`}
            onClick={handleDecrease}
            disabled={value <= 1}
          >
            <Minus size={14} />
          </button>

          <span className={styles.currentValue}>{value}개월</span>

          <button
            className={`${styles.arrowButton} ${value >= 36 ? styles.disabled : ''}`}
            onClick={handleIncrease}
            disabled={value >= 36}
          >
            <Plus size={14} />
          </button>
        </div>

        <Slider.Root
          className={styles.sliderRoot}
          value={[value]}
          onValueChange={handleValueChange}
          max={36}
          min={1}
          step={1}
        >
          <Slider.Track className={styles.sliderTrack}>
            <Slider.Range className={styles.sliderRange} />
          </Slider.Track>
          <Slider.Thumb className={styles.sliderThumb} />
        </Slider.Root>

        <div className={styles.rangeLabels}>
          <span>1개월</span>
          <span>36개월</span>
        </div>
      </div>

      {startDate && getEndDate() && (
        <div className={styles.endDateInfo}>
          <div className={styles.endDateText}>예상 종료일: {getEndDate()}</div>
          {getTotalDays() && (
            <div className={styles.totalDaysText}>(총 {getTotalDays()}일 진행)</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDurationSlider;
