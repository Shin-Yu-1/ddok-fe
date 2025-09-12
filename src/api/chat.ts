import { z } from 'zod';

import { api } from './api';

// DM 요청 응답 스키마
export const zDmRequestResponse = z.object({
  dmRequestId: z.number(),
  fromUserId: z.number(),
  toUserId: z.number(),
  status: z.string(),
  chatRoomId: z.number().nullable(),
  dmRequestPending: z.boolean(),
  createdAt: z.string(),
});

export type DmRequestResponse = z.infer<typeof zDmRequestResponse>;

// API 응답 래퍼 스키마
export const zApiResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.number(),
    message: z.string(),
    data: dataSchema,
  });

// DM 요청 생성 API
export const createDmRequest = async (toUserId: string): Promise<DmRequestResponse> => {
  const response = await api.post(`/api/chats/${toUserId}/dm-requests`);

  const validatedResponse = zApiResponse(zDmRequestResponse).parse(response.data);

  return validatedResponse.data;
};

// DM 요청 상태 확인 API (필요한 경우)
export const getDmRequestStatus = async (userId: string) => {
  const response = await api.get(`/api/chats/${userId}/dm-request-status`);
  return response.data;
};
