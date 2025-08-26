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

export interface PlayerOverlayType {
  category: string;
  userId: number;
  nickname: string;
  profileImageUrl: string;
  mainBadge: {
    type: string;
    tier: string;
  };
  abandonBadge: {
    isGranted: boolean;
    count: number;
  };
  mainPosition: string;
  address: string;
  latestProject: {
    id: number;
    title: string;
    teamStatus: string;
  };
  latestStudy: {
    id: number;
    title: string;
    teamStatus: string;
  };
  temperature: number;
  isMine: boolean;
}
