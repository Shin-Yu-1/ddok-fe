/**
 * 지도 기능 관련 모든 타입들의 통합 export 파일
 */

// 공통 타입들
export type { Location, MapItemCategory, TeamStatus, BaseMapItem } from './common';

// 프로젝트 관련 타입들
export type { Project } from './project';

// 스터디 관련 타입들
export type { Study } from './study';

// 플레이어 관련 타입들
export type { Player } from './player';

// 카페 관련 타입들
export type { Cafe } from './cafe';

// 다시 import해서 union type 생성
import type { Cafe } from './cafe';
import type { Player } from './player';
import type { Project } from './project';
import type { Study } from './study';

// 통합 타입들
export type MapItem = Project | Study | Player | Cafe;

// 타입 가드 함수들
export const isProject = (item: MapItem): item is Project => item.category === 'project';

export const isStudy = (item: MapItem): item is Study => item.category === 'study';

export const isPlayer = (item: MapItem): item is Player => item.category === 'player';

export const isCafe = (item: MapItem): item is Cafe => item.category === 'cafe';
