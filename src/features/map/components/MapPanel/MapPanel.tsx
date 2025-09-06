import { useState, useMemo } from 'react';

import { MagnifyingGlassIcon } from '@phosphor-icons/react';

import Input from '@/components/Input/Input';

import type { Pagination } from '../../schemas/mapSearchSchema';
import type { MapPanelItem } from '../../types';
import { isProject, isStudy, isPlayer, isCafe } from '../../types';
import {
  CATEGORY_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  MapItemCategory,
  type CategoryFilterOption,
  type StatusFilterOption,
} from '../../types/common';
import MapPanelCafeItem from '../MapPanelItem/MapPanelCafeItem/MapPanelCafeItem';
import MapPanelPlayerItem from '../MapPanelItem/MapPanelPlayerItem/MapPanelPlayerItem';
import MapPanelProjectItem from '../MapPanelItem/MapPanelProjectItem/MapPanelProjectItem';
import MapPanelStudyItem from '../MapPanelItem/MapPanelStudyItem/MapPanelStudyItem';

import MapPagination from './MapPagination/MapPagination';
import styles from './MapPanel.module.scss';

interface MapPanelProps {
  data?: MapPanelItem[];
  pagination?: Pagination;
  isLoading?: boolean;
  handleItemClick: (itemType: MapItemCategory, itemId?: number) => void;
  onPageChange?: (page: number) => void;
  onFilterChange?: (category?: string, filter?: string) => void;
}

const MapPanel: React.FC<MapPanelProps> = ({
  data,
  pagination,
  isLoading,
  handleItemClick,
  onPageChange,
  onFilterChange,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryFilterOption>(
    CATEGORY_FILTER_OPTIONS[0] // 전체
  );

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<StatusFilterOption>(
    STATUS_FILTER_OPTIONS[0] // 전체
  );

  const handleFilterClick = (option: CategoryFilterOption) => {
    setSelectedCategoryFilter(option);
    setSelectedStatusFilter(STATUS_FILTER_OPTIONS[0]); // 전체로 리셋

    // 상위 컴포넌트에 필터 변경 알림
    if (onFilterChange) {
      const categoryValue = option.value || undefined;
      onFilterChange(categoryValue, undefined);
    }
  };

  // 데이터 필터링 함수
  const filteredData = useMemo(() => {
    const sourceData = data || [];
    let filtered = sourceData;

    // 1. 카테고리 필터링
    if (selectedCategoryFilter.value) {
      filtered = filtered.filter(item => item.category === selectedCategoryFilter.value);
    }

    // 2. 모집 상태 필터링(프로젝트와 스터디만 적용)
    if (selectedStatusFilter.value) {
      filtered = filtered.filter(item => {
        if (isProject(item) || isStudy(item)) {
          return item.teamStatus === selectedStatusFilter.value;
        }
        // player, cafe는 teamStatus가 없으므로 상태 필터가 적용된 경우 제외
        return false;
      });
    }

    return filtered;
  }, [data, selectedCategoryFilter, selectedStatusFilter]);

  // 타입별 컴포넌트 렌더링 함수
  const renderMapItem = (item: MapPanelItem) => {
    if (isProject(item)) {
      return (
        <MapPanelProjectItem
          project={item}
          onItemClick={() => handleItemClick(MapItemCategory.PROJECT, item.projectId)}
        />
      );
    }

    if (isStudy(item)) {
      return (
        <MapPanelStudyItem
          study={item}
          onItemClick={() => handleItemClick(MapItemCategory.STUDY, item.studyId)}
        />
      );
    }

    if (isPlayer(item)) {
      return (
        <MapPanelPlayerItem
          player={item}
          onItemClick={() => handleItemClick(MapItemCategory.PLAYER, item.userId)}
        />
      );
    }

    if (isCafe(item)) {
      return (
        <MapPanelCafeItem
          cafe={item}
          onItemClick={() => handleItemClick(MapItemCategory.CAFE, item.cafeId)}
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
            fontSize="var(--fs-xxsmall)"
            iconSize="var(--i-large)"
            leftIcon={<MagnifyingGlassIcon size="var(--i-large)" weight="light" />}
          />
        </div>

        {/* 구분선 */}
        <hr className={styles.panel__divider} />

        {/* 카테고리 필터*/}
        <div className={styles.panel__categoryFilter}>
          {CATEGORY_FILTER_OPTIONS.map(option => (
            <div
              key={option.key}
              className={`${styles.panel__categoryFilter__item} ${
                selectedCategoryFilter.key === option.key
                  ? styles.panel__categoryFilter__item__selected
                  : ''
              }`}
              onClick={() => {
                handleFilterClick(option);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>

        {/* 구분선 */}
        <hr className={styles.panel__divider} />

        {/* 진행 상태 필터*/}
        {selectedCategoryFilter.key === MapItemCategory.PROJECT ||
        selectedCategoryFilter.key === MapItemCategory.STUDY ? (
          <>
            <div className={styles.panel__statusFilter}>
              {/* TODO: 버튼 컴포넌트 가져오기 */}
              {STATUS_FILTER_OPTIONS.map(option => (
                <div
                  key={option.key}
                  className={`${styles.panel__statusFilter__item} ${
                    selectedStatusFilter.key === option.key
                      ? styles.panel__statusFilter__item__selected
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedStatusFilter(option);

                    // 상위 컴포넌트에 필터 변경 알림
                    if (onFilterChange) {
                      const categoryValue = selectedCategoryFilter.value || undefined;
                      const filterValue = option.value || undefined;
                      onFilterChange(categoryValue, filterValue);
                    }
                  }}
                >
                  {option.label}
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
        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-2)' }}>
            검색 중...
          </div>
        ) : filteredData.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-2)' }}>
            검색 결과가 없습니다.
          </div>
        ) : (
          filteredData.map((item, index) => (
            <div key={index}>
              {renderMapItem(item)}
              {index < filteredData.length - 1 && (
                <hr className={styles.panel__list__item__divider} />
              )}
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {pagination && onPageChange && (
        <MapPagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
};

export default MapPanel;
