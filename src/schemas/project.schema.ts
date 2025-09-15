import { z } from 'zod';

import { apiResponseSchema } from '@/schemas/api.schema';
import type { TeamStatus } from '@/types/project';

import { paginationSchema } from './chat.schema';

/* API REQUEST SCHEMA */
export const projectSearchRequestSchema = z.object({
  keyword: z.string(),
  status: z.custom<TeamStatus>(),
  position: z.string(),
  capacity: z.number(),
  mode: z.string(),
  ageMin: z.number(),
  ageMax: z.number(),
  expectedMonth: z.number(),
  startDate: z.string(),
  page: z.number(),
  size: z.number(),
});
export type ProjectSearchRequest = z.infer<typeof projectSearchRequestSchema>;

/* API RESPONSE SCHEMA */
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

export const projectSearchDataSchema = z.object({
  items: z.array(projectItemSchema),
  pagination: paginationSchema,
});

export const projectSearchResponseSchema = apiResponseSchema(projectSearchDataSchema);
export type ProjectSearchApiResponse = z.infer<typeof projectSearchResponseSchema>;
