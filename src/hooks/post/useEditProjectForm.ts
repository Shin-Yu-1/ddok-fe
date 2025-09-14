import { useState, useCallback, useEffect } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/api';
import { DDtoast } from '@/features/toast';
import type {
  UpdateProjectData,
  CreateProjectResponse,
  ProjectMode,
  Location,
  PreferredAges,
  EditProjectResponse,
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
      console.log('✅ 프로젝트 수정 데이터 조회 성공:', data);
      return data;
    },
    enabled: !!projectId,
  });

  // 조회된 데이터로 폼 초기화
  useEffect(() => {
    if (editData?.data) {
      const { data } = editData;

      // positions 배열을 string[]로 변환
      const positions = data.positions.map(p => p.position);

      // 리더 포지션 찾기 (확정된 포지션 또는 첫 번째 포지션)
      const leaderPosition = positions.length > 0 ? positions[0] : '';

      setFormData({
        title: data.title,
        expectedStart: data.startDate,
        expectedMonth: data.expectedMonth,
        mode: data.mode.toLowerCase() as ProjectMode,
        location: data.location,
        preferredAges: data.preferredAges,
        capacity: data.capacity,
        traits: data.traits,
        positions,
        leaderPosition,
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

    // bannerImageUrl 처리 로직 개선
    let bannerImageUrlToSend: string | undefined;

    if (data.bannerImage) {
      // 새로운 이미지를 업로드하는 경우: bannerImageUrl 안보냄
      bannerImageUrlToSend = undefined;
    } else if (data.bannerImageUrl === undefined) {
      // 기본 이미지로 변경하는 경우: bannerImageUrl 안보냄
      bannerImageUrlToSend = undefined;
    } else {
      // 기존 이미지를 유지하는 경우: 기존 bannerImageUrl 보냄
      bannerImageUrlToSend = data.bannerImageUrl;
    }

    const requestData: Omit<UpdateProjectData, 'bannerImage' | 'bannerImageUrl'> & {
      bannerImageUrl?: string;
    } = {
      title: data.title,
      expectedStart: data.expectedStart,
      teamStatus: data.teamStatus,
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

    // bannerImageUrl이 정의된 경우에만 추가
    if (bannerImageUrlToSend !== undefined) {
      requestData.bannerImageUrl = bannerImageUrlToSend;
    }

    console.log('📤 API로 전송할 JSON 데이터:');
    console.log(JSON.stringify(requestData, null, 2));
    console.log('📤 전송할 bannerImage 파일:', data.bannerImage ? data.bannerImage.name : 'none');
    console.log('📤 전송할 bannerImageUrl:', bannerImageUrlToSend);

    formDataToSend.append(
      'request',
      new Blob([JSON.stringify(requestData)], { type: 'application/json' })
    );

    const response = await api.patch<CreateProjectResponse>(
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
      DDtoast({
        mode: 'server-first',
        type: 'success',
        userMessage: '프로젝트가 성공적으로 수정되었습니다! 🎉',
        apiResponse: response,
      });

      // 성공 시 상세 페이지로 이동
      navigate(`/detail/project/${response.data.projectId}`);
    },
    onError: error => {
      console.error('프로젝트 수정 실패:', error);

      DDtoast({
        mode: 'server-first',
        userMessage: '프로젝트 수정 중 문제가 발생했습니다.',
        apiResponse: error,
      });
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
            location: mode === 'online' ? null : prev.location,
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

  const updateTeamStatus = useCallback((teamStatus: 'RECRUITING' | 'ONGOING' | 'CLOSED') => {
    setFormData(prev => (prev ? { ...prev, teamStatus } : null));
  }, []);

  const updateBannerImage = useCallback((bannerImage: File | null) => {
    setFormData(prev => {
      if (!prev) return null;

      if (bannerImage === null) {
        // null을 전달받은 경우의 처리를 더 명확하게
        // 이는 "기본 이미지 사용" 또는 "현재 이미지 제거"를 의미
        return { ...prev, bannerImage: null, bannerImageUrl: undefined };
      }

      // 새로운 파일 업로드하는 경우
      return { ...prev, bannerImage, bannerImageUrl: undefined };
    });
  }, []);

  // 폼 유효성 검사 및 오류 메시지 반환
  const validateForm = useCallback((): { isValid: boolean; errors: string[] } => {
    if (!formData) return { isValid: false, errors: ['폼 데이터를 불러오는 중입니다'] };

    const errors: string[] = [];

    if (!formData.title.trim()) {
      errors.push('프로젝트 제목을 입력해주세요');
    }

    if (!formData.expectedStart) {
      errors.push('시작 예정일을 선택해주세요');
    }

    if (formData.expectedMonth < 1) {
      errors.push('예상 기간은 최소 1개월 이상이어야 합니다');
    }

    if (formData.mode === 'offline' && !formData.location) {
      errors.push('오프라인 모임의 경우 지역을 선택해주세요');
    }

    if (formData.capacity < 1) {
      errors.push('모집 인원은 최소 1명 이상이어야 합니다');
    }

    if (formData.capacity > 7) {
      errors.push('모집 인원은 최대 7명까지 가능합니다');
    }

    if (formData.positions.length === 0) {
      errors.push('최소 1개 이상의 모집 포지션을 추가해주세요');
    }

    if (!formData.leaderPosition) {
      errors.push('리더 포지션을 선택해주세요');
    }

    if (formData.leaderPosition && !formData.positions.includes(formData.leaderPosition)) {
      errors.push('리더 포지션이 모집 포지션에 포함되어야 합니다');
    }

    if (!formData.detail.trim()) {
      errors.push('프로젝트 상세 내용을 작성해주세요');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [formData]);

  // 유효성 검사와 토스트를 함께 처리하는 함수
  const validateFormWithToast = useCallback((): boolean => {
    const validation = validateForm();

    if (!validation.isValid) {
      // 유효성 검사 실패 시 토스트로 오류 메시지 표시
      const errorMessage = validation.errors.join('\n• ');

      DDtoast({
        mode: 'custom',
        type: 'warning',
        userMessage: `입력 정보를 확인해주세요:\n\n• ${errorMessage}`,
        duration: 6000,
      });

      return false;
    }

    return true;
  }, [validateForm]);

  // 프로젝트 수정 실행
  const handleSubmit = useCallback(() => {
    if (!formData || !validateFormWithToast()) {
      return;
    }

    updateProjectMutation.mutate(formData);
  }, [formData, validateFormWithToast, updateProjectMutation]);

  // isValid 계산
  const isValid = validateForm().isValid;

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
    editData,
    isSubmitting: updateProjectMutation.isPending,
    isValid,
  };
};
