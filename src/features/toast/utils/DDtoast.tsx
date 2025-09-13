import { toast } from 'sonner';

import type { ToastMode, ToastType, ApiResponse } from '../types/toast.types';

import { createToastConfig, extractApiResponse, extractSuccessResponse } from './toastUtils';

interface DDToastOptions {
  mode: ToastMode;
  type?: ToastType;
  userMessage?: string;
  apiResponse?: unknown;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 간편한 토스트 표시 함수
 *
 * @example
 * // 커스텀 메시지만 표시
 * DDtoast({ mode: 'custom', type: 'success', userMessage: '저장되었습니다!' });
 *
 * // 서버 메시지만 표시
 * DDtoast({ mode: 'server-only', apiResponse: response });
 *
 * // 서버 우선, 커스텀 백업
 * DDtoast({ mode: 'server-first', userMessage: '작업 완료', apiResponse: response });
 *
 * // 타입 강제 지정 (API 응답과 관계없이 info로 표시)
 * DDtoast({ mode: 'server-first', type: 'info', userMessage: '정보입니다', apiResponse: errorResponse });
 */
export const DDtoast = (options: DDToastOptions): string | number => {
  const { mode, type: userType, userMessage = '', apiResponse, duration = 4000, action } = options;

  // API 응답 추출
  let extractedResponse: ApiResponse | undefined;

  if (apiResponse) {
    // 에러인지 성공인지 구분하여 처리
    if (apiResponse && typeof apiResponse === 'object') {
      const responseObj = apiResponse as Record<string, unknown>;

      // axios 에러 응답 확인
      if (responseObj.response || responseObj.message) {
        extractedResponse = extractApiResponse(apiResponse);
      } else {
        extractedResponse = extractSuccessResponse(apiResponse);
      }
    }
  }

  const config = createToastConfig(mode, userMessage, userType, extractedResponse);

  // Sonner의 기본 메서드 사용 (커스텀 컴포넌트 없음)
  switch (config.type) {
    case 'success':
      return toast.success(config.userMessage, {
        duration,
        action: action
          ? {
              label: action.label,
              onClick: action.onClick,
            }
          : undefined,
      });
    case 'error':
      return toast.error(config.userMessage, {
        duration,
        action: action
          ? {
              label: action.label,
              onClick: action.onClick,
            }
          : undefined,
      });
    case 'warning':
      return toast.warning(config.userMessage, {
        duration,
        action: action
          ? {
              label: action.label,
              onClick: action.onClick,
            }
          : undefined,
      });
    case 'info':
    default:
      return toast.info(config.userMessage, {
        duration,
        action: action
          ? {
              label: action.label,
              onClick: action.onClick,
            }
          : undefined,
      });
  }
};

// 단축 함수들
export const DDtoastSuccess = (mode: ToastMode, userMessage: string, apiResponse?: unknown) => {
  return DDtoast({ mode, type: 'success', userMessage, apiResponse });
};

export const DDtoastError = (
  mode: ToastMode,
  userMessage: string,
  errorOrApiResponse?: unknown
) => {
  return DDtoast({ mode, type: 'error', userMessage, apiResponse: errorOrApiResponse });
};

export const DDtoastWarning = (mode: ToastMode, userMessage: string, apiResponse?: unknown) => {
  return DDtoast({ mode, type: 'warning', userMessage, apiResponse });
};

export const DDtoastInfo = (mode: ToastMode, userMessage: string, apiResponse?: unknown) => {
  return DDtoast({ mode, type: 'info', userMessage, apiResponse });
};

export default DDtoast;
