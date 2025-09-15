import { useState, useCallback } from 'react';

import { profileApi } from '@/api/profileApi';
import type { ParticipationHistory, TechStack } from '@/types/user';

type ApiResponse = {
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  items: Array<{
    studyId?: number;
    projectId?: number;
    teamId: number;
    title: string;
    teamStatus: 'ONGOING' | 'CLOSED';
    period: {
      start: string;
      end: string | null;
    };
  }>;
};

type TechStackApiResponse = {
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  items: Array<{
    techStack: string;
  }>;
};

export const useInfiniteLoad = (
  userId: number,
  type: 'studies' | 'projects',
  initialData: ParticipationHistory[] = [],
  initialTotalItems?: number
) => {
  const [items, setItems] = useState<ParticipationHistory[]>(initialData);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialTotalItems ? initialData.length < initialTotalItems : initialData.length === 4
  );
  const [totalItems, setTotalItems] = useState(initialTotalItems || initialData.length);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      let response: ApiResponse;

      if (type === 'studies') {
        response = await profileApi.getStudies(userId, nextPage, 4);
      } else {
        response = await profileApi.getProjects(userId, nextPage, 4);
      }

      // API 응답을 ParticipationHistory로 변환
      const newItems: ParticipationHistory[] = response.items.map(item => ({
        id: type === 'studies' ? item.studyId! : item.projectId!,
        teamId: item.teamId,
        title: item.title,
        type: type === 'studies' ? 'study' : 'project',
        status: item.teamStatus,
        startDate: item.period.start,
        endDate: item.teamStatus === 'CLOSED' ? item.period.end : undefined,
      }));

      setItems(prev => [...prev, ...newItems]);
      setCurrentPage(nextPage);
      setTotalItems(response.pagination.totalItems);

      // 더 불러올 데이터가 있는지 확인
      const totalLoaded = items.length + newItems.length;
      setHasMore(totalLoaded < response.pagination.totalItems);
    } catch (error) {
      console.error(`${type} 추가 로딩 에러:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, type, currentPage, isLoading, hasMore, items.length]);

  const getShowMoreText = useCallback(() => {
    if (isLoading) {
      return 'Loading...';
    }

    const remaining = Math.max(0, totalItems - items.length); // Math.max로 음수 방지

    if (remaining === 0) {
      return 'All items loaded';
    }

    const loadCount = Math.min(remaining, 4);
    return type === 'studies'
      ? `Show ${loadCount} more studies ▼`
      : `Show ${loadCount} more projects ▼`;
  }, [type, isLoading, totalItems, items.length]);

  return {
    items,
    isLoading,
    hasMore,
    loadMore,
    getShowMoreText,
  };
};

// 기술 스택 전용 무한 로딩 훅
export const useInfiniteTechStacks = (
  userId: number,
  initialData: TechStack[] = [],
  initialTotalItems?: number
) => {
  const [items, setItems] = useState<TechStack[]>(initialData);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialTotalItems ? initialData.length < initialTotalItems : initialData.length === 8
  );
  const [totalItems, setTotalItems] = useState(initialTotalItems || initialData.length);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response: TechStackApiResponse = await profileApi.getTechStacks(userId, nextPage, 8);

      const newItems: TechStack[] = response.items.map((item, index) => ({
        id: nextPage * 8 + index + 1,
        name: item.techStack,
      }));

      setItems(prev => [...prev, ...newItems]);
      setCurrentPage(nextPage);
      setTotalItems(response.pagination.totalItems);

      const totalLoaded = items.length + newItems.length;
      setHasMore(totalLoaded < response.pagination.totalItems);
    } catch (error) {
      console.error('기술 스택 추가 로딩 에러:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentPage, isLoading, hasMore, items.length]);

  const getShowMoreText = useCallback(() => {
    if (isLoading) {
      return 'Loading...';
    }

    const remaining = Math.max(0, totalItems - items.length);

    if (remaining === 0) {
      return 'All items loaded';
    }

    const loadCount = Math.min(remaining, 8);
    return `Show ${loadCount} more tools ▼`;
  }, [isLoading, totalItems, items.length]);

  return {
    items,
    isLoading,
    hasMore,
    loadMore,
    getShowMoreText,
  };
};
