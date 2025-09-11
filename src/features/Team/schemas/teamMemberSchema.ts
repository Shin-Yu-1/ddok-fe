import { z } from 'zod';

/**
 * 메인 배지 스키마
 */
export const MainBadgeSchema = z.object({
  type: z.string(),
  tier: z.string(),
});

/**
 * 탈퇴 배지 스키마
 */
export const AbandonBadgeSchema = z.object({
  isGranted: z.boolean(),
  count: z.number(),
});

/**
 * 유저 정보 스키마
 */
export const UserSchema = z.object({
  userId: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  temperature: z.number(),
  mainPosition: z.string(),
  chatRoomId: z.number().nullable(),
  dmRequestPending: z.boolean(),
  mainBadge: MainBadgeSchema.nullable(),
  abandonBadge: AbandonBadgeSchema.nullable(),
});

/**
 * 팀 멤버 스키마
 */
export const MemberSchema = z.object({
  memberId: z.number(),
  decidedPosition: z.string(),
  role: z.enum(['LEADER', 'MEMBER']),
  joinedAt: z.string(),
  isMine: z.boolean(),
  user: UserSchema,
});

/**
 * 유저 타입
 */
export type UserType = z.infer<typeof UserSchema>;

/**
 * 팀 멤버 타입
 */
export type MemberType = z.infer<typeof MemberSchema>;
