/**
 * 지도 기능에서 공통으로 사용되는 기본 타입들
 */

/** 위치 정보 타입 */
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

/** 지도 아이템 카테고리 타입 */
export type MapItemCategory = 'project' | 'study' | 'player' | 'cafe';

/** 프로젝트 및 스터디의 팀 상태 */
export type TeamStatus = 'RECRUITING' | 'ONGOING';

/** 패널 아이템 기본 인터페이스(공통 데이터) */
export interface BaseMapItem {
  category: MapItemCategory;
  location: Location;
}

/** 지도 사각형 영역 및 중심 좌표에 대한 정보 */
export interface MapBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
  lat: number;
  lng: number;
}
