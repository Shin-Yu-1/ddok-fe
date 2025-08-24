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

// 프로젝트 생성/수정 시 사용할 입력 타입
export interface ProjectInput {
  title: string;
  teamStatus: TeamStatus;
  bannerImageUrl: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

// 프로젝트 리스트 아이템 (요약 정보)
export interface ProjectSummary {
  projectId: number;
  title: string;
  teamStatus: TeamStatus;
  location: {
    address: string;
  };
}
