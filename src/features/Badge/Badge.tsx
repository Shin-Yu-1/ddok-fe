import AbandonBadge from '@/assets/images/badge/abandon.png';
import CompleteBronzeBadge from '@/assets/images/badge/completeBronze.png';
import CompleteGoldBadge from '@/assets/images/badge/completeGold.png';
import CompleteSilverBadge from '@/assets/images/badge/completeSilver.png';
import LeaderBadge from '@/assets/images/badge/leader.png';
import LoginBronzeBadge from '@/assets/images/badge/loginBronze.png';
import LoginGoldBadge from '@/assets/images/badge/loginGold.png';
import LoginSilverBadge from '@/assets/images/badge/loginSilver.png';
import BadgeTier from '@/constants/enums/BadgeTier.enum';
import BadgeType from '@/constants/enums/BadgeType.enum';

interface BadgeProps {
  /** 메인 배지 (타입/티어) */
  mainBadge?: { type: BadgeType; tier: BadgeTier };
  /** 탈주 배지(수여 여부/횟수) – 타입이 ABANDON일 때 사용됨 */
  abandonBadge?: { isGranted: boolean; count: number };
  /** 이미지 크기(px 숫자 또는 '1.25rem' 등의 문자열). 기본 16 */
  widthSize?: number | string;
  heightSize?: number | string;
  /** 외부 스타일/클래스 오버라이드 */
  className?: string;
  style?: React.CSSProperties;
  /** 접근성용 대체 텍스트 오버라이드 */
  alt?: string;
}

const COMPLETE_SRC_BY_TIER: Record<BadgeTier, string> = {
  [BadgeTier.BRONZE]: CompleteBronzeBadge,
  [BadgeTier.SILVER]: CompleteSilverBadge,
  [BadgeTier.GOLD]: CompleteGoldBadge,
};

const LOGIN_SRC_BY_TIER: Record<BadgeTier, string> = {
  [BadgeTier.BRONZE]: LoginBronzeBadge,
  [BadgeTier.SILVER]: LoginSilverBadge,
  [BadgeTier.GOLD]: LoginGoldBadge,
};

function getBadgeSrc(type: BadgeType, tier?: BadgeTier, abandonGranted?: boolean): string | null {
  switch (type) {
    case BadgeType.COMPLETE:
      return COMPLETE_SRC_BY_TIER[tier ?? BadgeTier.BRONZE];
    case BadgeType.LOGIN:
      return LOGIN_SRC_BY_TIER[tier ?? BadgeTier.BRONZE];
    case BadgeType.LEADER_COMPLETE:
      return LeaderBadge;
    case BadgeType.ABANDON:
      return abandonGranted ? AbandonBadge : null;
    default:
      return null;
  }
}

const Badge: React.FC<BadgeProps> = ({
  mainBadge,
  abandonBadge,
  widthSize,
  heightSize,
  className,
  style,
  alt,
}) => {
  const src = getBadgeSrc(
    mainBadge?.type ?? BadgeType.ABANDON,
    mainBadge?.tier,
    abandonBadge?.isGranted
  );

  if (!src) return null;

  const width = typeof widthSize === 'number' ? `${widthSize}px` : widthSize;
  const height = typeof heightSize === 'number' ? `${heightSize}px` : heightSize;

  const mergedStyle: React.CSSProperties = {
    width: width ? width : 'auto',
    height: height ? height : 'auto',
    ...style,
  };

  const defaultAlt =
    alt ??
    `${mainBadge?.type ?? BadgeType.ABANDON}${mainBadge?.tier ? ` - ${mainBadge.tier.toLowerCase()}` : ''}`;

  return (
    <img
      src={src}
      alt={defaultAlt}
      className={className}
      style={mergedStyle}
      draggable={false}
      loading="lazy"
    />
  );
};

export default Badge;
