import type { ParticipationHistory } from '../types';

export const getStatusText = (
  status: ParticipationHistory['status'],
  type: 'project' | 'study'
): string => {
  switch (status) {
    case 'ONGOING':
      return type === 'project' ? '프로젝트 진행 중' : '스터디 진행 중';
    case 'CLOSED':
      return type === 'project' ? '프로젝트 완료' : '스터디 완료';
    default:
      return type === 'project' ? '프로젝트 완료' : '스터디 완료';
  }
};
