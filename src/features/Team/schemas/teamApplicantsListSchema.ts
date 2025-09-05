import { z } from 'zod';

import { UserSchema } from './teamMemberSchema';
import { PaginationSchema } from './teamSettingSchema';

/**
 * 참여 희망자 스키마
 */
export const ApplicantSchema = z.object({
  applicantId: z.number(),
  appliedPosition: z.string().nullable(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  appliedAt: z.string(),
  isMine: z.boolean(),
  user: UserSchema,
});

/**
 * 참여 희망자 조회 API 데이터 스키마
 */
export const ApplicantListSchema = z.object({
  teamId: z.number(),
  teamType: z.enum(['PROJECT', 'STUDY']),
  recruitmentId: z.number(),
  isLeader: z.boolean(),
  items: z.array(ApplicantSchema),
  pagination: PaginationSchema,
});

/**
 * 참여 희망자 조회 API 응답 스키마
 */
export const ApplicantListResponseSchema = z.object({
  data: ApplicantListSchema,
  message: z.string(),
  status: z.number(),
});

/**
 * 참여 희망자 타입
 */
export type ApplicantType = z.infer<typeof ApplicantSchema>;

/**
 * 참여 희망자 조회 API 데이터 타입
 */
export type TeamApplicantListData = z.infer<typeof ApplicantListSchema>;

/**
 * 참여 희망자 조회 API 응답 타입
 */
export type TeamApplicantListResponse = z.infer<typeof ApplicantListResponseSchema>;
