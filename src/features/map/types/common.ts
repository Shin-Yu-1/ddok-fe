/**
 * 지도 기능에서 공통으로 사용되는 기본 타입들
 */

// 위치 정보 타입
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

// 지도 아이템 카테고리 타입
export type MapItemCategory = 'project' | 'study' | 'player' | 'cafe';

// 팀 상태 타입 (프로젝트, 스터디에서 사용)
export type TeamStatus = 'RECRUITING' | 'ONGOING';

// 지도 아이템 기본 인터페이스
export interface BaseMapItem {
  category: MapItemCategory;
  location: Location;
}
