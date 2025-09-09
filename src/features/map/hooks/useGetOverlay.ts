import type {
  ProjectOverlayResponse,
  StudyOverlayResponse,
  PlayerOverlayResponse,
  CafeOverlayResponse,
} from '@/features/map/schemas/overlaySchema';
import { useGetApi } from '@/hooks/useGetApi';

/**
 * 맵 오버레이 데이터를 가져오는 훅
 *
 * @param category - 오버레이 카테고리 ('project' | 'study' | 'player' | 'cafe')
 * @param id - 오버레이 아이디
 * @returns 카테고리에 따른 오버레이 데이터
 */
export const useGetOverlay = <T = unknown>(category: string, id: number) => {
  const url = `/api/map/overlay/${category}/${id}`;

  return useGetApi<T>({
    url,
    enabled: !!category && !!id,
  });
};

/**
 * 프로젝트 오버레이 데이터를 가져오는 훅
 */
export const useGetProjectOverlay = (id: number) => {
  return useGetOverlay<ProjectOverlayResponse>('project', id);
};

/**
 * 스터디 오버레이 데이터를 가져오는 훅
 */
export const useGetStudyOverlay = (id: number) => {
  return useGetOverlay<StudyOverlayResponse>('study', id);
};

/**
 * 플레이어 오버레이 데이터를 가져오는 훅
 */
export const useGetPlayerOverlay = (id: number) => {
  return useGetOverlay<PlayerOverlayResponse>('player', id);
};

/**
 * 카페 오버레이 데이터를 가져오는 훅
 */
export const useGetCafeOverlay = (id: number) => {
  return useGetOverlay<CafeOverlayResponse>('cafe', id);
};
