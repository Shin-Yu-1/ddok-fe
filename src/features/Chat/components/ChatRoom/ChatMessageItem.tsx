import dayjs from 'dayjs';
import 'dayjs/locale/ko';

import type { ChatMessage, ChatRoomMember } from '@/schemas/chat.schema';

import styles from './ChatMessageItem.module.scss';

interface ChatMessageProps {
  messageItem: ChatMessage;
  memberInfo?: ChatRoomMember | null;
  isMyMessage?: boolean;
}

const ChatMessageItem = ({ messageItem, memberInfo, isMyMessage }: ChatMessageProps) => {
  const profileSrc = memberInfo?.profileImage || undefined;
  const senderName = memberInfo?.nickname ?? messageItem.senderNickname ?? '알 수 없음';

  return (
    <div className={`${styles.chatMessageWrapper} ${isMyMessage ? styles.myMessage : ''}`}>
      <img className={styles.memberProfile} src={profileSrc} alt="프로필" loading="lazy" />
      <div className={styles.message}>
        <strong className={styles.sender}>{senderName}</strong>
        <div className={styles.bubbleRow}>
          <span className={styles.text}>{messageItem.contentText}</span>
          <span className={styles.time}>
            {dayjs(messageItem.createdAt).locale('ko').format('HH:mm')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageItem;
