import { useAuthStore } from '@/stores/authStore';
import type { ApiResponse } from '@/types/api';

import api from './api';

// API에서 받는 사용자 설정 정보 (개인정보 설정 전용 필드들 추가)
export interface ApiUserSettingsInfo {
  userId: number;
  profileImageUrl: string;
  username: string;
  nickname: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  password: string;
}

// 클라이언트에서 사용하는 사용자 설정 정보 (isSocial 포함)
export interface UserSettingsInfo extends ApiUserSettingsInfo {
  isSocial?: boolean;
}

// 나머지 타입들
export interface VerifyPasswordRequest {
  password: string;
}

export interface VerifyPasswordResponse {
  reauthToken: string;
}

export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdatePhoneRequest {
  phoneNumber: string;
}

export interface UpdatePasswordRequest {
  newPassword: string;
  passwordCheck: string;
}

export interface UpdatePasswordResponse {
  newPassword: string;
  passwordCheck: string;
}

// authStore에서 isSocial 정보를 가져와 병합
const enrichWithAuthInfo = (apiData: ApiUserSettingsInfo): UserSettingsInfo => {
  const { getUserInfo } = useAuthStore.getState();
  const userInfo = getUserInfo();

  return {
    ...apiData,
    isSocial: userInfo?.isSocial,
  };
};

// 개인정보 수정 API
export const personalInfoApi = {
  // 개인정보변경 페이지 조회 (accessToken만 필요)
  getUserSettings: async (): Promise<UserSettingsInfo> => {
    const response = await api.get<ApiResponse<ApiUserSettingsInfo>>('/api/me/settings');
    return enrichWithAuthInfo(response.data.data);
  },

  // 비밀번호 검증 및 reauthToken 발급 (accessToken만 필요)
  verifyPassword: async (password: string): Promise<VerifyPasswordResponse> => {
    const response = await api.post<ApiResponse<VerifyPasswordResponse>>('/api/me/settings', {
      password,
    });
    return response.data.data;
  },

  // 닉네임 수정 (accessToken만 필요)
  updateNickname: async (nickname: string): Promise<UserSettingsInfo> => {
    const response = await api.patch<ApiResponse<ApiUserSettingsInfo>>(
      '/api/me/settings/nickname',
      { nickname }
    );
    return enrichWithAuthInfo(response.data.data);
  },

  // 전화번호 변경 (accessToken + reauthToken 필요)
  updatePhone: async (phoneNumber: string, reauthToken: string): Promise<UserSettingsInfo> => {
    const response = await api.patch<ApiResponse<ApiUserSettingsInfo>>(
      '/api/me/settings/phone',
      { phoneNumber },
      {
        headers: {
          'X-Reauth-Token': reauthToken,
        },
      }
    );
    return enrichWithAuthInfo(response.data.data);
  },

  // 비밀번호 변경 (accessToken + reauthToken 필요)
  updatePassword: async (
    newPassword: string,
    passwordCheck: string,
    reauthToken: string
  ): Promise<UpdatePasswordResponse> => {
    const response = await api.patch<ApiResponse<UpdatePasswordResponse>>(
      '/api/me/settings/password',
      { newPassword, passwordCheck },
      {
        headers: {
          'X-Reauth-Token': reauthToken,
        },
      }
    );
    return response.data.data;
  },

  // 프로필 이미지 수정 (accessToken만 필요)
  updateProfileImage: async (file: File, forcePlaceholder?: boolean): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    if (forcePlaceholder !== undefined) {
      formData.append('forcePlaceholder', forcePlaceholder.toString());
    }

    const response = await api.patch<ApiResponse<ApiUserSettingsInfo>>(
      '/api/me/settings/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data.profileImageUrl;
  },

  // 회원 탈퇴 (소셜 로그인 시 accessToken만, 일반 로그인 시 accessToken + reauthToken)
  deleteAccount: async (reauthToken?: string): Promise<string> => {
    const headers: Record<string, string> = {};

    // 일반 로그인인 경우에만 reauthToken 추가
    if (reauthToken) {
      headers['X-Reauth-Token'] = reauthToken;
    }

    const response = await api.delete<ApiResponse<string>>('/api/me/settings', {
      headers,
    });
    return response.data.data;
  },
};
