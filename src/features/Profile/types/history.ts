// 프로젝트/스터디 참여 이력 (별도 API)
export interface ParticipationHistory {
  id: number;
  title: string;
  type: 'project' | 'study';
  status: 'ongoing' | 'completed';
  role?: string;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  description?: string;
}

export type ProjectHistory = ParticipationHistory & {
  type: 'project';
};

export type StudyHistory = ParticipationHistory & {
  type: 'study';
};
