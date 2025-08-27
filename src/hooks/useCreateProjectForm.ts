import { useState, useCallback } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/api';
import type { CreateProjectData, ProjectMode, Location, PreferredAges } from '@/types/project';
import { initialFormData } from '@/types/project';

interface CreateProjectResponse {
  success: boolean;
  data: {
    id: number;
    bannerImageUrl?: string;
  };
}

export const useCreateProjectForm = () => {
  const [formData, setFormData] = useState<CreateProjectData>(initialFormData);
  const navigate = useNavigate();

  // 프로젝트 생성 API 함수
  const createProject = async (data: CreateProjectData): Promise<CreateProjectResponse> => {
    // FormData 객체 생성 (파일 업로드를 위해)
    const formDataToSend = new FormData();

    // 배너 이미지가 있으면 추가, 없으면 null로 처리
    if (data.bannerImage) {
      formDataToSend.append('bannerImage', data.bannerImage);
    }

    // 나머지 데이터는 JSON으로 추가 (null 값도 포함)
    const requestData = {
      title: data.title,
      expectedStart: data.expectedStart,
      expectedMonth: data.expectedMonth,
      mode: data.mode,
      location: data.location,
      preferredAges: data.preferredAges,
      capacity: data.capacity,
      traits: data.traits,
      positions: data.positions,
      leaderPosition: data.leaderPosition,
      detail: data.detail,
      bannerImage: data.bannerImage,
    };

    formDataToSend.append('data', JSON.stringify(requestData));

    const response = await api.post<CreateProjectResponse>('/api/projects', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  };

  // 프로젝트 생성 뮤테이션
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: response => {
      // 성공 시 상세 페이지로 이동
      navigate(`/detail/project/${response.data.id}`);
    },
    onError: error => {
      console.error('프로젝트 생성 실패:', error);
      // 에러 처리 (토스트 알림 등)
    },
  });

  // 폼 데이터 업데이트 함수들
  const updateTitle = useCallback((title: string) => {
    setFormData(prev => ({ ...prev, title }));
  }, []);

  const updateExpectedStart = useCallback((expectedStart: string) => {
    setFormData(prev => ({ ...prev, expectedStart }));
  }, []);

  const updateExpectedMonth = useCallback((expectedMonth: number) => {
    setFormData(prev => ({ ...prev, expectedMonth }));
  }, []);

  const updateMode = useCallback((mode: ProjectMode) => {
    setFormData(prev => ({
      ...prev,
      mode,
      // ONLINE으로 변경 시 location 초기화
      location: mode === 'ONLINE' ? null : prev.location,
    }));
  }, []);

  const updateLocation = useCallback((location: Location | null) => {
    setFormData(prev => ({ ...prev, location }));
  }, []);

  const updatePreferredAges = useCallback((preferredAges: PreferredAges) => {
    setFormData(prev => ({ ...prev, preferredAges }));
  }, []);

  const updateCapacity = useCallback((capacity: number) => {
    setFormData(prev => ({ ...prev, capacity }));
  }, []);

  const updateTraits = useCallback((traits: string[]) => {
    setFormData(prev => ({ ...prev, traits }));
  }, []);

  const updatePositions = useCallback((positions: string[]) => {
    setFormData(prev => ({ ...prev, positions }));
  }, []);

  const updateLeaderPosition = useCallback((leaderPosition: string) => {
    setFormData(prev => ({ ...prev, leaderPosition }));
  }, []);

  const updateDetail = useCallback((detail: string) => {
    setFormData(prev => ({ ...prev, detail }));
  }, []);

  const updateBannerImage = useCallback((bannerImage: File | null) => {
    setFormData(prev => ({ ...prev, bannerImage }));
  }, []);

  // 폼 유효성 검사
  // TODO: zod로 변경 필요
  const validateForm = useCallback((): boolean => {
    if (!formData.title.trim()) return false;
    if (!formData.expectedStart) return false;
    if (formData.expectedMonth < 1) return false;
    if (formData.mode === 'OFFLINE' && !formData.location) return false;
    if (formData.capacity < 2) return false;
    if (formData.positions.length === 0) return false;
    if (!formData.leaderPosition) return false;
    if (!formData.detail.trim()) return false;

    return true;
  }, [formData]);

  // 프로젝트 생성 실행
  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      console.error('폼 유효성 검사 실패');
      // 유효성 검사 실패 알림
      return;
    }

    createProjectMutation.mutate(formData);
  }, [formData, validateForm, createProjectMutation]);

  return {
    formData,
    updateTitle,
    updateExpectedStart,
    updateExpectedMonth,
    updateMode,
    updateLocation,
    updatePreferredAges,
    updateCapacity,
    updateTraits,
    updatePositions,
    updateLeaderPosition,
    updateDetail,
    updateBannerImage,
    handleSubmit,
    isSubmitting: createProjectMutation.isPending,
    isValid: validateForm(),
  };
};
