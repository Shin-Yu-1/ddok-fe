import { z } from 'zod';

import { apiResponseSchema } from '@/schemas/api.schema';
import type { TeamStatus } from '@/types/project';

import { paginationSchema } from './chat.schema';

export const projectItemSchema = z.object({
  projectId: z.number(),
  title: z.string(),
  teamStatus: z.custom<TeamStatus>(),
  bannerImageUrl: z.string(),
  positions: z.array(z.string()),
  capacity: z.number(),
  mode: z.string(),
  address: z.string(),
  preferredAges: z.object({
    ageMin: z.number(),
    ageMax: z.number(),
  }),
  expectedMonth: z.number(),
  startDate: z.string(),
});

export type ProjectItem = z.infer<typeof projectItemSchema>;

export const projectListSchema = z.object({
  items: z.array(projectItemSchema),
  pagination: paginationSchema,
});

export const projectListApiResponseSchema = apiResponseSchema(projectListSchema);
export type ProjectListApiResponse = z.infer<typeof projectListApiResponseSchema>;
