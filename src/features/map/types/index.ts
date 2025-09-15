/**
 * 지도 기능 관련 모든 타입들의 통합 export 파일
 */

import type {
  CafeMapItem,
  CafePanelItem,
  PlayerMapItem,
  PlayerPanelItem,
  ProjectMapItem,
  ProjectPanelItem,
  StudyMapItem,
  StudyPanelItem,
} from '../schemas/mapItemSchema';

// 공통 타입들
export type { MapItemCategory, TeamStatus } from './common';

/** 지도상의 아이템 통합 타입 */
export type MapItem = ProjectMapItem | StudyMapItem | PlayerMapItem | CafeMapItem;

/** 패널 아이템 통합 타입 */
export type MapPanelItem = ProjectPanelItem | StudyPanelItem | PlayerPanelItem | CafePanelItem;

// 타입 가드 함수들
export const isProject = (item: MapPanelItem): item is ProjectPanelItem =>
  item.category === 'project';
export const isStudy = (item: MapPanelItem): item is StudyPanelItem => item.category === 'study';
export const isPlayer = (item: MapPanelItem): item is PlayerPanelItem => item.category === 'player';
export const isCafe = (item: MapPanelItem): item is CafePanelItem => item.category === 'cafe';
