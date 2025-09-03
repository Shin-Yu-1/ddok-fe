import { z } from 'zod';

import { apiResponseSchema } from '@/schemas/api.schema';
import type { TeamStatus } from '@/types/project';

import { paginationSchema } from './chat.schema';

export type StudyType =
  | 'CERTIFICATION'
  | 'JOB_INTERVIEW'
  | 'SELF_DEV'
  | 'LANGUAGE'
  | 'LIFE'
  | 'HOBBY'
  | 'ETC';

export const studyItemSchema = z.object({
  studyId: z.number(),
  title: z.string(),
  teamStatus: z.custom<TeamStatus>(),
  bannerImageUrl: z.string(),
  capacity: z.number(),
  mode: z.string(),
  address: z.string(),
  studyType: z.custom<StudyType>(),
  preferredAges: z.object({
    ageMin: z.number(),
    ageMax: z.number(),
  }),
  expectedMonth: z.number(),
  startDate: z.string(),
});
export type studyItem = z.infer<typeof studyItemSchema>;

export const studyListSchema = z.object({
  items: z.array(studyItemSchema),
  pagination: paginationSchema,
});

export const studyListApiResponseSchema = apiResponseSchema(studyListSchema);
export type studyListApiResponse = z.infer<typeof studyListApiResponseSchema>;
