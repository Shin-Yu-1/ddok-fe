import { z } from 'zod';

import { api } from './api';

// 서버에서 오는 알림(날짜는 문자열)
export const zNotificationServer = z.object({
  id: z.string(),
  type: z.string(), // "PROJECT_JOIN_REQUEST" 등
  message: z.string(),
  isRead: z.boolean().optional(),
  createdAt: z.string(), // ISO
  userId: z.string().nullable().optional(),
  userNickname: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
  projectTitle: z.string().nullable().optional(),
  studyId: z.string().nullable().optional(),
  studyTitle: z.string().nullable().optional(),
  achievementName: z.string().nullable().optional(),
  teamId: z.string().nullable().optional(),
  teamName: z.string().nullable().optional(),
});

export type NotificationServer = z.infer<typeof zNotificationServer>;

// 프론트 사용 모델(날짜는 Date)
export type NotificationFront = {
  id: string;
  type: string; // 또는 프로젝트의 NotificationType
  message: string;
  isRead: boolean;
  createdAt: Date;
  userId?: string | null;
  userNickname?: string | null;
  projectId?: string | null;
  projectTitle?: string | null;
  studyId?: string | null;
  studyTitle?: string | null;
  achievementName?: string | null;
  teamId?: string | null;
  teamName?: string | null;
};

export const toFrontNotification = (n: NotificationServer): NotificationFront => ({
  ...n,
  isRead: !!n.isRead,
  createdAt: new Date(n.createdAt),
});

const zPageMeta = z.object({
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
});

export const zNotificationsListData = z.object({
  content: z.array(zNotificationServer),
  ...zPageMeta.shape,
});

export const zApiResponse = <T extends z.ZodTypeAny>(inner: T) =>
  z.object({
    status: z.number(),
    message: z.string(),
    data: inner,
  });

// 최종 응답 스키마
export const zListResponse = zApiResponse(zNotificationsListData);
export const zUnreadCountResponse = zApiResponse(z.object({ count: z.number() }));
export const zMarkAllReadResponse = zApiResponse(z.object({ changed: z.number() }));

// API 함수들
export interface NotificationListParams {
  page?: number;
  size?: number;
  isRead?: boolean;
  type?: string;
}

// 알림 목록 조회
export const getNotifications = async (params: NotificationListParams = {}) => {
  const { page = 0, size = 20, isRead, type } = params;

  const searchParams = new URLSearchParams();
  searchParams.set('page', page.toString());
  searchParams.set('size', size.toString());

  if (isRead !== undefined) {
    searchParams.set('isRead', isRead.toString());
  }

  if (type) {
    searchParams.set('type', type);
  }

  const response = await api.get(`/api/notifications?${searchParams.toString()}`);
  const validatedResponse = zListResponse.parse(response.data);

  return {
    ...validatedResponse.data,
    content: validatedResponse.data.content.map(toFrontNotification),
  };
};

// 안 읽은 알림 개수 조회
export const getUnreadCount = async () => {
  const response = await api.get('/api/notifications/unread-count');
  const validatedResponse = zUnreadCountResponse.parse(response.data);
  return validatedResponse.data.count;
};

// 단건 읽음 처리
export const markAsRead = async (id: string) => {
  const response = await api.patch(`/api/notifications/${id}/read`);
  return response.data;
};

// 액션 응답 스키마
export const zActionResponse = zApiResponse(z.null());

// 알림 승인
export const acceptNotification = async (id: string) => {
  const response = await api.post(`/api/notifications/${id}/accept`);
  const validatedResponse = zActionResponse.parse(response.data);
  return validatedResponse;
};

// 알림 거절
export const rejectNotification = async (id: string) => {
  const response = await api.post(`/api/notifications/${id}/reject`);
  const validatedResponse = zActionResponse.parse(response.data);
  return validatedResponse;
};
