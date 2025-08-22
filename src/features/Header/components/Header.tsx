import { forwardRef } from 'react';

import clsx from 'clsx';

import DdokLogo from '@/assets/images/DDOK/DDOK-Logo.svg';
import type { UserInfo } from '@/types/user';

import Button from '@/components/Button/Button';
import { useHeaderHandlers } from '../hooks/useHeaderHandlers';

import styles from './Header.module.scss';

interface HeaderProps {
  variant?: 'logo-only' | 'guest' | 'user';
  user?: UserInfo;
  onSignin?: () => void;
  onSignUp?: () => void;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onLogoClick?: () => void;
  className?: string;
}

const Header = forwardRef<HTMLElement, HeaderProps>(
  (
    {
      variant = 'guest',
      user,
      onSignin: customSignin,
      onSignUp: customSignUp,
      onLogout: customLogout,
      onProfileClick: customProfileClick,
      onLogoClick: customLogoClick,
      className,
    },
    ref
  ) => {
    const defaultHandlers = useHeaderHandlers();

    // 커스텀 핸들러가 있으면 사용, 없으면 기본 핸들러 사용
    const handlers = {
      onSignin: customSignin || defaultHandlers.handleSignIn,
      onSignUp: customSignUp || defaultHandlers.handleSignUp,
      onLogout: customLogout || defaultHandlers.handleLogout,
      onProfileClick: customProfileClick || defaultHandlers.handleProfileClick,
      onLogoClick: customLogoClick || defaultHandlers.handleLogoClick,
    };

    const renderRightSection = () => {
      switch (variant) {
        case 'logo-only':
          return null;

        case 'guest':
          return (
            <div className={styles.rightSection}>
              <Button
                size="sm"
                fontSizePreset="xsmall"
                fontWeightPreset="regular"
                className={styles.button}
                onClick={handlers.onSignUp}
              >
                회원가입
              </Button>
              <Button
                size="sm"
                fontSizePreset="xsmall"
                fontWeightPreset="regular"
                className={styles.button}
                onClick={handlers.onSignin}
              >
                로그인
              </Button>
            </div>
          );

        case 'user':
          return (
            <div className={styles.rightSection}>
              <Button
                size="sm"
                fontSizePreset="xsmall"
                fontWeightPreset="regular"
                className={styles.button}
                onClick={handlers.onLogout}
              >
                로그아웃
              </Button>
              {user && (
                <div className={styles.userProfile} onClick={handlers.onProfileClick}>
                  <div className={styles.profileImage}>
                    <img src={user.profileImage} alt={`${user.nickname}의 프로필`} />
                  </div>
                  <span className={styles.nickname}>{user.nickname}</span>
                </div>
              )}
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <header
        ref={ref}
        className={clsx(styles.header, variant === 'logo-only' && styles.logoOnly, className)}
        role="banner"
      >
        <div className={styles.logoSection} onClick={handlers.onLogoClick}>
          <img src={DdokLogo} alt="DDOK LOGO" className={styles.logo} />
        </div>

        {renderRightSection()}
      </header>
    );
  }
);

Header.displayName = 'Header';
export default Header;
