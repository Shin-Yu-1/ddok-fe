import type { ToastConfig, ToastMode, ToastType, ApiResponse } from '../types/toast.types';
import { STATUS_TO_TOAST_TYPE } from '../types/toast.types';

/**
 * API 응답 상태 코드를 기반으로 토스트 타입을 결정합니다.
 */
export const getToastTypeFromStatus = (status: number): ToastType => {
  const statusStr = status.toString();
  return STATUS_TO_TOAST_TYPE[statusStr] || 'error';
};

/**
 * 토스트 모드에 따라 표시할 메시지를 결정합니다.
 */
export const resolveToastMessage = (
  mode: ToastMode,
  userMessage: string,
  apiResponse?: ApiResponse
): string => {
  switch (mode) {
    case 'custom':
      return userMessage || '작업이 완료되었습니다.';

    case 'server-only':
      return apiResponse?.message || '서버에서 응답을 받지 못했습니다.';

    case 'server-first':
      return apiResponse?.message || userMessage || '작업이 완료되었습니다.';

    default:
      return userMessage || '작업이 완료되었습니다.';
  }
};

/**
 * 토스트 타입을 결정합니다.
 * 사용자가 명시적으로 타입을 지정한 경우 우선권을 가집니다.
 */
export const resolveToastType = (userType?: ToastType, apiResponse?: ApiResponse): ToastType => {
  // 사용자가 명시적으로 타입을 지정한 경우 우선
  if (userType) {
    return userType;
  }

  // API 응답이 있는 경우 상태 코드로 타입 결정
  if (apiResponse?.status) {
    return getToastTypeFromStatus(apiResponse.status);
  }

  // 기본값
  return 'info';
};

/**
 * 토스트 설정을 생성합니다.
 */
export const createToastConfig = (
  mode: ToastMode,
  userMessage: string,
  userType?: ToastType,
  apiResponse?: ApiResponse
): ToastConfig => {
  const type = resolveToastType(userType, apiResponse);
  const message = resolveToastMessage(mode, userMessage, apiResponse);

  return {
    mode,
    type,
    userMessage: message,
    apiResponse,
  };
};

/**
 * 에러 객체에서 API 응답을 추출합니다.
 */
export const extractApiResponse = (error: unknown): ApiResponse | undefined => {
  if (error && typeof error === 'object') {
    const errorObj = error as Record<string, unknown>;

    // axios 에러 응답 처리
    if (errorObj.response && typeof errorObj.response === 'object') {
      const response = errorObj.response as Record<string, unknown>;

      if (response.data && typeof response.data === 'object') {
        const data = response.data as Record<string, unknown>;

        return {
          status: (response.status as number) || 500,
          message: (data.message as string) || '서버 오류가 발생했습니다.',
          data: data.data,
        };
      }

      return {
        status: (response.status as number) || 500,
        message: '서버 오류가 발생했습니다.',
      };
    }

    // 일반 에러 객체 처리
    if (typeof errorObj.message === 'string') {
      return {
        status: 500,
        message: errorObj.message,
      };
    }
  }

  return {
    status: 500,
    message: '알 수 없는 오류가 발생했습니다.',
  };
};

/**
 * 성공 응답에서 API 응답을 추출합니다.
 */
export const extractSuccessResponse = (response: unknown): ApiResponse | undefined => {
  if (response && typeof response === 'object') {
    const responseObj = response as Record<string, unknown>;

    // axios 응답 처리
    if (responseObj.data && typeof responseObj.data === 'object') {
      const data = responseObj.data as Record<string, unknown>;

      return {
        status: (responseObj.status as number) || 200,
        message: (data.message as string) || '성공적으로 처리되었습니다.',
        data: data.data,
      };
    }

    // 직접 API 응답 처리
    if (typeof responseObj.status === 'number' && typeof responseObj.message === 'string') {
      return responseObj as unknown as ApiResponse;
    }
  }

  return {
    status: 200,
    message: '성공적으로 처리되었습니다.',
  };
};
