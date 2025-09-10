import axios from 'axios';

import type {
  FindEmailRequest,
  FindEmailResponse,
  FindPasswordRequest,
  FindPasswordResponse,
  KakaoSignInRequest,
  PersonalizationRequest,
  PersonalizationResponse,
  ResetPasswordRequest,
  SignInApiResponse,
  SignUpApiResponse,
  SignUpRequest,
  SocialLoginResponse,
} from '@/types/auth';

import api from './api';

// 공개 API용 클라이언트 (인증 불필요)
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// API 응답 공통 타입
interface ApiResponseDto<T = unknown> {
  status: number;
  message: string;
  data: T;
}

// 이메일 중복 확인 응답 타입
interface EmailCheckResponse {
  isAvailable: boolean;
}

// 휴대폰 인증 코드 발송 응답 타입
interface PhoneVerificationResponse {
  expiresIn: number;
}

// 휴대폰 인증 코드 확인 응답 타입
interface PhoneVerifyCodeResponse {
  verified: boolean;
}

// 로그인 요청 타입
interface SignInRequest {
  email: string;
  password: string;
}

// 기술 스택 검색 응답 타입
interface TechStackSearchResponse {
  techStacks: string[]; // 실제 API는 문자열 배열을 반환
}

// 이메일 중복 확인
export const checkEmail = async (email: string): Promise<EmailCheckResponse> => {
  const response = await publicApi.post<ApiResponseDto<EmailCheckResponse>>(
    '/api/auth/email/check',
    {
      email,
    }
  );
  return response.data.data;
};

// 휴대폰 인증 코드 발송
export const sendPhoneCode = async (
  phoneNumber: string,
  username: string,
  authType: 'SIGN_UP' | 'FIND_ID' | 'FIND_PASSWORD' = 'SIGN_UP'
): Promise<PhoneVerificationResponse> => {
  const response = await publicApi.post<ApiResponseDto<PhoneVerificationResponse>>(
    '/api/auth/phone/send-code',
    {
      phoneNumber,
      username,
      authType,
    }
  );
  return response.data.data;
};

// 휴대폰 인증 코드 확인
export const verifyPhoneCode = async (
  phoneNumber: string,
  phoneCode: string
): Promise<PhoneVerifyCodeResponse> => {
  const response = await publicApi.post<ApiResponseDto<PhoneVerifyCodeResponse>>(
    '/api/auth/phone/verify-code',
    {
      phoneNumber,
      phoneCode,
    }
  );
  return response.data.data;
};

// 회원가입
export const signUp = async (signUpData: SignUpRequest): Promise<SignUpApiResponse['data']> => {
  const response = await publicApi.post<SignUpApiResponse>('/api/auth/signup', signUpData);
  return response.data.data;
};

// 로그인
export const signIn = async (signInData: SignInRequest): Promise<SignInApiResponse['data']> => {
  const response = await publicApi.post<SignInApiResponse>('/api/auth/signin', signInData);
  return response.data.data;
};

// 기술 스택 검색
export const searchTechStacks = async (keyword?: string): Promise<string[]> => {
  const url = keyword
    ? `/api/auth/stacks?keyword=${encodeURIComponent(keyword)}`
    : '/api/auth/stacks';
  const response = await api.get<ApiResponseDto<TechStackSearchResponse>>(url);
  return response.data.data.techStacks;
};

// 개인화 설정 제출
export const submitPersonalization = async (
  personalizationData: PersonalizationRequest
): Promise<PersonalizationResponse> => {
  const response = await api.post<ApiResponseDto<PersonalizationResponse>>(
    '/api/auth/preferences',
    personalizationData
  );
  return response.data.data;
};

// 이메일 찾기
export const findEmail = async (findEmailData: FindEmailRequest): Promise<FindEmailResponse> => {
  const response = await publicApi.post<ApiResponseDto<FindEmailResponse>>(
    '/api/auth/email/find',
    findEmailData
  );
  return response.data.data;
};

// 비밀번호 찾기
export const findPassword = async (
  findPasswordData: FindPasswordRequest
): Promise<FindPasswordResponse> => {
  const response = await publicApi.post<ApiResponseDto<FindPasswordResponse>>(
    '/api/auth/password/verify-user',
    findPasswordData
  );
  return response.data.data;
};

// 비밀번호 재설정
export const resetPassword = async (
  resetPasswordData: ResetPasswordRequest,
  reauthToken: string
): Promise<void> => {
  await publicApi.post<ApiResponseDto<null>>('/api/auth/password/reset', resetPasswordData, {
    headers: {
      Authorization: `Bearer ${reauthToken}`,
    },
  });
};

// 카카오 로그인 (authorizationCode 방식)
export const signInWithKakao = async (
  kakaoData: KakaoSignInRequest
): Promise<SocialLoginResponse> => {
  const response = await publicApi.post<ApiResponseDto<SocialLoginResponse>>(
    '/api/auth/signin/kakao',
    kakaoData
  );
  return response.data.data;
};

// 카카오 로그인 리다이렉트 URL 생성
export const getKakaoLoginUrl = (): string => {
  // 카카오 개발자 콘솔에서 설정한 JavaScript 키
  const kakaoAppKey = import.meta.env.VITE_KAKAO_API_KEY;
  // 프론트엔드 콜백 URL (카카오 개발자 콘솔에 등록된 URL과 일치해야 함)
  const redirectUri = `${window.location.origin}/auth/kakao/callback`;

  const kakaoAuthUrl = 'https://kauth.kakao.com/oauth/authorize';
  const params = new URLSearchParams({
    client_id: kakaoAppKey,
    redirect_uri: redirectUri,
    response_type: 'code',
  });

  return `${kakaoAuthUrl}?${params.toString()}`;
};

// API 에러 처리를 위한 유틸리티 함수
export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object') {
    const errorObj = error as Record<string, unknown>;
    if (errorObj.response && typeof errorObj.response === 'object') {
      const response = errorObj.response as Record<string, unknown>;
      if (response.data && typeof response.data === 'object') {
        const data = response.data as Record<string, unknown>;
        if (typeof data.message === 'string') {
          return data.message;
        }
      }
    }
    if (typeof errorObj.message === 'string') {
      return errorObj.message;
    }
  }
  return '알 수 없는 오류가 발생했습니다.';
};
