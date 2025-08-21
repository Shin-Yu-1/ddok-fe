import { forwardRef } from 'react';

import DdokLogo from '@/assets/images/DDOK/DDOK-Logo.svg';

import Button from '../Button/Button';

import styles from './Header.module.scss';

export interface UserInfo {
  profileImage: string;
  nickname: string;
}

interface HeaderProps {
  variant?: 'logo-only' | 'guest' | 'user';
  user?: UserInfo;
  onLogin?: () => void;
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
      onLogin,
      onSignUp,
      onLogout,
      onProfileClick,
      onLogoClick,
      className,
    },
    ref
  ) => {
    const handleKeyDown = (callback?: () => void) => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callback?.();
      }
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
                fontSizePreset="xsmall" //16
                fontWeightPreset="regular"
                className={styles.button}
                onClick={onSignUp}
              >
                회원가입
              </Button>
              <Button
                size="sm"
                fontSizePreset="xsmall"
                fontWeightPreset="regular"
                className={styles.button}
                onClick={onLogin}
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
                onClick={onLogout}
              >
                로그아웃
              </Button>
              {user && (
                <div
                  className={styles.userProfile}
                  onClick={onProfileClick}
                  onKeyDown={handleKeyDown(onProfileClick)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${user?.nickname} 프로필`}
                >
                  <div className={styles.profileImage}>
                    <img src={user?.profileImage} alt={`${user?.nickname}의 프로필`} />
                  </div>
                  <span className={styles.nickname}> {user?.nickname}</span>
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
        className={[styles.header, className].filter(Boolean).join(' ')}
        role="banner"
      >
        <div
          className={styles.logoSection}
          onClick={onLogoClick}
          onKeyDown={handleKeyDown(onLogoClick)}
          role="button"
          tabIndex={0}
          aria-label="홈으로 이동"
        >
          <img src={DdokLogo} alt="DDOK LOGO" className={styles.logo} />
        </div>

        {renderRightSection()}
      </header>
    );
  }
);

Header.displayName = 'Header';
export default Header;
