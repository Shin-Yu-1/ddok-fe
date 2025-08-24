import type { BaseMapItem, TeamStatus } from './common';

/**
 * 스터디 관련 타입 정의
 */

export interface Study extends BaseMapItem {
  category: 'study';
  studyId: number;
  title: string;
  teamStatus: TeamStatus;
  bannerImageUrl: string;
}
