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
export const abandonBadgeSchema = z.object({
  isGranted: z.boolean(),
  count: z.number(),
});
export type abandonBadge = z.infer<typeof abandonBadgeSchema>;

export const playerSchema = z.object({
  userId: z.number(),
  category: z.string(),
  nickname: z.string(),
  profileImageUrl: z.string(),
  mainBadge: mainBadgeSchema,
  abandonBadge: abandonBadgeSchema,
  mainPosition: z.string(),
  address: z.string(),
  temperature: z.number(),
  isMine: z.boolean(),
  chatRoomId: z.number(),
  dmRequestPending: z.boolean(),
});
export type Player = z.infer<typeof playerSchema>;

export const playerSearchSchema = z.object({
  items: z.array(playerSchema),
  pagination: paginationSchema,
});

export const playerSearchApiResponseSchema = apiResponseSchema(playerSearchSchema);
export type playerSearchApiResponse = z.infer<typeof playerSearchApiResponseSchema>;
