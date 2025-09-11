import { useState, useRef, useEffect } from 'react';

import Button from '@/components/Button/Button';
import BaseModal from '@/components/Modal/BaseModal';

import styles from './BannerImageModal.module.scss';

interface BannerImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (file: File | null) => void;
  currentImageUrl?: string;
  /** 현재 선택된 배너 (File 또는 null) */
  currentBanner?: File | null;
  /** 초기 이미지 URL (되돌리기용) */
  initialImageUrl?: string;
}

const BannerImageModal = ({
  isOpen,
  onClose,
  onImageSelect,
  currentImageUrl,
  currentBanner,
}: BannerImageModalProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달 열릴 때 현재 상태로 초기화
  useEffect(() => {
    if (isOpen) {
      if (currentBanner) {
        setSelectedFile(currentBanner);
        setPreviewImage(URL.createObjectURL(currentBanner));
      } else if (currentImageUrl) {
        setSelectedFile(null);
        setPreviewImage(currentImageUrl);
      } else {
        setSelectedFile(null);
        setPreviewImage(null);
      }
    }
  }, [isOpen, currentBanner, currentImageUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 유효성 검사
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert('JPEG, PNG, WEBP 형식의 이미지만 업로드 가능합니다.');
        return;
      }

      if (file.size > maxSize) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      setSelectedFile(file);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = e => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleUseExisting = () => {
    // 기본 이미지 사용 (서버 기본 이미지)
    onImageSelect(null);
    onClose();
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onImageSelect(selectedFile);
      onClose();
    }
  };

  const handleModalClose = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="배너 이미지 변경하기"
      subtitle="배너 이미지를 업로드하세요"
    >
      <div className={styles.container}>
        {previewImage && (
          <div className={styles.preview}>
            <img src={previewImage} alt="배너 미리보기" className={styles.previewImage} />
          </div>
        )}

        <div className={styles.buttonGroup}>
          <Button
            variant="primary"
            radius="xsm"
            size="md"
            fullWidth
            className={styles.uploadButton}
            onClick={handleImageUpload}
          >
            이미지 파일 업로드하기
          </Button>

          <Button variant="outline" radius="xsm" size="md" fullWidth onClick={handleUseExisting}>
            서버 기본 배너로 변경하기
          </Button>
        </div>

        {selectedFile && (
          <div className={styles.confirmSection}>
            <div className={styles.selectedFileInfo}>
              <span className={styles.selectedIcon}>📁</span>
              <span className={styles.selectedName}>{selectedFile.name}</span>
              <span className={styles.selectedSize}>
                ({(selectedFile.size / 1024).toFixed(1)}KB)
              </span>
            </div>
            <Button variant="secondary" radius="xsm" size="md" fullWidth onClick={handleConfirm}>
              선택한 배너 이미지로 변경
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className={styles.hiddenInput}
        />
      </div>
    </BaseModal>
  );
};

export default BannerImageModal;
