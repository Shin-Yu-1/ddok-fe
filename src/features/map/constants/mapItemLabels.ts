import { MapItemCategory, TeamStatus } from '../types/common';

/**
 * 지도 아이템 카테고리 한글 라벨 매핑
 */
export const MAP_ITEM_CATEGORY_LABELS = {
  [MapItemCategory.PROJECT]: '프로젝트',
  [MapItemCategory.STUDY]: '스터디',
  [MapItemCategory.PLAYER]: '플레이어',
  [MapItemCategory.CAFE]: '추천 장소',
} as const;

/**
 * 팀 상태 한글 라벨 매핑
 */
export const MAP_ITEM_STATUS_LABELS = {
  [TeamStatus.RECRUITING]: '모집 중',
  [TeamStatus.ONGOING]: '모집 완료',
} as const;

/**
 * 카테고리 필터 옵션 (전체 포함)
 */
export const CATEGORY_FILTER_OPTIONS = [
  { key: 'ALL', label: '전체', value: null },
  ...Object.entries(MAP_ITEM_CATEGORY_LABELS).map(([key, label]) => ({
    key,
    label,
    value: key as MapItemCategory,
  })),
] as const;

/**
 * 상태 필터 옵션 (전체 포함)
 */
export const STATUS_FILTER_OPTIONS = [
  { key: 'ALL', label: '전체', value: null },
  ...Object.entries(MAP_ITEM_STATUS_LABELS).map(([key, label]) => ({
    key,
    label,
    value: key as TeamStatus,
  })),
] as const;

/**
 * 카테고리 필터 옵션 타입
 */
export type CategoryFilterOption = (typeof CATEGORY_FILTER_OPTIONS)[number];

/**
 * 상태 필터 옵션 타입
 */
export type StatusFilterOption = (typeof STATUS_FILTER_OPTIONS)[number];
