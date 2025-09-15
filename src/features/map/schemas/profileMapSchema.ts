import { z } from 'zod';

import { LocationSchema } from './mapItemSchema';

/**
 * 프로필 지도 기본 아이템 스키마
 */
const BaseProfileMapItemSchema = z.object({
  title: z.string(),
  teamStatus: z.enum(['ONGOING', 'CLOSED']),
  location: LocationSchema,
});

/**
 * 프로필 지도 프로젝트 아이템 스키마
 */
export const ProfileMapProjectItemSchema = BaseProfileMapItemSchema.extend({
  category: z.literal('project'),
  projectId: z.number(),
  studyId: z.null(),
});

/**
 * 프로필 지도 스터디 아이템 스키마
 */
export const ProfileMapStudyItemSchema = BaseProfileMapItemSchema.extend({
  category: z.literal('study'),
  projectId: z.null(),
  studyId: z.number(),
});

/**
 * 프로필 지도 아이템 통합 스키마 (union type)
 */
export const ProfileMapItemSchema = z.discriminatedUnion('category', [
  ProfileMapProjectItemSchema,
  ProfileMapStudyItemSchema,
]);

/**
 * 프로필 지도 아이템 타입들
 */
export type ProfileMapProjectItem = z.infer<typeof ProfileMapProjectItemSchema>;
export type ProfileMapStudyItem = z.infer<typeof ProfileMapStudyItemSchema>;
export type ProfileMapItem = z.infer<typeof ProfileMapItemSchema>;

/**
 * 프로필 지도 조회 API 응답 스키마
 */
export const ProfileMapResponseSchema = z.object({
  data: z.array(ProfileMapItemSchema),
  message: z.string(),
  status: z.number(),
});

/**
 * 프로필 지도 조회 API 응답 타입
 */
export type ProfileMapResponse = z.infer<typeof ProfileMapResponseSchema>;

/**
 * 타입 가드 함수
 */
export const isProfileMapProject = (item: ProfileMapItem): item is ProfileMapProjectItem =>
  item.category === 'project';
export const isProfileMapStudy = (item: ProfileMapItem): item is ProfileMapStudyItem =>
  item.category === 'study';
