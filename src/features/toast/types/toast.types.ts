// 토스트 모드 타입
export type ToastMode = 'custom' | 'server-only' | 'server-first';

// 토스트 타입
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// API 응답 기본 구조
export interface ApiResponse {
  status: number;
  message: string;
  data?: unknown;
}

// 토스트 옵션
export interface ToastOptions {
  mode: ToastMode;
  type?: ToastType;
  userMessage?: string;
  duration?: number;
  apiResponse?: ApiResponse;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 토스트 설정
export interface ToastConfig {
  mode: ToastMode;
  type: ToastType;
  userMessage: string;
  apiResponse?: ApiResponse;
}

// 상태 코드별 토스트 타입 매핑
export const STATUS_TO_TOAST_TYPE: Record<string, ToastType> = {
  // 2xx 성공
  '200': 'success',
  '201': 'success',
  '204': 'success',
  // 4xx 클라이언트 에러
  '400': 'error',
  '401': 'error',
  '403': 'error',
  '404': 'error',
  '409': 'error',
  '422': 'warning',
  '429': 'warning',
  // 5xx 서버 에러
  '500': 'error',
  '502': 'error',
  '503': 'error',
  '504': 'error',
};
