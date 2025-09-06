import { z } from 'zod';

import type { MapPanelItem } from '../types';

/**
 * 페이지네이션 정보 스키마
 */
export const PaginationSchema = z.object({
  currentPage: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
});

/**
 * 지도 검색 API 데이터 스키마
 */
export const MapSearchDataSchema = z.object({
  items: z.array(z.any()), // MapPanelItem[]를 런타임에서 검증하기 어려우므로 any 사용
  pagination: PaginationSchema,
});

/**
 * 지도 검색 API 응답 스키마
 */
export const MapSearchResponseSchema = z.object({
  data: MapSearchDataSchema,
  message: z.string(),
  status: z.number(),
});

/**
 * 페이지네이션 정보 타입
 */
export type Pagination = z.infer<typeof PaginationSchema>;

/**
 * 지도 검색 API 데이터 타입
 */
export type MapSearchData = z.infer<typeof MapSearchDataSchema> & {
  items: MapPanelItem[];
};

/**
 * 지도 검색 API 응답 타입
 */
export type MapSearchResponse = z.infer<typeof MapSearchResponseSchema> & {
  data: MapSearchData;
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
  page: z.number().optional().default(0),
  size: z.number().optional().default(20),
  category: z.string().optional(),
  filter: z.string().optional(),
});

/**
 * 지도 검색 API 요청 파라미터 타입
 */
export type MapSearchParams = z.infer<typeof MapSearchParamsSchema>;
