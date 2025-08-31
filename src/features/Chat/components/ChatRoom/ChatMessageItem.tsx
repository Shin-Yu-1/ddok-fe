import dayjs from 'dayjs';
import 'dayjs/locale/ko';

import type { ChatMessage, ChatRoomMember } from '@/schemas/chat.schema';

import styles from './ChatMessageItem.module.scss';

interface ChatMessageProps {
  messageItem: ChatMessage;
  memberInfo: ChatRoomMember;
  isMyMessage?: boolean;
}

const ChatMessageItem = ({ messageItem, memberInfo, isMyMessage }: ChatMessageProps) => {
  return (
    <div className={`${styles.chatMessageWrapper} ${isMyMessage ? styles.myMessage : ''}`}>
      <img className={styles.memberProfile} src={memberInfo.profileImage ?? undefined} />
      <div className={styles.message} key={messageItem.messageId}>
        <strong className={styles.sender}>{messageItem.senderNickname}</strong>
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
