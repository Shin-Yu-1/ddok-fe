import { z } from 'zod';

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.number(),
    message: z.string(),
    data: dataSchema.nullable(),
  });

export type ApiResponse<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof apiResponseSchema<T>>>;

export type ApiResponseType = z.infer<typeof apiResponseSchema>;
