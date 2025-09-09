import { z } from 'zod';

/**
 * 프로젝트 오버레이 스키마
 */
export const ProjectOverlaySchema = z.object({
  category: z.string(),
  projectId: z.number(),
  title: z.string(),
  bannerImageUrl: z.string(),
  teamStatus: z.string(),
  positions: z.array(z.string()),
  capacity: z.number(),
  mode: z.string(),
  address: z.string(),
  preferredAges: z
    .object({
      ageMin: z.number(),
      ageMax: z.number(),
    })
    .nullable()
    .optional(),
  expectedMonth: z.number(),
  startDate: z.string(),
});
/**
 * 프로젝트 오버레이 타입
 */
export type ProjectOverlayData = z.infer<typeof ProjectOverlaySchema>;

/**
 * 스터디 오버레이 스키마
 */
export const StudyOverlaySchema = z.object({
  category: z.string(),
  studyId: z.number(),
  title: z.string(),
  bannerImageUrl: z.string(),
  teamStatus: z.string(),
  studyType: z.string(),
  capacity: z.number(),
  mode: z.string(),
  address: z.string(),
  preferredAges: z
    .object({
      ageMin: z.number(),
      ageMax: z.number(),
    })
    .nullable()
    .optional(),
  expectedMonth: z.number(),
  startDate: z.string(),
});
/**
 * 스터디 오버레이 타입
 */
export type StudyOverlayData = z.infer<typeof StudyOverlaySchema>;

/**
 * 플레이어 오버레이 스키마
 */
export const PlayerOverlaySchema = z.object({
  category: z.string(),
  userId: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  mainBadge: z
    .object({
      type: z.string(),
      tier: z.string(),
    })
    .nullable()
    .optional(),
  abandonBadge: z
    .object({
      isGranted: z.boolean(),
      count: z.number(),
    })
    .nullable()
    .optional(),
  mainPosition: z.string(),
  address: z.string(),
  latestProject: z
    .object({
      id: z.number(),
      title: z.string(),
      teamStatus: z.string(),
    })
    .nullable()
    .optional(),
  latestStudy: z
    .object({
      id: z.number(),
      title: z.string(),
      teamStatus: z.string(),
    })
    .nullable()
    .optional(),
  temperature: z.number(),
  isMine: z.boolean(),
});
/**
 * 플레이어 오버레이 타입
 */
export type PlayerOverlayData = z.infer<typeof PlayerOverlaySchema>;

/**
 * 추천 장소 오버레이 스키마
 */
export const CafeOverlaySchema = z.object({
  category: z.string(),
  cafeId: z.number(),
  title: z.string(),
  bannerImageUrl: z.string(),
  rating: z.number(),
  reviewCount: z.number(),
  address: z.string(),
});
/**
 * 추천 장소 오버레이 타입
 */
export type CafeOverlayData = z.infer<typeof CafeOverlaySchema>;

/**
 * 프로젝트 오버레이 조회 API 응답 스키마
 */
export const ProjectOverlayResponseSchema = z.object({
  data: ProjectOverlaySchema,
  message: z.string(),
  status: z.number(),
});
/**
 * 프로젝트 오버레이 조회 API 응답 타입
 */
export type ProjectOverlayResponse = z.infer<typeof ProjectOverlayResponseSchema>;

/**
 * 스터디 오버레이 조회 API 응답 스키마
 */
export const StudyOverlayResponseSchema = z.object({
  data: StudyOverlaySchema,
  message: z.string(),
  status: z.number(),
});
/**
 * 스터디 오버레이 조회 API 응답 타입
 */
export type StudyOverlayResponse = z.infer<typeof StudyOverlayResponseSchema>;

/**
 * 플레이어 오버레이 조회 API 응답 스키마
 */
export const PlayerOverlayResponseSchema = z.object({
  data: PlayerOverlaySchema,
  message: z.string(),
  status: z.number(),
});
/**
 * 플레이어 오버레이 조회 API 응답 타입
 */
export type PlayerOverlayResponse = z.infer<typeof PlayerOverlayResponseSchema>;

/**
 * 추천 장소 오버레이 조회 API 응답 스키마
 */
export const CafeOverlayResponseSchema = z.object({
  data: CafeOverlaySchema,
  message: z.string(),
  status: z.number(),
});
/**
 * 추천 장소 오버레이 조회 API 응답 타입
 */
export type CafeOverlayResponse = z.infer<typeof CafeOverlayResponseSchema>;
