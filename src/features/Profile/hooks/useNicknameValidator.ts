import { useMemo } from 'react';

import { nicknameSchema } from '@/schemas/user.schema';

export interface NicknameValidation {
  isValid: boolean;
  errorMessage: string;
}

export const useNicknameValidator = (nickname: string): NicknameValidation => {
  const validation = useMemo(() => {
    try {
      // Zod 스키마로 유효성 검사
      nicknameSchema.parse(nickname);
      return {
        isValid: true,
        errorMessage: '',
      };
    } catch (error) {
      // Zod 에러에서 메시지 추출
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as { issues: Array<{ message: string }> };
        const firstIssue = zodError.issues[0];
        return {
          isValid: false,
          errorMessage: firstIssue?.message || '유효하지 않은 닉네임입니다.',
        };
      }

      return {
        isValid: false,
        errorMessage: '유효하지 않은 닉네임입니다.',
      };
    }
  }, [nickname]);

  return validation;
};
