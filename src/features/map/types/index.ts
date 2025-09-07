/**
 * 지도 기능 관련 모든 타입들의 통합 export 파일
 */

// 공통 타입들
export type { Location, MapItemCategory, TeamStatus, BaseMapItem } from './common';

// 프로젝트 관련 타입들
export type { ProjectPanelItem, ProjectMapItem } from './project';

// 스터디 관련 타입들
export type { StudyPanelItem, StudyMapItem } from './study';

// 플레이어 관련 타입들
export type { PlayerPanelItem, PlayerMapItem } from './player';

// 카페 관련 타입들
export type { CafePanelItem, CafeMapItem } from './cafe';

// 다시 import해서 union type 생성
import type { CafePanelItem, CafeMapItem } from './cafe';
import type { PlayerPanelItem, PlayerMapItem } from './player';
import type { ProjectPanelItem, ProjectMapItem } from './project';
import type { StudyPanelItem, StudyMapItem } from './study';

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
