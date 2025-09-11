import { forwardRef } from 'react';

import clsx from 'clsx';

import DdokLogo from '@/assets/images/DDOK/DDOK-Logo.svg';
import Button from '@/components/Button/Button';

import { useHeaderHandlers } from '../hooks/useHeaderHandlers';
import { useHeaderState } from '../hooks/useHeaderState';

import styles from './Header.module.scss';

interface HeaderProps {
  className?: string;
}

const Header = forwardRef<HTMLElement, HeaderProps>(({ className }, ref) => {
  const { variant, user } = useHeaderState();
  const handlers = useHeaderHandlers();

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
              onClick={handlers.handleSignUp}
            >
              회원가입
            </Button>
            <Button
              size="sm"
              fontSizePreset="xsmall"
              fontWeightPreset="regular"
              className={styles.button}
              onClick={handlers.handleSignIn}
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
              className={styles.buttonLogout}
              onClick={handlers.handleLogout}
            >
              로그아웃
            </Button>
            {user && (
              <div className={styles.userProfile} onClick={handlers.handleProfileClick}>
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
      <div className={styles.logoSection} onClick={handlers.handleLogoClick}>
        <img src={DdokLogo} alt="DDOK LOGO" className={styles.logo} />
      </div>

      {renderRightSection()}
    </header>
  );
});

Header.displayName = 'Header';
export default Header;
