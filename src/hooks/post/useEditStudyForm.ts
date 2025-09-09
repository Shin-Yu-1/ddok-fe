import { useState, useCallback, useEffect } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/api';
import type {
  UpdateStudyData,
  CreateStudyResponse,
  StudyMode,
  Location,
  PreferredAges,
  EditStudyResponse,
} from '@/types/study';

interface UseEditStudyFormProps {
  studyId: number;
}

export const useEditStudyForm = ({ studyId }: UseEditStudyFormProps) => {
  const [formData, setFormData] = useState<UpdateStudyData | null>(null);
  const navigate = useNavigate();

  // 수정 페이지 데이터 조회
  const { data: editData, isLoading: isLoadingEdit } = useQuery({
    queryKey: ['study', 'edit', studyId],
    queryFn: async (): Promise<EditStudyResponse> => {
      console.log('📥 스터디 수정 데이터 조회 시작');
      console.log('Study ID:', studyId);
      console.log('API URL:', `/api/studies/${studyId}/edit`);

      try {
        const { data } = await api.get<EditStudyResponse>(`/api/studies/${studyId}/edit`);

        console.log('✅ 수정 데이터 조회 성공:');
        console.log('Status:', data.status);
        console.log('Message:', data.message);
        console.log('Response Data:', JSON.stringify(data.data, null, 2));

        return data;
      } catch (error) {
        console.error('❌ 수정 데이터 조회 실패:');
        console.error('Error:', error);
        throw error;
      }
    },
    enabled: !!studyId,
  });

  // 조회된 데이터로 폼 초기화
  useEffect(() => {
    if (editData?.data) {
      const { data } = editData;

      // 위치 정보 파싱
      let location: Location | null = null;
      if (data.mode === 'offline') {
        // location 필드가 있으면 사용, 없으면 null
        location = data.location || null;
      }

      setFormData({
        title: data.title,
        expectedStart: data.startDate,
        expectedMonth: data.expectedMonth,
        mode: data.mode.toLowerCase() as StudyMode,
        location,
        preferredAges: data.preferredAges,
        capacity: data.capacity,
        traits: data.traits,
        studyType: data.studyType,
        detail: data.detail,
        teamStatus: data.teamStatus,
        bannerImageUrl: data.bannerImageUrl,
        bannerImage: null,
      });
    }
  }, [editData]);

  // 스터디 수정 API 함수
  const updateStudy = async (data: UpdateStudyData): Promise<CreateStudyResponse> => {
    const formDataToSend = new FormData();

    // 새로운 배너 이미지가 있을 때만 추가
    if (data.bannerImage) {
      formDataToSend.append('bannerImage', data.bannerImage);
    }

    const requestData: Omit<UpdateStudyData, 'bannerImage'> = {
      title: data.title,
      expectedStart: data.expectedStart,
      teamStatus: data.teamStatus,
      expectedMonth: data.expectedMonth,
      mode: data.mode,
      location: data.mode === 'offline' ? data.location : null,
      preferredAges: data.preferredAges,
      capacity: data.capacity,
      traits: data.traits,
      studyType: data.studyType,
      detail: data.detail,
      bannerImageUrl: data.bannerImageUrl, // 기존 이미지 URL
    };

    console.log('📤 API로 전송할 JSON 데이터:');
    console.log(JSON.stringify(requestData, null, 2));

    formDataToSend.append(
      'request',
      new Blob([JSON.stringify(requestData)], { type: 'application/json' })
    );

    const response = await api.patch<CreateStudyResponse>(
      `/api/studies/${studyId}`,
      formDataToSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  };

  // 스터디 수정 뮤테이션
  const updateStudyMutation = useMutation({
    mutationFn: updateStudy,
    onSuccess: response => {
      // 성공 시 상세 페이지로 이동
      navigate(`/detail/study/${response.data.studyId}`);
    },
    onError: error => {
      console.error('스터디 수정 실패:', error);
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

  const updateMode = useCallback((mode: StudyMode) => {
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

  const updateStudyType = useCallback((studyType: string) => {
    setFormData(prev => (prev ? { ...prev, studyType } : null));
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
        // 기본 이미지로 변경하는 경우: bannerImageUrl도 undefined로 설정
        return { ...prev, bannerImage: null, bannerImageUrl: undefined };
      }

      // 새로운 파일 업로드하는 경우
      return { ...prev, bannerImage };
    });
  }, []);

  // 폼 유효성 검사
  const validateForm = useCallback((): boolean => {
    if (!formData) return false;

    if (!formData.title.trim()) return false;
    if (!formData.expectedStart) return false;
    if (formData.expectedMonth < 1) return false;
    if (formData.mode === 'offline' && !formData.location) return false;
    if (formData.capacity < 1 || formData.capacity > 7) return false;
    if (!formData.studyType.trim()) return false;
    if (!formData.detail.trim()) return false;

    return true;
  }, [formData]);

  // 스터디 수정 실행
  const handleSubmit = useCallback(() => {
    if (!formData || !validateForm()) {
      console.error('폼 유효성 검사 실패');
      return;
    }

    updateStudyMutation.mutate(formData);
  }, [formData, validateForm, updateStudyMutation]);

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
    updateStudyType,
    updateDetail,
    updateTeamStatus,
    updateBannerImage,
    handleSubmit,
    isSubmitting: updateStudyMutation.isPending,
    isValid: validateForm(),
  };
};
