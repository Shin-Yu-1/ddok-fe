import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/api';
import { DDtoast } from '@/features/toast';
import type {
  DetailProjectResponse,
  ProjectJoinRequest,
  ProjectJoinResponse,
} from '@/types/project';

interface UseProjectDetailProps {
  projectId: number;
}

export const useProjectDetail = ({ projectId }: UseProjectDetailProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 프로젝트 상세 조회
  const {
    data: projectResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['project', 'detail', projectId],
    queryFn: async (): Promise<DetailProjectResponse> => {
      try {
        const { data } = await api.get<DetailProjectResponse>(`/api/projects/${projectId}`);
        return data;
      } catch (error) {
        // API 에러 시 토스트 표시
        DDtoast({
          mode: 'server-first',
          userMessage: '프로젝트 정보를 불러오는데 실패했습니다.',
          apiResponse: error,
        });

        throw error;
      }
    },
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
    onSuccess: (response, variables) => {
      // 성공 시 프로젝트 상세 정보 다시 조회
      queryClient.invalidateQueries({ queryKey: ['project', 'detail', projectId] });

      // 성공 토스트 표시
      if (response.data?.isApplied) {
        const position =
          response.data.appliedPosition || variables.appliedPosition || '해당 포지션';

        DDtoast({
          mode: 'server-first',
          type: 'success',
          userMessage: `${position}에 성공적으로 지원하였습니다! 🎉`,
          apiResponse: response,
        });
      } else {
        DDtoast({
          mode: 'server-first',
          type: 'info',
          userMessage: '지원을 취소했습니다.',
          apiResponse: response,
        });
      }
    },
    onError: (error, variables) => {
      // 에러 토스트 표시
      const isApplying = variables.appliedPosition;
      const errorMessage = isApplying
        ? '프로젝트 지원 중 문제가 발생했습니다.'
        : '지원 취소 중 문제가 발생했습니다.';

      DDtoast({
        mode: 'server-first',
        userMessage: errorMessage,
        apiResponse: error,
      });
    },
  });

  // 프로젝트 수정 페이지로 이동
  const handleEditProject = () => {
    navigate(`/edit/project/${projectId}`);
  };

  // 팀 관리 페이지로 이동
  const handleTeamManagement = () => {
    if (projectResponse?.data.teamId) {
      navigate(`/team/${projectResponse.data.teamId}/setting`);
    } else {
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: '팀 정보를 찾을 수 없습니다.',
      });
    }
  };

  // 포지션 지원하기
  const handleApplyPosition = (position: string) => {
    joinProjectMutation.mutate({ appliedPosition: position });
  };

  // 지원 취소하기 (이미 지원한 포지션 클릭 시)
  const handleCancelApplication = () => {
    joinProjectMutation.mutate({});
  };

  // 네트워크 재시도 기능
  const handleRetry = () => {
    DDtoast({
      mode: 'custom',
      type: 'info',
      userMessage: '데이터를 다시 불러오는 중입니다...',
      duration: 2000,
    });

    refetch();
  };

  return {
    projectData: projectResponse?.data,
    isLoading,
    error,

    // 액션
    handleEditProject,
    handleTeamManagement,
    handleApplyPosition,
    handleCancelApplication,
    handleRetry,
    refetch,

    // 뮤테이션 상태
    isJoining: joinProjectMutation.isPending,
  };
};
