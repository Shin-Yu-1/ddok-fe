import { z } from 'zod';

/**
 * 위치 정보 스키마
 */
export const LocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  region1depthName: z.string(),
  region2depthName: z.string(),
  region3depthName: z.string(),
  roadName: z.string(),
  mainBuildingNo: z.string(),
  subBuildingNo: z.string(),
  zoneNo: z.string(),
});
/**
 * 위치 정보 타입
 */
export type Location = z.infer<typeof LocationSchema>;

/**
 * 아이템 공통 스키마
 */
export const BaseMapItemSchema = z.object({
  category: z.enum(['project', 'study', 'player', 'cafe']),
  location: LocationSchema,
});
/**
 * 아이템 공통 타입
 */
export type BaseMapItem = z.infer<typeof BaseMapItemSchema>;

/**
 * 지도 아이템 - 프로젝트 스키마
 */
export const ProjectMapItemSchema = BaseMapItemSchema.extend({
  category: z.literal('project'),
  projectId: z.number(),
  title: z.string(),
  teamStatus: z.enum(['RECRUITING', 'ONGOING', 'CLOSED']),
});
/**
 * 지도 아이템 - 프로젝트 타입
 */
export type ProjectMapItem = z.infer<typeof ProjectMapItemSchema>;

/**
 * 패널 아이템 - 프로젝트 스키마
 */
export const ProjectPanelItemSchema = ProjectMapItemSchema.extend({
  bannerImageUrl: z.string(),
});
/**
 * 패널 아이템 - 프로젝트 타입
 */
export type ProjectPanelItem = z.infer<typeof ProjectPanelItemSchema>;

/**
 * 지도 아이템 - 스터디 스키마
 */
export const StudyMapItemSchema = BaseMapItemSchema.extend({
  category: z.literal('study'),
  studyId: z.number(),
  title: z.string(),
  teamStatus: z.enum(['RECRUITING', 'ONGOING', 'CLOSED']),
});
/**
 * 지도 아이템 - 스터디 타입
 */
export type StudyMapItem = z.infer<typeof StudyMapItemSchema>;

/**
 * 패널 아이템 - 스터디 스키마
 */
export const StudyPanelItemSchema = StudyMapItemSchema.extend({
  bannerImageUrl: z.string(),
});
/**
 * 패널 아이템 - 스터디 타입
 */
export type StudyPanelItem = z.infer<typeof StudyPanelItemSchema>;

/**
 * 지도 아이템 - 플레이어 스키마
 */
export const PlayerMapItemSchema = BaseMapItemSchema.extend({
  category: z.literal('player'),
  userId: z.number(),
  nickname: z.string(),
  position: z.string(),
  isMine: z.boolean(),
});
/**
 * 지도 아이템 - 플레이어 타입
 */
export type PlayerMapItem = z.infer<typeof PlayerMapItemSchema>;

/**
 * 패널 아이템 - 플레이어 스키마
 */
export const PlayerPanelItemSchema = PlayerMapItemSchema.extend({
  mainBadge: z.object({
    type: z.string(),
    tier: z.string(),
  }),
  abandonBadge: z.object({
    isGranted: z.boolean(),
    count: z.number(),
  }),
  temperature: z.number(),
  profileImageUrl: z.string(),
});
/**
 * 패널 아이템 - 플레이어 타입
 */
export type PlayerPanelItem = z.infer<typeof PlayerPanelItemSchema>;

/**
 * 지도 아이템 - 추천 장소 스키마
 */
export const CafeMapItemSchema = BaseMapItemSchema.extend({
  category: z.literal('cafe'),
  cafeId: z.number(),
  title: z.string(),
});
/**
 * 지도 아이템 - 추천 장소 타입
 */
export type CafeMapItem = z.infer<typeof CafeMapItemSchema>;

/**
 * 패널 아이템 - 추천 장소 스키마
 */
export const CafePanelItemSchema = CafeMapItemSchema.extend({
  bannerImageUrl: z.string(),
});
/**
 * 패널 아이템 - 추천 장소 타입
 */
export type CafePanelItem = z.infer<typeof CafePanelItemSchema>;

/**
 * 지도 사각형 영역 및 중심 좌표에 대한 정보 스키마
 */
export const MapBoundsSchema = z.object({
  swLat: z.number(),
  swLng: z.number(),
  neLat: z.number(),
  neLng: z.number(),
  lat: z.number(),
  lng: z.number(),
});
/**
 * 지도 사각형 영역 및 중심 좌표에 대한 정보 타입
 */
export type MapBounds = z.infer<typeof MapBoundsSchema>;
