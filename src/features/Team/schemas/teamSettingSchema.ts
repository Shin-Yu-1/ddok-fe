import { z } from 'zod';

import { TeamMemberSchema } from './teamMemberSchema';

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
 * 팀 설정(참여자 조회) API 데이터 스키마
 */
export const TeamSettingSchema = z.object({
  teamId: z.number(),
  teamType: z.enum(['PROJECT', 'STUDY']),
  teamTitle: z.string(),
  recruitmentId: z.number(),
  isLeader: z.boolean(),
  items: z.array(TeamMemberSchema),
  pagination: PaginationSchema,
});

/**
 * 팀 설정(참여자 조회) API 응답 스키마
 */
export const TeamSettingResponseSchema = z.object({
  data: TeamSettingSchema,
  message: z.string(),
  status: z.number(),
});

/**
 * 페이지네이션 정보 타입
 */
export type Pagination = z.infer<typeof PaginationSchema>;

/**
 * 팀 설정(참여자 조회) API 데이터 타입
 */
export type TeamSettingData = z.infer<typeof TeamSettingSchema>;

/**
 * 팀 설정(참여자 조회) API 응답 타입
 */
export type TeamSettingResponse = z.infer<typeof TeamSettingResponseSchema>;
