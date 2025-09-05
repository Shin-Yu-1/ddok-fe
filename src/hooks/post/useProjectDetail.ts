import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/api';
import type {
  DetailProjectResponse,
  ProjectJoinRequest,
  ProjectJoinResponse,
} from '@/types/project';

interface UseProjectDetailProps {
  projectId: number;
}

export const useProjectDetail = ({ projectId }: UseProjectDetailProps) => {
  console.log('🎯 useProjectDetail 훅이 호출되었습니다! projectId:', projectId);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 프로젝트 상세 조회 - 조건 없이 바로 실행
  const {
    data: projectResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['project', 'detail', projectId],
    queryFn: async (): Promise<DetailProjectResponse> => {
      console.log('📡 API 호출 시작 - projectId:', projectId);
      try {
        const { data } = await api.get<DetailProjectResponse>(`/api/projects/${projectId}`);
        console.log('✅ API 응답 성공:', data);
        return data;
      } catch (error) {
        console.error('❌ API 호출 에러:', error);
        throw error;
      }
    },
  });

  console.log('📊 useProjectDetail 상태:', {
    projectId,
    isLoading,
    error,
    hasData: !!projectResponse,
    enabled: !!projectId && projectId > 0,
  });

  // 프로젝트 참여 신청/취소
  const joinProjectMutation = useMutation({
    mutationFn: async (request: ProjectJoinRequest): Promise<ProjectJoinResponse> => {
      const { data } = await api.post<ProjectJoinResponse>(
        `/api/projects/${projectId}/join`,
        request
      );
      return data;
    },
    onSuccess: response => {
      // 성공 시 프로젝트 상세 정보 다시 조회
      queryClient.invalidateQueries({ queryKey: ['project', 'detail', projectId] });

      // 성공 메시지 표시 (TODO: 추후 토스트 알림으로 변경 가능)
      if (response.data?.isApplied) {
        console.log(`${response.data.appliedPosition} 포지션에 지원했습니다.`);
      } else {
        console.log('지원을 취소했습니다.');
      }
    },
    onError: error => {
      console.error('프로젝트 참여 신청/취소 실패:', error);
      // TODO: 에러 처리 (토스트 알림 등)
    },
  });

  // 프로젝트 수정 페이지로 이동
  const handleEditProject = () => {
    navigate(`/edit/project/${projectId}`);
  };

  // 포지션 지원하기
  const handleApplyPosition = (position: string) => {
    joinProjectMutation.mutate({ appliedPosition: position });
  };

  // 지원 취소하기 (이미 지원한 포지션 클릭 시)
  const handleCancelApplication = () => {
    joinProjectMutation.mutate({});
  };

  return {
    projectData: projectResponse?.data,
    isLoading,
    error,

    // 액션
    handleEditProject,
    handleApplyPosition,
    handleCancelApplication,
    refetch,

    // 뮤테이션 상태
    isJoining: joinProjectMutation.isPending,
  };
};
