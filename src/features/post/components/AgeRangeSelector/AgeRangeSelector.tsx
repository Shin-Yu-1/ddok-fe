import { useState, useEffect } from 'react';

import clsx from 'clsx';

import Button from '@/components/Button/Button';
import { AGE_RANGES } from '@/constants/ageRanges';
import type { PreferredAges } from '@/types/project';

import styles from './AgeRangeSelector.module.scss';

interface AgeRangeSelectorProps {
  value: PreferredAges | null;
  onChange: (value: PreferredAges | null) => void;
  className?: string;
}

const AgeRangeSelector = ({ value, onChange, className }: AgeRangeSelectorProps) => {
  const [selectedAges, setSelectedAges] = useState<number[]>([]);

  // value가 변경될 때 selectedAges 업데이트
  useEffect(() => {
    if (!value) {
      setSelectedAges([]);
      return;
    }

    const { ageMin, ageMax } = value;
    const ages: number[] = [];

    // ageMin부터 ageMax까지 10단위로 연령대 찾기
    for (let age = ageMin; age < ageMax; age += 10) {
      const option = AGE_RANGES.find(opt => opt.value?.min === age);
      if (option) {
        ages.push(option.id);
      }
    }

    setSelectedAges(ages);
  }, [value]);

  // 연령 무관 선택
  const handleNoPreferenceClick = () => {
    setSelectedAges([]);
    onChange(null);
  };

  // 특정 연령대 클릭
  const handleAgeClick = (clickedAgeId: number) => {
    if (clickedAgeId === 0) {
      handleNoPreferenceClick();
      return;
    }

    let newSelectedAges: number[] = [];

    if (selectedAges.includes(clickedAgeId)) {
      // 이미 선택된 연령대 클릭 시 - 해당 연령대만 제거하되 연속성 유지
      const remaining = selectedAges.filter(id => id !== clickedAgeId);

      if (remaining.length === 0) {
        newSelectedAges = [];
      } else {
        // 연속된 구간들로 분할
        const sortedRemaining = remaining.sort((a, b) => a - b);
        const groups: number[][] = [];
        let currentGroup: number[] = [sortedRemaining[0]];

        for (let i = 1; i < sortedRemaining.length; i++) {
          if (sortedRemaining[i] === sortedRemaining[i - 1] + 10) {
            currentGroup.push(sortedRemaining[i]);
          } else {
            groups.push(currentGroup);
            currentGroup = [sortedRemaining[i]];
          }
        }
        groups.push(currentGroup);

        // 가장 긴 연속 구간 선택
        const longestGroup = groups.reduce((longest, current) =>
          current.length > longest.length ? current : longest
        );

        newSelectedAges = longestGroup;
      }
    } else {
      // 새로운 연령대 선택 시
      if (selectedAges.length === 0) {
        newSelectedAges = [clickedAgeId];
      } else {
        const allAges = [...selectedAges, clickedAgeId].sort((a, b) => a - b);
        const minAge = Math.min(...allAges);
        const maxAge = Math.max(...allAges);

        // 최소~최대 범위의 모든 연령대 포함
        newSelectedAges = [];
        for (let age = minAge; age <= maxAge; age += 10) {
          if (AGE_RANGES.find(opt => opt.id === age)) {
            newSelectedAges.push(age);
          }
        }
      }
    }

    setSelectedAges(newSelectedAges);

    // onChange 호출
    if (newSelectedAges.length === 0) {
      onChange(null);
    } else {
      const minAge = Math.min(...newSelectedAges);
      const maxAge = Math.max(...newSelectedAges) + 10; // 10단위로 끝나도록
      onChange({ ageMin: minAge, ageMax: maxAge });
    }
  };

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.buttonGrid}>
        {/* 연령 무관 섹션 */}
        <div className={styles.noPreferenceSection}>
          {AGE_RANGES.filter(option => option.id === 0).map(option => {
            const isSelected = selectedAges.length === 0;

            return (
              <Button
                key={option.id}
                variant="primary"
                radius="full"
                size="sm"
                fontSizePreset="xxsmall"
                fontWeightPreset="medium"
                className={clsx(
                  styles.ageButton,
                  isSelected && styles.selected,
                  styles.noPreference
                )}
                onClick={() => handleAgeClick(option.id)}
              >
                {option.label}
              </Button>
            );
          })}
        </div>

        <hr className={styles.hrStyle} />

        {/* 연령대 선택 섹션 */}
        <div className={styles.ageOptionsSection}>
          {AGE_RANGES.filter(option => option.id !== 0).map(option => {
            const isSelected = selectedAges.includes(option.id);

            return (
              <Button
                key={option.id}
                variant="primary"
                radius="xsm"
                size="sm"
                fontSizePreset="xxsmall"
                fontWeightPreset="medium"
                className={clsx(styles.ageButton, isSelected && styles.selected)}
                onClick={() => handleAgeClick(option.id)}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      </div>

      {selectedAges.length > 0 ? (
        <div className={styles.selectedInfo}>
          <span className={styles.infoText}>
            선택된 나이: {Math.min(...selectedAges)}세 ~ {Math.max(...selectedAges) + 9}세
          </span>
        </div>
      ) : (
        <div className={clsx(styles.selectedInfo, styles.noPreferenceInfo)}>
          <span className={styles.infoText}>연령 제한 없음</span>
        </div>
      )}
    </div>
  );
};

export default AgeRangeSelector;
