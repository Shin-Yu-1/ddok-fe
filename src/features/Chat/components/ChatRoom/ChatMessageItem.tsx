import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useNavigate } from 'react-router-dom';

import type { ChatMessage, ChatRoomMember } from '@/schemas/chat.schema';

import styles from './ChatMessageItem.module.scss';

interface ChatMessageProps {
  messageItem: ChatMessage;
  memberInfo?: ChatRoomMember | null;
  isMyMessage?: boolean;
}

const ChatMessageItem = ({ messageItem, memberInfo, isMyMessage }: ChatMessageProps) => {
  const navigate = useNavigate();
  const profileSrc = memberInfo?.profileImage || undefined;
  const senderName = memberInfo?.nickname ?? messageItem.senderNickname ?? '알 수 없음';

  const profileClickHandle = () => {
    if (memberInfo) {
      navigate(`/profile/user/${memberInfo.userId}`);
    }
  };

  return (
    <div className={`${styles.chatMessageWrapper} ${isMyMessage ? styles.myMessage : ''}`}>
      <img
        className={styles.memberProfile}
        src={profileSrc}
        alt="프로필"
        loading="lazy"
        draggable="false"
        onClick={profileClickHandle}
      />
      <div className={styles.message}>
        <strong className={styles.sender} onClick={profileClickHandle}>
          {senderName}
        </strong>
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
