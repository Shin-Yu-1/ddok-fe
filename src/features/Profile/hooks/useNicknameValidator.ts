import { useMemo } from 'react';

export interface NicknameValidation {
  isValid: boolean;
  errorMessage: string;
}

export const useNicknameValidator = (nickname: string): NicknameValidation => {
  const validation = useMemo(() => {
    const trimmed = nickname.trim();

    // 빈 값 체크
    if (!trimmed) {
      return {
        isValid: false,
        errorMessage: '닉네임을 입력해주세요.',
      };
    }

    // 길이 체크 (2~12자)
    if (trimmed.length < 2) {
      return {
        isValid: false,
        errorMessage: '닉네임은 2자 이상이어야 합니다.',
      };
    }

    if (trimmed.length > 12) {
      return {
        isValid: false,
        errorMessage: '닉네임은 12자 이하여야 합니다.',
      };
    }

    // 허용 문자 체크 (한/영/숫자/_ 만 허용)
    const allowedChars = /^[가-힣a-zA-Z0-9_ ]+$/;
    if (!allowedChars.test(trimmed)) {
      return {
        isValid: false,
        errorMessage: '한글, 영문, 숫자, 밑줄(_)만 사용 가능합니다.',
      };
    }

    // 첫 글자가 공백이면 안됨
    if (trimmed.startsWith(' ')) {
      return {
        isValid: false,
        errorMessage: '닉네임은 공백으로 시작할 수 없습니다.',
      };
    }

    // 연속된 공백 불가 (단어 사이 1칸만)
    if (trimmed.includes('  ')) {
      return {
        isValid: false,
        errorMessage: '연속된 공백은 사용할 수 없습니다.',
      };
    }

    return {
      isValid: true,
      errorMessage: '',
    };
  }, [nickname]);

  return validation;
};
