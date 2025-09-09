export enum NotificationType {
  PROJECT_JOIN_REQUEST = 'PROJECT_JOIN_REQUEST', // 프로젝트 참여 승인 요청
  PROJECT_JOIN_APPROVED = 'PROJECT_JOIN_APPROVED', // 프로젝트 참여 희망 승인
  STUDY_JOIN_REQUEST = 'STUDY_JOIN_REQUEST', // 스터디 참여 승인 요청
  STUDY_JOIN_APPROVED = 'STUDY_JOIN_APPROVED', // 스터디 참여 희망 승인
  DM_REQUEST = 'DM_REQUEST', // DM 요청
  ACHIEVEMENT = 'ACHIEVEMENT', // 업적 달성
  TEAM_LEADER_VIOLATION = 'TEAM_LEADER_VIOLATION', // 팀 리더의 일탈
  TEAM_MEMBER_VIOLATION = 'TEAM_MEMBER_VIOLATION', // 팀원의 일탈
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
  userId?: string;
  userNickname?: string;
  projectId?: string;
  projectTitle?: string;
  studyId?: string;
  studyTitle?: string;
  achievementName?: string;
  teamId?: string;
  teamName?: string;
}

export interface NotificationAction {
  type: 'accept' | 'reject';
  label: string;
  variant: 'primary' | 'secondary';
}

export const notificationConfig: Record<
  NotificationType,
  {
    title: string;
    hasActions: boolean;
    actions?: NotificationAction[];
  }
> = {
  [NotificationType.PROJECT_JOIN_REQUEST]: {
    title: '프로젝트 참여 승인 요청',
    hasActions: true,
    actions: [
      { type: 'accept', label: '수락', variant: 'primary' },
      { type: 'reject', label: '거절', variant: 'secondary' },
    ],
  },
  [NotificationType.PROJECT_JOIN_APPROVED]: {
    title: '프로젝트 참여 희망 승인',
    hasActions: false,
  },
  [NotificationType.STUDY_JOIN_REQUEST]: {
    title: '스터디 참여 승인 요청',
    hasActions: true,
    actions: [
      { type: 'accept', label: '수락', variant: 'primary' },
      { type: 'reject', label: '거절', variant: 'secondary' },
    ],
  },
  [NotificationType.STUDY_JOIN_APPROVED]: {
    title: '스터디 참여 희망 승인',
    hasActions: false,
  },
  [NotificationType.DM_REQUEST]: {
    title: 'DM 요청',
    hasActions: true,
    actions: [
      { type: 'accept', label: '수락', variant: 'primary' },
      { type: 'reject', label: '거절', variant: 'secondary' },
    ],
  },
  [NotificationType.ACHIEVEMENT]: {
    title: '업적 달성',
    hasActions: false,
  },
  [NotificationType.TEAM_LEADER_VIOLATION]: {
    title: '팀 리더의 일탈',
    hasActions: false,
  },
  [NotificationType.TEAM_MEMBER_VIOLATION]: {
    title: '팀원의 일탈',
    hasActions: false,
  },
};
