import type { BaseMapItem, TeamStatus } from './common';

/**
 * 프로젝트 관련 타입 정의
 */

export interface Project extends BaseMapItem {
  category: 'project';
  projectId: number;
  title: string;
  teamStatus: TeamStatus;
  bannerImageUrl: string;
}
