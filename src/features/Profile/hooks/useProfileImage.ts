import { useRef, useCallback, useMemo } from 'react';

export interface ProfileImageOptions {
  maxSize?: number;
  allowedTypes?: string[];
}

const DEFAULT_OPTIONS: ProfileImageOptions = {
  maxSize: 5, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

export const useProfileImage = (
  onImageChange: (file: File) => void | Promise<void>,
  options: ProfileImageOptions = DEFAULT_OPTIONS
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // useMemo로 mergedOptions를 메모이제이션
  const mergedOptions = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);

  const validateImage = useCallback(
    (file: File): string | null => {
      // 파일 타입 체크
      if (!mergedOptions.allowedTypes?.includes(file.type)) {
        return '지원하지 않는 파일 형식입니다. (JPG, PNG, WebP만 가능)';
      }

      // 파일 크기 체크
      const maxSizeBytes = (mergedOptions.maxSize || 5) * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return `파일 크기는 ${mergedOptions.maxSize}MB 이하여야 합니다.`;
      }

      return null;
    },
    [mergedOptions]
  );

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // 유효성 검사
      const error = validateImage(file);
      if (error) {
        alert(error);
        return;
      }

      try {
        await onImageChange(file);
      } catch (error) {
        console.error('이미지 처리 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      }

      // 파일 입력 초기화 (같은 파일 재선택 가능하도록)
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [onImageChange, validateImage]
  );

  const createImagePreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('이미지 미리보기 생성 실패'));
        }
      };
      reader.onerror = () => reject(new Error('파일 읽기 실패'));
      reader.readAsDataURL(file);
    });
  }, []);

  return {
    fileInputRef,
    handleImageClick,
    handleImageChange,
    createImagePreview,
    validateImage,
  };
};
