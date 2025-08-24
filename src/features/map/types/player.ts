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
