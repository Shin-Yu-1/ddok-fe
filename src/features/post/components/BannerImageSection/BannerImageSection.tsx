import { useState, useRef, useEffect } from 'react';

import Button from '@/components/Button/Button';
import BannerImageModal from '@/features/post/Modal/BannerImageModal/BannerImageModal';

import styles from './BannerImageSection.module.scss';

interface BannerImageSectionProps {
  bannerImage?: string | File | null;
  onImageChange?: (file: File | null) => void;
  initialImageUrl?: string;
  height?: number | string;
  readonly?: boolean;
}

const BannerImageSection = ({
  bannerImage,
  onImageChange,
  initialImageUrl,
  height = '100%',
  readonly = false,
}: BannerImageSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let url = '';
    setImageLoadError(false);

    if (bannerImage) {
      if (typeof bannerImage === 'string') {
        url = bannerImage;
      } else if (bannerImage instanceof File) {
        url = URL.createObjectURL(bannerImage);
      }
    } else if (initialImageUrl) {
      url = initialImageUrl;
    }

    setImageUrl(url);

    return () => {
      if (bannerImage instanceof File && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [bannerImage, initialImageUrl]);

  const analyzeImageBrightness = (imgElement: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(imgElement, 0, 0, 50, 50);

      const imageData = ctx.getImageData(0, 0, 50, 50);
      const pixels = imageData.data;

      let totalBrightness = 0;
      let pixelCount = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        totalBrightness += brightness;
        pixelCount++;
      }

      const averageBrightness = totalBrightness / pixelCount;
      setIsDarkBackground(averageBrightness < 128);
    } catch (error) {
      console.warn('밝기 분석 실패, 기본값 사용:', error);
      setIsDarkBackground(false);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoadError(false);

    if (!readonly) {
      analyzeImageBrightness(e.currentTarget);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('이미지 로드 실패:', imageUrl, e);
    setImageLoadError(true);
  };

  const handleChangeClick = () => {
    if (readonly) return;
    setIsModalOpen(true);
  };

  const handleImageSelect = (file: File | null) => {
    onImageChange?.(file);
  };

  const hasValidImage = imageUrl && !imageLoadError;

  const containerStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
  };

  // 현재 상태를 정확히 파악하여 모달에 전달
  const getCurrentImageUrl = () => {
    // 1. 새로 선택한 파일이 있으면 undefined (파일이 우선)
    if (bannerImage instanceof File) {
      return undefined;
    }

    // 2. bannerImage가 URL 문자열이면 그것을 사용
    if (typeof bannerImage === 'string') {
      return bannerImage;
    }

    // 3. 그 외의 경우 초기 URL 사용 (Edit 페이지에서 주로 이 케이스)
    return initialImageUrl;
  };

  return (
    <div className={styles.container} style={containerStyle}>
      <div
        className={`${styles.background} ${!hasValidImage ? styles.noImage : ''} ${readonly ? styles.readonly : ''}`}
        style={{
          backgroundImage: hasValidImage ? `url(${imageUrl})` : 'none',
        }}
      >
        {!hasValidImage && (
          <div className={styles.placeholder}>
            <div className={styles.placeholderText}>
              {imageLoadError ? '이미지를 불러올 수 없습니다' : '배너 이미지가 없습니다'}
            </div>
          </div>
        )}

        {!readonly && (
          <div className={styles.buttonContainer}>
            <Button
              variant="none"
              radius="xsm"
              size="md"
              className={`${styles.changeButton} ${isDarkBackground ? styles.lightButton : styles.darkButton}`}
              onClick={handleChangeClick}
            >
              변경하기
            </Button>
          </div>
        )}
      </div>

      {imageUrl && (
        <>
          <img
            src={imageUrl}
            alt=""
            className={styles.hiddenImage}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <canvas ref={canvasRef} className={styles.hiddenCanvas} />
        </>
      )}

      {!readonly && (
        <BannerImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onImageSelect={handleImageSelect}
          currentImageUrl={getCurrentImageUrl()}
          currentBanner={bannerImage instanceof File ? bannerImage : null}
        />
      )}
    </div>
  );
};

export default BannerImageSection;
