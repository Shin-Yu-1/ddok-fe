import { useState, useCallback, useEffect } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/api';
import { useAuthStore } from '@/stores/authStore';
import type {
  CreateProjectData,
  CreateProjectResponse,
  ProjectMode,
  Location,
  PreferredAges,
} from '@/types/project';
import { initialFormData } from '@/types/project';

export const useCreateProjectForm = () => {
  const [formData, setFormData] = useState<CreateProjectData>(initialFormData);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // 컴포넌트 마운트 시 사용자의 메인 포지션을 자동으로 추가
  useEffect(() => {
    if (user?.mainPosition && formData.positions.length === 0) {
      const userMainPosition = user.mainPosition;

      setFormData(prev => ({
        ...prev,
        positions: [userMainPosition],
        leaderPosition: userMainPosition,
      }));
    }
  }, [user, formData.positions.length]);

  // 프로젝트 생성 API 함수
  const createProject = async (data: CreateProjectData): Promise<CreateProjectResponse> => {
    // FormData 객체 생성 (파일 업로드를 위해)
    const formDataToSend = new FormData();

    // 배너 이미지가 있을 때만 추가
    if (data.bannerImage) {
      formDataToSend.append('bannerImage', data.bannerImage);
    }

    const requestData: Omit<CreateProjectData, 'bannerImage'> = {
      title: data.title,
      expectedStart: data.expectedStart,
      expectedMonth: data.expectedMonth,
      mode: data.mode,
      location: data.mode === 'offline' ? data.location : null,
      preferredAges: data.preferredAges,
      capacity: data.capacity,
      traits: data.traits,
      positions: data.positions,
      leaderPosition: data.leaderPosition,
      detail: data.detail,
    };

    formDataToSend.append(
      'request',
      new Blob([JSON.stringify(requestData)], { type: 'application/json' })
    );

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
      navigate(`/detail/project/${response.data.projectId}`);
    },
    onError: error => {
      console.error('프로젝트 생성 실패:', error);
      // TODO: 에러 처리 (토스트 알림 등)
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
      // online 변경 시 location 초기화
      location: mode === 'online' ? null : prev.location,
    }));
  }, []);

  const updateLocation = useCallback((location: Location | null) => {
    setFormData(prev => ({ ...prev, location }));
  }, []);

  const updatePreferredAges = useCallback((preferredAges: PreferredAges | null) => {
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
  const validateForm = useCallback((): boolean => {
    // 필수 필드 검증
    if (!formData.title.trim()) return false;
    if (!formData.expectedStart) return false;
    if (formData.expectedMonth < 1) return false;

    // offline 모드일 때 위치 정보 필수
    if (formData.mode === 'offline' && !formData.location) return false;

    if (formData.capacity < 1) return false;
    if (formData.capacity > 7) return false;
    if (formData.positions.length === 0) return false;
    if (!formData.leaderPosition) return false;

    // 리더 포지션이 모집 포지션에 포함되어야 함
    if (!formData.positions.includes(formData.leaderPosition)) return false;

    if (!formData.detail.trim()) return false;

    return true;
  }, [formData]);

  // 프로젝트 생성 실행
  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      console.error('폼 유효성 검사 실패');
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
