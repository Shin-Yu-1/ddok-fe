import { useState, useRef, useEffect } from 'react';

import { Copy } from '@phosphor-icons/react';

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
  const [copySuccess, setCopySuccess] = useState<string>('');
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
      setCopySuccess('');
    }
  }, [isOpen, currentBanner, currentImageUrl]);

  // 현재 상태 정보 가져오기
  const getCurrentStatus = () => {
    if (currentBanner) {
      return {
        type: 'file',
        display: currentBanner.name,
        copyable: `${currentBanner.name} (${(currentBanner.size / 1024).toFixed(1)}KB)`,
      };
    }

    if (currentImageUrl) {
      return {
        type: 'url',
        display: getDisplayUrl(currentImageUrl),
        copyable: currentImageUrl,
      };
    }

    return {
      type: 'default',
      display: '기본 배너 이미지',
      copyable: '기본 배너 이미지 (서버 기본값)',
    };
  };

  // URL을 읽기 쉽게 줄여서 표시
  const getDisplayUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop() || pathname;

      if (filename.length > 40) {
        return `...${filename.slice(-37)}`;
      }

      return filename || url;
    } catch {
      return url.length > 40 ? `...${url.slice(-37)}` : url;
    }
  };

  // 클립보드 복사
  const handleCopyToClipboard = async () => {
    const { copyable } = getCurrentStatus();

    try {
      await navigator.clipboard.writeText(copyable);
      setCopySuccess('복사됨!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
      setCopySuccess('복사 실패');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

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
    setCopySuccess('');
    onClose();
  };

  const currentStatus = getCurrentStatus();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="배너 이미지 변경하기"
      subtitle="배너 이미지를 업로드하세요"
    >
      <div className={styles.container}>
        <div className={styles.uploadInfo}>
          <div className={styles.infoHeader}>
            <div className={styles.infoLabel}>현재 상태</div>
            <button
              className={styles.copyButton}
              onClick={handleCopyToClipboard}
              title="클립보드에 복사"
            >
              <Copy size={14} />
              {copySuccess || '복사'}
            </button>
          </div>
          <div className={`${styles.infoValue} ${styles[currentStatus.type]}`}>
            <span className={styles.statusIcon}>
              {currentStatus.type === 'file' && '📁'}
              {currentStatus.type === 'url' && '🔗'}
              {currentStatus.type === 'default' && '🏞️'}
            </span>
            <span className={styles.statusText}>{currentStatus.display}</span>
          </div>

          {currentStatus.type === 'url' && (
            <div className={styles.fullUrl} title={currentStatus.copyable}>
              전체 URL: {currentStatus.copyable}
            </div>
          )}
        </div>

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
