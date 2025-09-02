import { z } from 'zod';

import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';
import { apiResponseSchema } from '@/schemas/api.schema';

import { paginationSchema } from './chat.schema';

export const mainBadgeSchema = z.object({
  type: z.nativeEnum(BadgeType),
  tier: z.nativeEnum(BadgeTier),
});
export type MainBadge = z.infer<typeof mainBadgeSchema>;

export const playerSchema = z.object({
  userId: z.number(),
  category: z.string(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  mainBadge: z.array(mainBadgeSchema),
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
