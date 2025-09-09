import { z } from 'zod';

// 닉네임 유효성 검사 스키마
export const nicknameSchema = z
  .string()
  .min(2, '닉네임은 2자 이상이어야 합니다.')
  .max(12, '닉네임은 12자 이하여야 합니다.')
  .regex(/^[가-힣a-zA-Z0-9_ ]+$/, '한글, 영문, 숫자, 밑줄(_)만 사용 가능합니다.')
  .refine(value => !value.startsWith(' '), '닉네임은 공백으로 시작할 수 없습니다.')
  .refine(value => !value.includes('  '), '연속된 공백은 사용할 수 없습니다.');

// 사용자 정보 스키마
export const userInfoSchema = z.object({
  userId: z.number(),
  profileImageUrl: z.string(),
  username: z.string(),
  nickname: nicknameSchema,
  birthDate: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  password: z.string(),
  isSocial: z.boolean().optional(),
});

// 닉네임 수정 요청 스키마
export const updateNicknameRequestSchema = z.object({
  nickname: nicknameSchema,
});

// 비밀번호 확인 요청 스키마
export const verifyPasswordRequestSchema = z.object({
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

// API 응답 스키마
export const userInfoResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: userInfoSchema,
});

export const profileImageUploadResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    profileImageUrl: z.string(),
  }),
});

export const verifyPasswordResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    reauthToken: z.string(),
  }),
});

// TypeScript 타입 추출
export type UserInfo = z.infer<typeof userInfoSchema>;
export type UpdateNicknameRequest = z.infer<typeof updateNicknameRequestSchema>;
export type VerifyPasswordRequest = z.infer<typeof verifyPasswordRequestSchema>;
export type UserInfoResponse = z.infer<typeof userInfoResponseSchema>;
export type ProfileImageUploadResponse = z.infer<typeof profileImageUploadResponseSchema>;
export type VerifyPasswordResponse = z.infer<typeof verifyPasswordResponseSchema>;
