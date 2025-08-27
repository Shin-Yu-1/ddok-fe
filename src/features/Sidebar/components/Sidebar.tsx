import {
  MailboxIcon,
  ChatsCircleIcon,
  AddressBookIcon,
  MapTrifoldIcon,
} from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';

import { useSidebarHandlers } from '../hooks/useSidebarHandlers';
import { useSidebarState } from '../hooks/useSidebarState';
import type { SectionType, ButtonConfig } from '../types/sidebar';

import styles from './Sidebar.module.scss';
import SideSection from './SideSection';

const Sidebar = () => {
  const location = useLocation();
  const isMapPage = location.pathname.startsWith('/map');

  const { activeSection } = useSidebarState();
  const { handleButtonClick } = useSidebarHandlers();

  const baseButtons: ButtonConfig[] = [
    {
      id: 'notification',
      label: '수신함',
      icon: <MailboxIcon size={21} weight="light" />,
    },
    {
      id: 'chat',
      label: '채팅',
      icon: <ChatsCircleIcon size={21} weight="light" />,
    },
    {
      id: 'friend',
      label: '친구',
      icon: <AddressBookIcon size={21} weight="light" />,
    },
  ];

  const buttons: ButtonConfig[] = [
    ...baseButtons,
    ...(isMapPage
      ? [
          {
            id: 'map' as SectionType,
            label: '지도',
            icon: <MapTrifoldIcon size={21} weight="light" />,
          },
        ]
      : []),
  ];

  const renderActiveSection = () => {
    if (!activeSection) return null;

    const sectionProps = {
      isOpen: true,
      onClose: () => handleButtonClick(activeSection),
    };

    switch (activeSection) {
      case 'notification':
        return (
          <SideSection title="수신함" {...sectionProps}>
            <div>수신함 입니닷</div>
          </SideSection>
        );
      case 'chat':
        return (
          <SideSection title="채팅" {...sectionProps}>
            <div>채팅입니닷</div>
          </SideSection>
        );
      case 'friend':
        return (
          <SideSection title="친구" {...sectionProps}>
            <div>친구임다</div>
          </SideSection>
        );
      case 'map':
        return (
          <SideSection title="지도" {...sectionProps}>
            <div>지도임다</div>
          </SideSection>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <aside className={styles.sidebar} role="complementary">
        <div className={styles.buttonContainer}>
          {buttons.map(button => (
            <button
              key={button.id}
              type="button"
              className={`${styles.sidebarButton} ${
                activeSection === button.id ? styles.active : ''
              }`}
              onClick={() => handleButtonClick(button.id)}
              aria-label={button.label}
              aria-pressed={activeSection === button.id}
            >
              <span className={styles.icon}>{button.icon}</span>
            </button>
          ))}
        </div>
      </aside>

      {renderActiveSection()}
    </>
  );
};

export default Sidebar;
