import { useState, useEffect } from 'react';

import { ShareNetworkIcon, CopyIcon, CheckIcon } from '@phosphor-icons/react';

import { DDtoast } from '@/features/toast';
import { useKakaoSDK } from '@/utils/kakaoShareUtils';

import styles from './ShareButton.module.scss';

interface ShareButtonProps {
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
}

const ShareButton = ({ title, description, imageUrl, url }: ShareButtonProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const { initializeKakao } = useKakaoSDK();

  const currentUrl = url || window.location.href;

  // 컴포넌트 마운트 시 카카오 SDK 초기화
  useEffect(() => {
    const setupKakao = async () => {
      const success = await initializeKakao();
      setIsKakaoReady(success);
    };

    setupKakao();
  }, [initializeKakao]);

  // 카카오톡 공유하기
  const handleKakaoShare = () => {
    if (!isKakaoReady || !window.Kakao) {
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: '카카오톡 공유 기능을 불러올 수 없습니다.',
      });
      return;
    }

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: title,
          description: description || '함께 성장할 팀원을 찾고 있습니다!',
          imageUrl: imageUrl || '',
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
        },
        buttons: [
          {
            title: '자세히 보기',
            link: {
              mobileWebUrl: currentUrl,
              webUrl: currentUrl,
            },
          },
        ],
      });

      setIsDropdownOpen(false);
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: '카카오톡 공유에 실패했습니다.',
      });
    }
  };

  // URL 복사하기
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      setIsDropdownOpen(false);

      DDtoast({
        mode: 'custom',
        type: 'success',
        userMessage: 'URL이 클립보드에 복사되었습니다.',
        duration: 2000,
      });

      // 3초 후 복사 상태 초기화
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      console.error('URL 복사 실패:', error);
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: 'URL 복사에 실패했습니다.',
      });
    }
  };

  // 드롭다운 토글
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 드롭다운 외부 클릭 시 닫기
  const handleOutsideClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.shareContainer}>
      <button onClick={toggleDropdown} className={styles.shareButton}>
        <ShareNetworkIcon size={16} />
      </button>

      {isDropdownOpen && (
        <>
          <div className={styles.backdrop} onClick={handleOutsideClick} />
          <div className={styles.dropdown}>
            <button className={styles.shareOption} onClick={handleKakaoShare}>
              <div className={styles.shareOptionIcon}>
                <img
                  src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                  alt="카카오톡 공유"
                  width={18}
                  height={18}
                  className={styles.kakaoIcon}
                />
              </div>
              <span>카카오톡</span>
            </button>

            <button className={styles.shareOption} onClick={handleCopyUrl}>
              <div className={styles.shareOptionIcon}>
                {isCopied ? <CheckIcon size={18} color="#22C55E" /> : <CopyIcon size={18} />}
              </div>
              <span>{isCopied ? '복사완료' : 'URL 복사'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
