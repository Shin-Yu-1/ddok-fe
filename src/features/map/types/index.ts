/**
 * 지도 기능 관련 모든 타입들의 통합 export 파일
 */

// 공통 타입들
export type { Location, MapItemCategory, TeamStatus, BaseMapItem } from './common';

// 프로젝트 관련 타입들
export type { ProjectPanelItem } from './project';

// 스터디 관련 타입들
export type { StudyPanelItem } from './study';

// 플레이어 관련 타입들
export type { PlayerPanelItem } from './player';

// 카페 관련 타입들
export type { CafePanelItem } from './cafe';

// 다시 import해서 union type 생성
import type { CafePanelItem, CafeOverlayData } from './cafe';
import type { PlayerPanelItem, PlayerOverlayData } from './player';
import type { ProjectPanelItem, ProjectOverlayData } from './project';
import type { StudyPanelItem, StudyOverlayData } from './study';

/** 패널 아이템 통합 타입 */
export type MapPanelItem = ProjectPanelItem | StudyPanelItem | PlayerPanelItem | CafePanelItem;

/** 오버레이 통합 타입 */
export type MapOverlayData =
  | ProjectOverlayData
  | StudyOverlayData
  | PlayerOverlayData
  | CafeOverlayData;

// 타입 가드 함수들
export const isProject = (item: MapPanelItem): item is ProjectPanelItem =>
  item.category === 'project';
export const isStudy = (item: MapPanelItem): item is StudyPanelItem => item.category === 'study';
export const isPlayer = (item: MapPanelItem): item is PlayerPanelItem => item.category === 'player';
export const isCafe = (item: MapPanelItem): item is CafePanelItem => item.category === 'cafe';
