import { z } from 'zod';

/**
 * 참여 희망자 수락/거절 API 응답 스키마
 */
export const ApplicantActionResponseSchema = z.object({
  data: z.null(),
  message: z.string(),
  status: z.number(),
});

/**
 * 참여 희망자 수락/거절 API 응답 타입
 */
export type ApplicantActionResponse = z.infer<typeof ApplicantActionResponseSchema>;
