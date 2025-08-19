import { z } from 'zod';

import { apiResponseSchema } from './api.schema';

/* 공통 정규식 */
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\-]{8,}$/; // eslint-disable-line no-useless-escape

/* 스키마 */
const emailSchema = z
  .string()
  .nonempty('이메일을 입력해주세요.')
  .email('올바른 이메일 형식이 아닙니다.');

const passwordSchema = z
  .string()
  .nonempty('비밀번호를 입력해주세요.')
  .regex(passwordRegex, '비밀번호는 8자 이상, 대소문자/숫자/특수문자를 포함해야합니다.');

const phoneNumberSchema = z
  .string()
  .nonempty('전화번호를 입력해주세요.')
  .regex(/^010\d{7,8}$/, '010으로 시작하는 숫자 10~11자리를 입력해주세요.');

const phoneCodeSchema = z
  .string()
  .nonempty('인증번호를 입력해주세요')
  .length(6, '인증번호는 6자리여야합니다.');

const usernameSchema = z
  .string()
  .nonempty('이름을 입력해주세요.')
  .min(2, '이름은 2자 이상이어야 합니다.');

// 회원 정보 스키마
export const UserDataSchema = z.object({
  id: z.number(),
  username: usernameSchema,
  email: emailSchema,
  nickname: z.string(),
  profileImageUrl: z.string(),
  isPreferences: z.boolean(),
  location: {
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
  },
});

// 로그인 스키마
export const SignInSchema = z.object({
  email: emailSchema,
  password: z.string().nonempty('비밀번호를 입력해주세요.'),
});

// 회원가입 스키마
export const SignUpSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  passwordCheck: passwordSchema,
  phoneNumber: phoneNumberSchema,
  phoneCode: phoneCodeSchema,
});

// RESPONSE
export const SignInResponseSchema = apiResponseSchema(UserDataSchema);

/* TYPE */
export type UserData = z.infer<typeof UserDataSchema>;

// Request
export type SignInRequest = z.infer<typeof SignInSchema>;
export type SignUpRequest = z.infer<typeof SignUpSchema>;

// Response
export type SignInResponse = z.infer<typeof SignInResponseSchema>;
