import { z } from 'zod';

/**
 * 평가 점수 스키마
 */
export const evaluationScoreSchema = z.object({
  itemId: z.number(),
  score: z.number(),
});
/**
 * 평가 점수 타입
 */
export type EvaluationScore = z.infer<typeof evaluationScoreSchema>;

/**
 * 평가 대상 사용자 정보 스키마
 */
export const evaluationUserSchema = z.object({
  userId: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  role: z.string(),
  mainBadge: z.string(),
  abandonBadge: z.string(),
  temperature: z.number(),
});
/**
 * 평가 대상 사용자 정보 타입
 */
export type EvaluationUser = z.infer<typeof evaluationUserSchema>;

/**
 * 평가 멤버 스키마
 */
export const evaluationMemberSchema = z.object({
  memberId: z.number(),
  isMine: z.boolean(),
  user: evaluationUserSchema,
  isEvaluated: z.boolean(),
  scores: z.array(evaluationScoreSchema),
});
/**
 * 평가 멤버 타입
 */
export type EvaluationMember = z.infer<typeof evaluationMemberSchema>;

/**
 * 팀 평가 데이터 스키마
 */
export const teamEvaluationDataSchema = z.object({
  teamId: z.number(),
  teamType: z.string(),
  evaluationId: z.number(),
  status: z.string(),
  items: z.array(evaluationMemberSchema),
});
/**
 * 팀 평가 데이터 타입
 */
export type TeamEvaluationData = z.infer<typeof teamEvaluationDataSchema>;

/**
 * 팀 평가 API 응답 스키마
 */
export const teamEvaluationResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: teamEvaluationDataSchema,
});
/**
 * 팀 평가 API 응답 타입
 */
export type TeamEvaluationResponse = z.infer<typeof teamEvaluationResponseSchema>;

/**
 * 평가 제출용 점수 스키마
 */
export const submitEvaluationScoreSchema = z.object({
  itemId: z.number(),
  score: z.number().min(1).max(5), // 1~5점
});

/**
 * 평가 제출 요청 스키마
 */
export const submitEvaluationRequestSchema = z.object({
  targetUserId: z.number(),
  scores: z.array(submitEvaluationScoreSchema),
});

/**
 * 평가 제출용 점수 타입
 */
export type SubmitEvaluationScore = z.infer<typeof submitEvaluationScoreSchema>;

/**
 * 평가 제출 요청 타입
 */
export type SubmitEvaluationRequest = z.infer<typeof submitEvaluationRequestSchema>;
