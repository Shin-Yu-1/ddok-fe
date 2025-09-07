import type { BaseMapItem } from './common';

/**
 * 카페 관련 타입 정의
 */

/** 지도상의 추천 장소 정보 */
export interface CafeMapItem extends BaseMapItem {
  cafeId: number;
  title: string;
}

/** 패널의 추천 장소 아이템 정보 */
export interface CafePanelItem extends CafeMapItem {
  bannerImageUrl: string;
}
