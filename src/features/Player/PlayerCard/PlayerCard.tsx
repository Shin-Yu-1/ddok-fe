import { DotsThreeVerticalIcon } from '@phosphor-icons/react';

import Button from '@/components/Button/Button';
import Thermometer from '@/components/Thermometer/Thermometer';
import Badge from '@/features/Badge/Badge';
import type { Player } from '@/schemas/player.schema';

import styles from './PlayerCard.module.scss';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <div className={styles.playerCard}>
      <div className={styles.playerTemperatureWrapper}>
        <Thermometer temperature={player.temperature} />
        <span className={styles.temperature}>{player.temperature}℃</span>
        <Button size="sm" textColor={'var(--gray-1)'} backgroundColor="none" padding="0%">
          <DotsThreeVerticalIcon className={styles.buttonIcon} />
        </Button>
      </div>
      <div className={styles.profileImage}>
        <img src={player.profileImageUrl} alt={`${player.nickname} 프로필`} />
      </div>
      <h3 className={styles.nickname}>{player.nickname}</h3>
      <div className={styles.line}>
        <div className={styles.badgeWrapper}>
          {player.mainBadge.map(badge => (
            <Badge key={`${badge.type}${badge.tier}`} heightSize={16} mainBadge={badge} />
          ))}
        </div>
      </div>
      <div className={styles.playerInfo}>
        <p className={styles.details}>{player.address}</p>
        <p className={styles.details}>{player.mainPosition}</p>
      </div>
    </div>
  );
};

export default PlayerCard;
