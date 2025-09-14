import { useState, useCallback } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/api';
import { DDtoast } from '@/features/toast';
import type {
  CreateStudyData,
  CreateStudyResponse,
  StudyMode,
  Location,
  PreferredAges,
} from '@/types/study';
import { initialFormData } from '@/types/study';

export const useCreateStudyForm = () => {
  const [formData, setFormData] = useState<CreateStudyData>(initialFormData);
  const navigate = useNavigate();

  // 스터디 생성 API 함수
  const createStudy = async (data: CreateStudyData): Promise<CreateStudyResponse> => {
    // FormData 객체 생성 (파일 업로드를 위해)
    const formDataToSend = new FormData();

    // 배너 이미지가 있을 때만 추가
    if (data.bannerImage) {
      formDataToSend.append('bannerImage', data.bannerImage);
    }

    const requestData: Omit<CreateStudyData, 'bannerImage'> = {
      title: data.title,
      expectedStart: data.expectedStart,
      expectedMonth: data.expectedMonth,
      mode: data.mode,
      location: data.mode === 'offline' ? data.location : null,
      preferredAges: data.preferredAges,
      capacity: data.capacity,
      traits: data.traits,
      studyType: data.studyType,
      detail: data.detail,
    };

    console.log('📤 스터디 생성 API 요청 데이터:');
    console.log(JSON.stringify(requestData, null, 2));

    formDataToSend.append(
      'request',
      new Blob([JSON.stringify(requestData)], { type: 'application/json' })
    );

    const response = await api.post<CreateStudyResponse>('/api/studies', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  };

  // 스터디 생성 뮤테이션
  const createStudyMutation = useMutation({
    mutationFn: createStudy,
    onSuccess: response => {
      console.log('✅ 스터디 생성 성공:', response);

      DDtoast({
        mode: 'server-first',
        type: 'success',
        userMessage: '스터디가 성공적으로 생성되었습니다! 🎉',
        apiResponse: response,
      });

      // 성공 시 상세 페이지로 이동
      navigate(`/detail/study/${response.data.studyId}`);
    },
    onError: error => {
      console.error('❌ 스터디 생성 실패:', error);

      DDtoast({
        mode: 'server-first',
        userMessage: '스터디 생성 중 문제가 발생했습니다.',
        apiResponse: error,
      });
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

  const updateMode = useCallback((mode: StudyMode) => {
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

  const updateStudyType = useCallback((studyType: string) => {
    setFormData(prev => ({ ...prev, studyType }));
  }, []);

  const updateDetail = useCallback((detail: string) => {
    setFormData(prev => ({ ...prev, detail }));
  }, []);

  const updateBannerImage = useCallback((bannerImage: File | null) => {
    setFormData(prev => ({ ...prev, bannerImage }));
  }, []);

  // 폼 유효성 검사 및 오류 메시지 반환
  const validateForm = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // 필수 필드 검증
    if (!formData.title.trim()) {
      errors.push('스터디 제목을 입력해주세요');
    }

    if (!formData.expectedStart) {
      errors.push('시작 예정일을 선택해주세요');
    }

    if (formData.expectedMonth < 1) {
      errors.push('예상 기간은 최소 1개월 이상이어야 합니다');
    }

    // offline 모드일 때 위치 정보 필수
    if (formData.mode === 'offline' && !formData.location) {
      errors.push('오프라인 모임의 경우 지역을 선택해주세요');
    }

    if (formData.capacity < 1) {
      errors.push('모집 인원은 최소 1명 이상이어야 합니다');
    }

    if (formData.capacity > 7) {
      errors.push('모집 인원은 최대 7명까지 가능합니다');
    }

    if (!formData.studyType.trim()) {
      errors.push('스터디 유형을 선택해주세요');
    }

    if (!formData.detail.trim()) {
      errors.push('스터디 상세 내용을 작성해주세요');
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

  // 스터디 생성 실행
  const handleSubmit = useCallback(() => {
    if (!validateFormWithToast()) {
      return;
    }

    createStudyMutation.mutate(formData);
  }, [formData, validateFormWithToast, createStudyMutation]);

  const { isValid } = validateForm();

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
    updateStudyType,
    updateDetail,
    updateBannerImage,
    handleSubmit,
    isSubmitting: createStudyMutation.isPending,
    isValid,
  };
};
