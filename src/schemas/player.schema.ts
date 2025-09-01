import { z } from 'zod';

import { apiResponseSchema } from '@/schemas/api.schema';

import { paginationSchema } from './chat.schema';

export const playerSchema = z.object({
  userId: z.number(),
  category: z.string(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  mainBadge: {
    type: z.string(),
    tier: z.string(),
  },
  abandonBadge: {
    isGranted: z.boolean(),
    count: z.number(),
  },
  mainPosition: z.string(),
  address: z.string(),
  temperature: z.number(),
  isMine: z.boolean(),
  chatRoomId: z.number(),
  dmRequestPending: z.boolean(),
});
export type Player = z.infer<typeof playerSchema>;

export const playerListSchema = z.object({
  items: z.array(playerSchema),
  pagination: paginationSchema,
});

export const playerListApiResponseSchema = apiResponseSchema(playerListSchema);
export type playerListApiResponse = z.infer<typeof playerListApiResponseSchema>;
