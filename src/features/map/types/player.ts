import type { BaseMapItem } from './common';

/**
 * 플레이어 관련 타입 정의
 */

export interface Player extends BaseMapItem {
  category: 'player';
  userId: number;
  nickname: string;
  profileImageUrl: string;
}

// 플레이어 생성/수정 시 사용할 입력 타입
export interface PlayerInput {
  nickname: string;
  profileImageUrl: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

// 플레이어 리스트 아이템 (요약 정보)
export interface PlayerSummary {
  userId: number;
  nickname: string;
  location: {
    address: string;
  };
}
