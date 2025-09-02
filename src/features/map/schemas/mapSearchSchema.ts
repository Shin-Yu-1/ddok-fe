import { z } from 'zod';

import type { MapPanelItem } from '../types';

/**
 * 지도 검색 API 응답 스키마
 */
export const MapSearchResponseSchema = z.object({
  data: z.array(z.any()), // MapPanelItem[]를 런타임에서 검증하기 어려우므로 any 사용
  message: z.string(),
  status: z.string(),
});

/**
 * 지도 검색 API 응답 타입
 */
export type MapSearchResponse = z.infer<typeof MapSearchResponseSchema> & {
  data: MapPanelItem[];
};

/**
 * 지도 검색 API 요청 파라미터 스키마
 */
export const MapSearchParamsSchema = z.object({
  swLat: z.number(),
  swLng: z.number(),
  neLat: z.number(),
  neLng: z.number(),
  lat: z.number(),
  lng: z.number(),
});

/**
 * 지도 검색 API 요청 파라미터 타입
 */
export type MapSearchParams = z.infer<typeof MapSearchParamsSchema>;
