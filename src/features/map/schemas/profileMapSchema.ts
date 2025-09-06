import { z } from 'zod';

import type { MapItem } from '../types';

/**
 * 프로필 지도 조회 API 응답 스키마
 */
export const profileMapResponseSchema = z.object({
  data: z.array(z.any()),
  message: z.string(),
  status: z.number(),
});

/**
 * 프로필 지도 조회 API 응답 타입
 */
export type ProfileMapResponse = z.infer<typeof profileMapResponseSchema> & {
  data: MapItem[];
};
