import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/api';
import type { DetailStudyResponse } from '@/types/study';

interface UseStudyDetailProps {
  studyId: number;
}

// 스터디 참여 신청/취소 응답 타입
interface StudyJoinResponse {
  status: number;
  message: string;
  data: {
    isApplied: boolean;
  } | null;
}

export const useStudyDetail = ({ studyId }: UseStudyDetailProps) => {
  console.log('🎯 useStudyDetail 훅이 호출되었습니다! studyId:', studyId);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 스터디 상세 조회
  const {
    data: studyResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['study', 'detail', studyId],
    queryFn: async (): Promise<DetailStudyResponse> => {
      console.log('📡 API 호출 시작 - studyId:', studyId);
      try {
        const { data } = await api.get<DetailStudyResponse>(`/api/studies/${studyId}`);
        console.log('✅ API 응답 성공:', data);
        return data;
      } catch (error) {
        console.error('❌ API 호출 에러:', error);
        throw error;
      }
    },
    enabled: !!studyId && studyId > 0,
  });

  console.log('📊 useStudyDetail 상태:', {
    studyId,
    isLoading,
    error,
    hasData: !!studyResponse,
    enabled: !!studyId && studyId > 0,
  });

  // 스터디 참여 신청/취소
  const joinStudyMutation = useMutation({
    mutationFn: async (): Promise<StudyJoinResponse> => {
      const { data } = await api.post<StudyJoinResponse>(`/api/studies/${studyId}/join`, {});
      return data;
    },
    onSuccess: response => {
      // 성공 시 스터디 상세 정보 다시 조회
      queryClient.invalidateQueries({ queryKey: ['study', 'detail', studyId] });

      // 성공 메시지 표시
      if (response.data?.isApplied) {
        console.log('스터디에 참여 신청했습니다.');
      } else {
        console.log('스터디 참여 신청을 취소했습니다.');
      }
    },
    onError: error => {
      console.error('스터디 참여 신청/취소 실패:', error);
      // TODO: 에러 처리 (토스트 알림 등)
    },
  });

  // 스터디 수정 페이지로 이동
  const handleEditStudy = () => {
    navigate(`/edit/study/${studyId}`);
  };

  // 스터디 참여 신청하기
  const handleApplyStudy = () => {
    joinStudyMutation.mutate();
  };

  // 참여 신청 취소하기
  const handleCancelApplication = () => {
    joinStudyMutation.mutate();
  };

  return {
    studyData: studyResponse?.data,
    isLoading,
    error,

    // 액션
    handleEditStudy,
    handleApplyStudy,
    handleCancelApplication,
    refetch,

    // 뮤테이션 상태
    isJoining: joinStudyMutation.isPending,
  };
};
