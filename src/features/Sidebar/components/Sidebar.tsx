import { useEffect, useState } from 'react';

import {
  MailboxIcon,
  ChatsCircleIcon,
  MapTrifoldIcon,
  UserIcon,
  UsersIcon,
} from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';

import ChatList from '@/features/Chat/components/ChatList/ChatList';
import ChatRoom from '@/features/Chat/components/ChatRoom/ChatRoom';
import ChatRoomType from '@/features/Chat/enums/ChatRoomType.enum';
import NotificationList from '@/features/Notification/components/NotificationList/NotificationList';
import { useAuthStore } from '@/stores/authStore';
import { useChatUiStore } from '@/stores/chatUiStore';

import { useSidebarHandlers } from '../hooks/useSidebarHandlers';
import { useSidebarState } from '../hooks/useSidebarState';
import type { SectionType, ButtonConfig, SubButtonConfig } from '../types/sidebar';

import styles from './Sidebar.module.scss';
import SidePanel from './SidePanel';

const Sidebar = () => {
  const location = useLocation();
  const isMapPage = location.pathname.startsWith('/map');
  const { isLoggedIn } = useAuthStore();
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const { activeSection, expandedButton, activeSubSection, setActiveSection } = useSidebarState();
  const { handleButtonClick, handleSubButtonClick } = useSidebarHandlers();
  const { selectedRoom, closeRoom } = useChatUiStore();

  useEffect(() => {
    if (!isMapPage && activeSection === 'map') {
      setActiveSection(null);
    }
  }, [isMapPage, activeSection, setActiveSection]);

  useEffect(() => {
    closeRoom();
  }, [activeSubSection, closeRoom]);

  const chatSubButtons: SubButtonConfig[] = [
    {
      id: 'personal-chat',
      label: '1:1 채팅',
      icon: <UserIcon size={11} weight="regular" />,
    },
    {
      id: 'group-chat',
      label: '팀 채팅',
      icon: <UsersIcon size={11} weight="regular" />,
    },
  ];

  const baseButtons: ButtonConfig[] = [
    {
      id: 'notification',
      label: '수신함',
      icon: <MailboxIcon size={21} weight="light" />,
    },
    ...(isMapPage
      ? [
          {
            id: 'map' as SectionType,
            label: '지도',
            icon: <MapTrifoldIcon size={21} weight="light" />,
          },
        ]
      : []),
    {
      id: 'chat',
      label: '채팅',
      icon: <ChatsCircleIcon size={21} weight="light" />,
      hasSubmenu: true,
      subButtons: chatSubButtons,
    },
  ];

  // 비로그인 + MapPage인 경우 지도 버튼만 표시
  const buttons =
    !isLoggedIn && isMapPage ? baseButtons.filter(button => button.id === 'map') : baseButtons;

  const renderActiveSection = () => {
    if (!activeSection) return null;

    const sectionProps = {
      isOpen: true,
      onClose: () => handleButtonClick(activeSection),
    };

    switch (activeSection) {
      case 'notification':
        return (
          <SidePanel
            title={
              <div className={styles.headerTitle}>
                수신함
                {unreadNotificationCount > 0 && (
                  <span className={styles.unreadCount}>{unreadNotificationCount}</span>
                )}
              </div>
            }
            {...sectionProps}
          >
            <NotificationList onUnreadCountChange={setUnreadNotificationCount} />
          </SidePanel>
        );
      case 'chat': {
        let chatTitle = '채팅';
        if (selectedRoom == null) {
          if (activeSubSection === 'personal-chat') {
            chatTitle = '1:1 채팅';
          } else if (activeSubSection === 'group-chat') {
            chatTitle = '팀 채팅';
          }

          return (
            <SidePanel title={chatTitle} {...sectionProps}>
              <ChatList
                roomType={chatTitle === '팀 채팅' ? ChatRoomType.GROUP : ChatRoomType.PRIVATE}
              />
            </SidePanel>
          );
        } else {
          return (
            <SidePanel {...sectionProps}>
              <ChatRoom chat={selectedRoom} onBack={closeRoom} />
            </SidePanel>
          );
        }
      }
      case 'map':
        // map 섹션은 MapPage에서 처리하므로 SidePanel을 렌더링하지 않음
        return null;
      default:
        return null;
    }
  };

  const renderSubButtons = (subButtons: SubButtonConfig[]) => {
    return subButtons.map((subButton, index) => (
      <div key={subButton.id}>
        <button
          type="button"
          className={`${styles.subButton} ${activeSubSection === subButton.id ? styles.active : ''}`}
          onClick={() => handleSubButtonClick(subButton.id)}
          aria-label={subButton.label}
          aria-pressed={activeSubSection === subButton.id}
        >
          <span className={styles.subIcon}>{subButton.icon}</span>
        </button>
        {/* 서브 버튼 사이 구분선 */}
        {index < subButtons.length - 1 && <div className={styles.subDivider} />}
      </div>
    ));
  };

  return (
    <>
      <aside className={styles.sidebar} role="complementary">
        <div className={styles.buttonContainer}>
          {buttons.map((button, index) => (
            <div key={button.id}>
              <div
                className={`${styles.buttonGroup} ${
                  expandedButton === button.id ? styles.expanded : ''
                }`}
              >
                <button
                  type="button"
                  className={`${styles.sidebarButton} ${
                    activeSection === button.id ? styles.active : ''
                  } ${expandedButton === button.id ? styles.expanded : ''}`}
                  onClick={() => handleButtonClick(button.id)}
                  aria-label={button.label}
                  aria-pressed={activeSection === button.id}
                  aria-expanded={button.hasSubmenu ? expandedButton === button.id : undefined}
                >
                  <span className={styles.icon}>{button.icon}</span>
                  {button.id === 'notification' && unreadNotificationCount > 0 && (
                    <div className={styles.notificationDot} />
                  )}
                </button>

                {/* 하위 버튼들 (드롭다운) */}
                {button.hasSubmenu && expandedButton === button.id && button.subButtons && (
                  <div className={styles.submenu}>{renderSubButtons(button.subButtons)}</div>
                )}
              </div>

              {/* 버튼 그룹 사이 구분선 */}
              {index < buttons.length - 1 && <div className={styles.groupDivider} />}
            </div>
          ))}
        </div>
      </aside>

      {renderActiveSection()}
    </>
  );
};

export default Sidebar;
