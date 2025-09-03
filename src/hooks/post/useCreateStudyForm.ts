import { useState, useCallback } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/api';
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
      // 성공 시 상세 페이지로 이동
      navigate(`/detail/study/${response.data.studyId}`);
    },
    onError: error => {
      console.error('스터디 생성 실패:', error);
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
    if (!formData.studyType.trim()) return false; // 스터디 타입 필수
    if (!formData.detail.trim()) return false;

    return true;
  }, [formData]);

  // 스터디 생성 실행
  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      console.error('폼 유효성 검사 실패');
      return;
    }

    createStudyMutation.mutate(formData);
  }, [formData, validateForm, createStudyMutation]);

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
    updateStudyType, // 프로젝트와의 차이점
    updateDetail,
    updateBannerImage,
    handleSubmit,
    isSubmitting: createStudyMutation.isPending,
    isValid: validateForm(),
  };
};
