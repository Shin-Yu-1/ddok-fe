import { useState } from 'react';

import Input from '@/components/Input/Input';

import { MapItemFilter } from '../../constants/MapItemCategoryFilter';
import { MapItemStatusFilter } from '../../constants/MapItemStatusFilter';
import MapPanelItem from '../MapPanelItem/MapPanelItem';

import styles from './MapPanel.module.scss';

interface MapPanelProps {
  isOpen: boolean;
}

const mockData = [
  {
    category: 'project',
    projectId: 1,
    title: '구지라지 프로젝트',
    location: {
      latitude: 37.5665,
      longitude: 126.978,
      address: '서울특별시 강남구 테헤란로',
    },
    teamStatus: 'RECRUITING',
    image: '/src/assets/images/avatar.png',
  },

  {
    category: 'study',
    studyId: 1,
    title: '구지라지 스터디',
    location: {
      latitude: 37.5665,
      longitude: 126.978,
      address: '서울특별시 강남구 테헤란로',
    },
    teamStatus: 'ONGOING',
    image: '/src/assets/images/avatar.png',
  },

  {
    category: 'player',
    userId: 1,
    nickname: '똑똑한 백엔드',
    location: {
      latitude: 37.5665,
      longitude: 126.978,
      address: '서울특별시 강남구 테헤란로',
    },
    position: '백엔드',
    isMine: 'false',
    image: '/src/assets/images/avatar.png',
  },

  {
    category: 'cafe',
    cafeId: 1,
    title: '구지라지 카페',
    location: {
      latitude: 37.5665,
      longitude: 126.978,
      address: '서울특별시 강남구 테헤란로',
    },
    image: '/src/assets/images/avatar.png',
  },
];

const MapPanel: React.FC<MapPanelProps> = ({ isOpen }) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<MapItemFilter>(
    MapItemFilter.ALL
  );

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<MapItemStatusFilter>(
    MapItemStatusFilter.ALL
  );

  const filterItems: MapItemFilter[] = [
    MapItemFilter.ALL,
    MapItemFilter.PROJECT,
    MapItemFilter.STUDY,
    MapItemFilter.PLAYER,
    MapItemFilter.CAFE,
  ];

  const statusFilterItems: MapItemStatusFilter[] = [
    MapItemStatusFilter.ALL,
    MapItemStatusFilter.RECRUITING,
    MapItemStatusFilter.ONGOING,
  ];

  const handleFilterClick = (item: MapItemFilter) => {
    setSelectedCategoryFilter(item);
    setSelectedStatusFilter(MapItemStatusFilter.ALL);
  };

  return (
    <div className={styles.panel__container}>
      {/* 패널 타이틀*/}
      <div className={styles.panel__title}>지도 목록</div>

      {/* 검색 섹션*/}
      <div className={styles.panel__searchSection}>
        {/* 검색 바*/}
        <div className={styles.panel__searchBar}>
          <Input
            width="100%"
            height="40px"
            border="1px solid var(--gray-2)"
            focusBorder="1px solid var(--gray-2)"
          />
        </div>

        {/* 구분선 */}
        <hr className={styles.panel__divider} />

        {/* 카테고리 필터*/}
        <div className={styles.panel__categoryFilter}>
          {/* TODO: 버튼 컴포넌트 가져오기 */}
          {filterItems.map(item => (
            <div
              key={item}
              className={`${styles.panel__categoryFilter__item} ${
                selectedCategoryFilter === item ? styles.panel__categoryFilter__item__selected : ''
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
        <hr className={styles.panel__divider} />

        {/* 진행 상태 필터*/}
        {selectedCategoryFilter === MapItemFilter.PROJECT ||
        selectedCategoryFilter === MapItemFilter.STUDY ? (
          <>
            <div className={styles.panel__statusFilter}>
              {/* TODO: 버튼 컴포넌트 가져오기 */}
              {statusFilterItems.map(item => (
                <div
                  key={item}
                  className={`${styles.panel__statusFilter__item} ${
                    selectedStatusFilter === item ? styles.panel__statusFilter__item__selected : ''
                  }`}
                  onClick={() => {
                    setSelectedStatusFilter(item);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* 구분선 */}
            <hr className={styles.panel__divider} />
          </>
        ) : null}
      </div>

      {/* 목록 섹션 */}
      <div className={styles.panel__list}>
        {mockData.map((item, index) => (
          <>
            <MapPanelItem
              key={index}
              image={item.image}
              title={item.title}
              nickname={item.nickname}
              category={item.category}
              status={item.teamStatus}
              location={item.location}
            />
            {index < mockData.length - 1 && <hr className={styles.panel__list__item__divider} />}
          </>
        ))}
      </div>

      {/* 패널 상태 표시 (임시) */}
      <div className={styles.panel__openStatus}>패널 상태 : {isOpen ? 'OPENED' : 'CLOSED'}</div>
    </div>
  );
};

export default MapPanel;
