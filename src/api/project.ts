import { api } from '@/api/api';
import type { CreateProjectRequest, CreateProjectFormData } from '@/types/project';

export interface CreateProjectResponse {
  success: boolean;
  data: {
    id: number;
    bannerImageUrl?: string;
  };
}

// FormData를 API 요청 형식으로 변환
export const formatCreateProjectRequest = (
  formData: CreateProjectFormData
): CreateProjectRequest => {
  const request: CreateProjectRequest = {
    title: formData.title,
    expectedStart: formData.expectedStart,
    expectedMonth: formData.expectedMonth,
    mode: formData.mode,
    preferredAges: formData.preferredAges,
    capacity: formData.capacity,
    traits: formData.traits,
    positions: formData.positions,
    leaderPosition: formData.leaderPosition,
    detail: formData.detail,
  };

  // OFFLINE 모드일 때만 location 추가
  if (formData.mode === 'OFFLINE' && formData.location) {
    request.location = formData.location;
  }

  // 배너 이미지가 있을 때만 추가
  if (formData.bannerImage) {
    request.bannerImage = formData.bannerImage;
  }

  return request;
};

// 프로젝트 생성 API
export const createProject = async (
  formData: CreateProjectFormData
): Promise<CreateProjectResponse> => {
  const requestData = formatCreateProjectRequest(formData);

  // FormData 객체 생성 (파일 업로드를 위해)
  const formDataToSend = new FormData();

  // 일반 데이터는 JSON 문자열로 변환하여 추가
  const { ...jsonData } = requestData;
  formDataToSend.append('data', JSON.stringify(jsonData));

  const response = await api.post<CreateProjectResponse>('/api/projects', formDataToSend, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
