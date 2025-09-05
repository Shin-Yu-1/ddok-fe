import { z } from 'zod';

import { apiResponseSchema } from '@/schemas/api.schema';
import type { TeamStatus } from '@/types/project';

import { paginationSchema } from './chat.schema';

export type StudyType =
  | '자격증 취득'
  | '취업/면접'
  | '자기 개발'
  | '어학'
  | '생활'
  | '취미/교양'
  | '기타';

/* API REQUEST SCHEMA */
export const StudySearchRequestSchema = z.object({
  keyword: z.string(),
  status: z.custom<TeamStatus>(),
  type: z.string(),
  capacity: z.number(),
  mode: z.string(),
  ageMin: z.number(),
  ageMax: z.number(),
  expectedMonth: z.number(),
  startDate: z.string(),
  page: z.number(),
  size: z.number(),
});
export type StudySearchRequest = z.infer<typeof StudySearchRequestSchema>;

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
export type StudyItem = z.infer<typeof studyItemSchema>;

export const StudySearchDataSchema = z.object({
  items: z.array(studyItemSchema),
  pagination: paginationSchema,
});

export const studySearchApiResponseSchema = apiResponseSchema(StudySearchDataSchema);
export type StudySearchApiResponse = z.infer<typeof studySearchApiResponseSchema>;
