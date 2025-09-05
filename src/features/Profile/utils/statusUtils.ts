import type { ParticipationHistory } from '../types';

export const getStatusText = (
  status: ParticipationHistory['status'],
  type: 'project' | 'study'
): string => {
  const prefix = type === 'project' ? '프로젝트' : '스터디';

  switch (status) {
    case 'ongoing':
      return `${prefix} 진행 중`;
    case 'completed':
      return `${prefix} 종료`;
    default:
      return `${prefix} 종료`;
  }
};
