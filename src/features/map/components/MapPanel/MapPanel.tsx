import { useState, useMemo } from 'react';

import Input from '@/components/Input/Input';

import { MapItemFilter } from '../../constants/MapItemCategoryFilter.enum';
import { MapItemStatusFilter } from '../../constants/MapItemStatusFilter.enum';
import { panelMockData } from '../../mocks/panelMockData';
import type { MapItem } from '../../types';
import { isProject, isStudy, isPlayer, isCafe } from '../../types';
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

const MapPanel: React.FC<MapPanelProps> = ({
  isMapPanelOpen,
  isMapSubPanelOpen,
  handleSubPanelToggle, // TODO: 실제 컴포넌트에서 사용할 때 활성화
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
  const renderMapItem = (item: MapItem) => {
    if (isProject(item)) {
      return (
        <MapPanelProjectItem
          category={item.category}
          projectId={item.projectId}
          title={item.title}
          location={item.location}
          teamStatus={item.teamStatus}
          bannerImageUrl={item.bannerImageUrl}
        />
      );
    }

    if (isStudy(item)) {
      return (
        <MapPanelStudyItem
          category={item.category}
          studyId={item.studyId}
          title={item.title}
          location={item.location}
          teamStatus={item.teamStatus}
          bannerImageUrl={item.bannerImageUrl}
        />
      );
    }

    if (isPlayer(item)) {
      return (
        <MapPanelPlayerItem
          category={item.category}
          userId={item.userId}
          nickname={item.nickname}
          location={item.location}
          profileImageUrl={item.profileImageUrl}
        />
      );
    }

    if (isCafe(item)) {
      return (
        <MapPanelCafeItem
          category={item.category}
          cafeId={item.cafeId}
          title={item.title}
          location={item.location}
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
