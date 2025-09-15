import { useState, useEffect } from 'react';

import { ShareNetworkIcon, CopyIcon, CheckIcon } from '@phosphor-icons/react';

import kakaoIcon from '@/assets/icons/kakaotalk_sharing_btn_medium.png';
import Button from '@/components/Button/Button';
import { DDtoast } from '@/features/toast';
import { useKakaoSDK } from '@/utils/kakaoShareUtils';

import styles from './ShareButton.module.scss';

interface ShareButtonProps {
  title: string;
  imageUrl?: string;
  url?: string;
  postType?: 'project' | 'study';
  mode?: 'online' | 'offline';
  location?: string;
  duration?: number;
  capacity?: number;
  applicantCount?: number;
  startDate?: string;
  traits?: string[];
  status?: 'RECRUITING' | 'ONGOING' | 'CLOSED';
}

const ShareButton = ({
  title,
  imageUrl,
  url,
  postType = 'project',
  mode,
  location,
  duration,
  capacity,
  applicantCount,
  startDate,
  traits,
  status,
}: ShareButtonProps) => {
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

  // 향상된 설명 생성
  const generateEnhancedDescription = () => {
    const postTypeText = postType === 'project' ? '[프로젝트]' : '[스터디]';
    const statusText =
      status === 'RECRUITING' ? '모집중' : status === 'ONGOING' ? '진행중' : '종료';

    let description = `${postTypeText}`;

    // 팀 상태
    description += `\n• 팀 상태: ${statusText}`;

    // 모임 형태와 지역
    if (mode) {
      description += `\n• 형태: ${mode === 'online' ? '온라인' : '오프라인'}`;
      if (location && mode === 'offline') {
        description += ` (${location})`;
      }
    }

    // 기간과 시작일
    if (duration || startDate) {
      description += `\n• 일정: `;
      if (duration) {
        description += `${duration}개월`;
      }
      if (startDate) {
        const date = new Date(startDate);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
        description += duration ? ` | ${formattedDate} 시작` : `${formattedDate} 시작`;
      }
    }

    // 모집 현황
    if (capacity && applicantCount !== undefined) {
      const remaining = capacity - applicantCount;
      description += `\n• 모집: ${applicantCount}/${capacity}명`;
      if (remaining > 0 && status === 'RECRUITING') {
        description += ` (${remaining}명 더 필요)`;
      }
    }

    // 원하는 성향
    if (traits && traits.length > 0) {
      const displayTraits = traits.slice(0, 2); // 최대 2개로 줄임
      description += `\n- 성향: ${displayTraits.join(', ')}`;
      if (traits.length > 2) {
        description += ` 외 ${traits.length - 2}개`;
      }
    }

    return description;
  };

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
      const enhancedDescription = generateEnhancedDescription();

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${title}`,
          description: enhancedDescription,
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
      <Button
        variant="outline"
        size="sm"
        radius="xxsm"
        leftIcon={<ShareNetworkIcon size={16} />}
        onClick={toggleDropdown}
        className={styles.shareButton}
      >
        공유
      </Button>

      {isDropdownOpen && (
        <>
          <div className={styles.backdrop} onClick={handleOutsideClick} />
          <div className={styles.dropdown}>
            <button className={styles.shareOption} onClick={handleKakaoShare}>
              <div className={styles.shareOptionIcon}>
                <img
                  src={kakaoIcon}
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
