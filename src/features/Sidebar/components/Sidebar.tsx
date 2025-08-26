import {
  MailboxIcon,
  ChatsCircleIcon,
  AddressBookIcon,
  MapTrifoldIcon,
} from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';

import styles from './Sidebar.module.scss';

const Sidebar = () => {
  const location = useLocation();
  const isMapPage = location.pathname.startsWith('/map');

  const baseButtons = [
    {
      id: 'Mailbox',
      label: '수신함',
      icon: <MailboxIcon size={21} weight="light" />,
    },
    {
      id: 'Chat',
      label: '채팅',
      icon: <ChatsCircleIcon size={21} weight="light" />,
    },
    {
      id: 'friend',
      label: '친구',
      icon: <AddressBookIcon size={21} weight="light" />,
    },
  ];

  const buttons = [
    ...baseButtons,
    ...(isMapPage
      ? [
          {
            id: 'map',
            label: '지도',
            icon: <MapTrifoldIcon size={21} weight="light" />,
          },
        ]
      : []),
  ];

  return (
    <>
      <aside>
        <div>
          {buttons.map(button => (
            <button key={button.id} type="button" className={styles.sidebarButton}>
              <span className={styles.icon}>{button.icon}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
