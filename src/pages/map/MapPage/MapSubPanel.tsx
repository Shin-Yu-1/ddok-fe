import { useState } from 'react';

import Input from '@/components/Input/Input';

import styles from './MapSubPanel.module.scss';

interface MapSubPanelProps {
  isOpen: boolean;
}

const MapSubPanel: React.FC<MapSubPanelProps> = ({ isOpen }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('전체');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('전체');

  const filterItems = ['전체', '프로젝트', '스터디', '플레이어', '추천 장소'];
  const statusFilterItems = ['전체', '모집 중', '모집 완료'];

  const handleFilterClick = (item: string) => {
    setSelectedFilter(item);
    setSelectedStatusFilter('전체');
  };

  return (
    <div className={styles.subPanel__container}>
      {/* 서브 패널 타이틀*/}
      <div className={styles.subPanel__title}>지도 목록</div>

      {/* 검색 섹션*/}
      <div className={styles.subPanel__searchSection}>
        {/* 검색 바*/}
        <div className={styles.subPanel__searchBar}>
          <Input
            width="100%"
            height="40px"
            border="1px solid var(--gray-2)"
            focusBorder="1px solid var(--gray-2)"
          />
        </div>

        {/* 구분선 */}
        <hr className={styles.subPanel__divider} />

        {/* 카테고리 필터*/}
        <div className={styles.subPanel__filter}>
          {filterItems.map(item => (
            <div
              key={item}
              className={`${styles.subPanel__filterItem} ${
                selectedFilter === item ? styles.subPanel__filterItem__selected : ''
              }`}
              onClick={() => {
                handleFilterClick(item);
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <hr className={styles.subPanel__divider} />

        {/* 진행 상태 필터*/}
        {selectedFilter === '프로젝트' || selectedFilter === '스터디' ? (
          <div className={styles.subPanel__statusFilter}>
            {statusFilterItems.map(item => (
              <div
                key={item}
                className={`${styles.subPanel__statusFilterItem} ${
                  selectedStatusFilter === item ? styles.subPanel__statusFilterItem__selected : ''
                }`}
                onClick={() => {
                  setSelectedStatusFilter(item);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* 목록 섹션 */}
      <div className={styles.subPanel__list}>
        <div className={styles.subPanel__list__item}>
          <div className={styles.subPanel__list__thumbnail}></div>
          <div className={styles.subPanel__list__title}>말하는감자에싹이나</div>
          <div className={styles.subPanel__list__category}>플레이어</div>
        </div>
      </div>

      {/* 서브 패널 상태 표시 (임시) */}
      <div className={styles.subPanel__openStatus}>현재 상태 : {isOpen ? 'OPENED' : 'CLOSED'}</div>
    </div>
  );
};

export default MapSubPanel;
