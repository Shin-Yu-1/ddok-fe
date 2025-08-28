import { useState, useCallback, useEffect } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/api';
import type {
  UpdateProjectData,
  EditProjectResponse,
  CreateProjectResponse,
  ProjectMode,
  Location,
  PreferredAges,
} from '@/types/project';

interface UseEditProjectFormProps {
  projectId: number;
}

export const useEditProjectForm = ({ projectId }: UseEditProjectFormProps) => {
  const [formData, setFormData] = useState<UpdateProjectData | null>(null);
  const navigate = useNavigate();

  // 수정 페이지 데이터 조회
  const { data: editData, isLoading: isLoadingEdit } = useQuery({
    queryKey: ['project', 'edit', projectId],
    queryFn: async (): Promise<EditProjectResponse> => {
      const { data } = await api.get<EditProjectResponse>(`/api/projects/${projectId}/edit`);
      return data;
    },
    enabled: !!projectId,
  });

  // 조회된 데이터로 폼 초기화
  useEffect(() => {
    if (editData?.data) {
      const { data } = editData;

      // 위치 정보 파싱 (API 응답의 address 필드를 Location 타입으로 변환)
      let location: Location | null = null;
      if (data.mode === 'offline' && data.address !== 'online') {
        // TODO: 실제로는 address를 파싱해서 Location 객체로 변환해야 함
        // 현재는 임시로 null 처리
        location = null;
      }

      // positions 배열을 string[]로 변환
      const positions = data.positions.map(p => p.position);

      setFormData({
        title: data.title,
        expectedStart: data.startDate,
        expectedMonth: data.expectedMonth,
        mode: data.mode.toUpperCase() as ProjectMode,
        location,
        preferredAges: data.preferredAges,
        capacity: data.capacity,
        traits: data.traits,
        positions,
        leaderPosition: data.leaderPosition,
        detail: data.detail,
        teamStatus: data.teamStatus,
        bannerImageUrl: data.bannerImageUrl,
        bannerImage: null,
      });
    }
  }, [editData]);

  // 프로젝트 수정 API 함수
  const updateProject = async (data: UpdateProjectData): Promise<CreateProjectResponse> => {
    const formDataToSend = new FormData();

    // 새로운 배너 이미지가 있을 때만 추가
    if (data.bannerImage) {
      formDataToSend.append('bannerImage', data.bannerImage);
    }

    const requestData: Omit<UpdateProjectData, 'bannerImage'> = {
      title: data.title,
      expectedStart: data.expectedStart,
      teamStatus: data.teamStatus,
      expectedMonth: data.expectedMonth,
      mode: data.mode,
      location: data.mode === 'OFFLINE' ? data.location : null,
      preferredAges: data.preferredAges,
      capacity: data.capacity,
      traits: data.traits,
      positions: data.positions,
      leaderPosition: data.leaderPosition,
      detail: data.detail,
      bannerImageUrl: data.bannerImageUrl, // 기존 이미지 URL
    };

    formDataToSend.append(
      'request',
      new Blob([JSON.stringify(requestData)], { type: 'application/json' })
    );

    const response = await api.put<CreateProjectResponse>(
      `/api/projects/${projectId}`,
      formDataToSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  };

  // 프로젝트 수정 뮤테이션
  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: response => {
      // 성공 시 상세 페이지로 이동
      navigate(`/detail/project/${response.data.projectId}`);
    },
    onError: error => {
      console.error('프로젝트 수정 실패:', error);
      // TODO: 에러 처리 (토스트 알림 등)
    },
  });

  // 폼 데이터 업데이트 함수들
  const updateTitle = useCallback((title: string) => {
    setFormData(prev => (prev ? { ...prev, title } : null));
  }, []);

  const updateExpectedStart = useCallback((expectedStart: string) => {
    setFormData(prev => (prev ? { ...prev, expectedStart } : null));
  }, []);

  const updateExpectedMonth = useCallback((expectedMonth: number) => {
    setFormData(prev => (prev ? { ...prev, expectedMonth } : null));
  }, []);

  const updateMode = useCallback((mode: ProjectMode) => {
    setFormData(prev =>
      prev
        ? {
            ...prev,
            mode,
            location: mode === 'ONLINE' ? null : prev.location,
          }
        : null
    );
  }, []);

  const updateLocation = useCallback((location: Location | null) => {
    setFormData(prev => (prev ? { ...prev, location } : null));
  }, []);

  const updatePreferredAges = useCallback((preferredAges: PreferredAges | null) => {
    setFormData(prev => (prev ? { ...prev, preferredAges } : null));
  }, []);

  const updateCapacity = useCallback((capacity: number) => {
    setFormData(prev => (prev ? { ...prev, capacity } : null));
  }, []);

  const updateTraits = useCallback((traits: string[]) => {
    setFormData(prev => (prev ? { ...prev, traits } : null));
  }, []);

  const updatePositions = useCallback((positions: string[]) => {
    setFormData(prev => (prev ? { ...prev, positions } : null));
  }, []);

  const updateLeaderPosition = useCallback((leaderPosition: string) => {
    setFormData(prev => (prev ? { ...prev, leaderPosition } : null));
  }, []);

  const updateDetail = useCallback((detail: string) => {
    setFormData(prev => (prev ? { ...prev, detail } : null));
  }, []);

  const updateTeamStatus = useCallback((teamStatus: 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED') => {
    setFormData(prev => (prev ? { ...prev, teamStatus } : null));
  }, []);

  const updateBannerImage = useCallback((bannerImage: File | null) => {
    setFormData(prev => (prev ? { ...prev, bannerImage } : null));
  }, []);

  // 폼 유효성 검사
  const validateForm = useCallback((): boolean => {
    if (!formData) return false;

    if (!formData.title.trim()) return false;
    if (!formData.expectedStart) return false;
    if (formData.expectedMonth < 1) return false;
    if (formData.mode === 'OFFLINE' && !formData.location) return false;
    if (formData.capacity < 1 || formData.capacity > 7) return false;
    if (formData.positions.length === 0) return false;
    if (!formData.leaderPosition) return false;
    if (!formData.positions.includes(formData.leaderPosition)) return false;
    if (!formData.detail.trim()) return false;

    return true;
  }, [formData]);

  // 프로젝트 수정 실행
  const handleSubmit = useCallback(() => {
    if (!formData || !validateForm()) {
      console.error('폼 유효성 검사 실패');
      return;
    }

    updateProjectMutation.mutate(formData);
  }, [formData, validateForm, updateProjectMutation]);

  return {
    formData,
    isLoadingEdit,
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
    updateTeamStatus,
    updateBannerImage,
    handleSubmit,
    isSubmitting: updateProjectMutation.isPending,
    isValid: validateForm(),
  };
};
