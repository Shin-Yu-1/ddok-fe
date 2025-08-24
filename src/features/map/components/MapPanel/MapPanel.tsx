import { useState, useMemo } from 'react';

import Input from '@/components/Input/Input';

import { MapItemFilter } from '../../constants/MapItemCategoryFilter.enum';
import { MapItemStatusFilter } from '../../constants/MapItemStatusFilter.enum';
import MapPanelCafeItem from '../MapPanelItem/MapPanelCafeItem/MapPanelCafeItem';
import MapPanelPlayerItem from '../MapPanelItem/MapPanelPlayerItem/MapPanelPlayerItem';
import MapPanelProjectItem from '../MapPanelItem/MapPanelProjectItem/MapPanelProjectItem';
import MapPanelStudyItem from '../MapPanelItem/MapPanelStudyItem/MapPanelStudyItem';

import styles from './MapPanel.module.scss';

interface MapPanelProps {
  isMapPanelOpen: boolean;
  isMapSubPanelOpen?: boolean;
  handleSubPanelToggle: () => void;
}

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface Project {
  category: string;
  projectId: number;
  title: string;
  location: Location;
  teamStatus: string;
  bannerImageUrl: string;
}

interface Study {
  category: string;
  studyId: number;
  title: string;
  location: Location;
  teamStatus: string;
  bannerImageUrl: string;
}

interface Player {
  category: string;
  userId: number;
  nickname: string;
  location: Location;
  profileImageUrl: string;
}

interface Cafe {
  category: string;
  cafeId: number;
  title: string;
  location: Location;
  bannerImageUrl: string;
}

const panelMockData: (Project | Study | Player | Cafe)[] = [
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
    bannerImageUrl: '/src/assets/images/avatar.png',
  },
  {
    category: 'project',
    projectId: 2,
    title: '똑똑 프로젝트',
    location: {
      latitude: 37.5665,
      longitude: 126.978,
      address: '서울특별시 강남구 테헤란로',
    },
    teamStatus: 'ONGOING',
    bannerImageUrl: '/src/assets/images/avatar.png',
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
    bannerImageUrl: '/src/assets/images/avatar.png',
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
    profileImageUrl: '/src/assets/images/avatar.png',
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
    bannerImageUrl: '/src/assets/images/avatar.png',
  },
  {
    category: 'cafe',
    cafeId: 2,
    title: '똑똑 카페',
    location: {
      latitude: 37.5665,
      longitude: 126.978,
      address: '서울특별시 강남구 테헤란로',
    },
    bannerImageUrl: '/src/assets/images/avatar.png',
  },
];

const MapPanel: React.FC<MapPanelProps> = ({
  isMapPanelOpen,
  isMapSubPanelOpen,
  handleSubPanelToggle,
}) => {
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

  // 타입 가드 함수
  const isProject = (item: Project | Study | Player | Cafe): item is Project =>
    item.category === 'project';
  const isStudy = (item: Project | Study | Player | Cafe): item is Study =>
    item.category === 'study';
  const isPlayer = (item: Project | Study | Player | Cafe): item is Player =>
    item.category === 'player';
  const isCafe = (item: Project | Study | Player | Cafe): item is Cafe => item.category === 'cafe';

  // 데이터 필터링 함수
  const filteredData = useMemo(() => {
    let filtered = panelMockData;

    // 1. 카테고리 필터링
    if (selectedCategoryFilter !== MapItemFilter.ALL) {
      filtered = filtered.filter(item => {
        switch (selectedCategoryFilter) {
          case MapItemFilter.PROJECT:
            return item.category === 'project';
          case MapItemFilter.STUDY:
            return item.category === 'study';
          case MapItemFilter.PLAYER:
            return item.category === 'player';
          case MapItemFilter.CAFE:
            return item.category === 'cafe';
          default:
            return true;
        }
      });
    }

    // 2. 모집 상태 필터링(프로젝트와 스터디만 적용)
    if (
      selectedStatusFilter !== MapItemStatusFilter.ALL &&
      (selectedCategoryFilter === MapItemFilter.PROJECT ||
        selectedCategoryFilter === MapItemFilter.STUDY ||
        selectedCategoryFilter === MapItemFilter.ALL)
    ) {
      filtered = filtered.filter(item => {
        // teamStatus가 있는 project와 study의 경우에만 모집 상태 필터링
        if (isProject(item) || isStudy(item)) {
          switch (selectedStatusFilter) {
            case MapItemStatusFilter.RECRUITING:
              return item.teamStatus === 'RECRUITING';
            case MapItemStatusFilter.ONGOING:
              return item.teamStatus === 'ONGOING';
            default:
              return true;
          }
        }
        // player, cafe는 teamStatus가 없으므로 상태 필터링 시 포함
        return selectedCategoryFilter === MapItemFilter.ALL ? true : false;
      });
    }

    return filtered;
  }, [selectedCategoryFilter, selectedStatusFilter]);

  // 타입별 컴포넌트 렌더링 함수
  const renderMapItem = (item: Project | Study | Player | Cafe) => {
    const commonProps = {
      category: item.category,
      location: item.location,
    };

    if (isProject(item)) {
      return (
        <MapPanelProjectItem
          {...commonProps}
          projectId={item.projectId}
          title={item.title}
          teamStatus={item.teamStatus}
          bannerImageUrl={item.bannerImageUrl}
        />
      );
    }

    if (isStudy(item)) {
      return (
        <MapPanelStudyItem
          {...commonProps}
          studyId={item.studyId}
          title={item.title}
          teamStatus={item.teamStatus}
          bannerImageUrl={item.bannerImageUrl}
        />
      );
    }

    if (isPlayer(item)) {
      return (
        <MapPanelPlayerItem
          {...commonProps}
          userId={item.userId}
          nickname={item.nickname}
          profileImageUrl={item.profileImageUrl}
        />
      );
    }

    if (isCafe(item)) {
      return (
        <MapPanelCafeItem
          {...commonProps}
          cafeId={item.cafeId}
          title={item.title}
          bannerImageUrl={item.bannerImageUrl}
          handleSubPanelToggle={handleSubPanelToggle}
        />
      );
    }

    return null;
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
        {filteredData.map((item, index) => (
          <div key={index}>
            {renderMapItem(item)}
            {index < filteredData.length - 1 && (
              <hr className={styles.panel__list__item__divider} />
            )}
          </div>
        ))}
      </div>

      {/* 패널 상태 표시 (임시) */}
      <div className={styles.panel__openStatus}>
        패널 상태 : {isMapPanelOpen ? 'OPENED' : 'CLOSED'}
      </div>

      {/* 서브 패널 상태 표시 (임시) */}
      <div className={styles.subPanel__openStatus}>
        서브 패널 상태 : {isMapSubPanelOpen ? 'OPENED' : 'CLOSED'}
      </div>
    </div>
  );
};

export default MapPanel;
