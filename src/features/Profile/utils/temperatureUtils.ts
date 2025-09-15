import BurningIcon from '@/assets/icons/temperature-burning-icon.svg';
import ColdIcon from '@/assets/icons/temperature-cold-icon.svg';
import CoolIcon from '@/assets/icons/temperature-cool-icon.svg';
import FreezingIcon from '@/assets/icons/temperature-freezing-icon.svg';
import HotIcon from '@/assets/icons/temperature-hot-icon.svg';
import WarmIcon from '@/assets/icons/temperature-warm-icon.svg';
import type { TemperatureLevel } from '@/types/user';

export const getTemperatureLevel = (temperature: number): TemperatureLevel => {
  if (temperature <= 10) return 'freezing';
  if (temperature <= 29) return 'cold';
  if (temperature <= 49) return 'cool';
  if (temperature <= 69) return 'warm';
  if (temperature <= 89) return 'hot';
  return 'burning';
};

export const getTemperatureIcon = (level: TemperatureLevel): string => {
  switch (level) {
    case 'freezing':
      return FreezingIcon;
    case 'cold':
      return ColdIcon;
    case 'cool':
      return CoolIcon;
    case 'warm':
      return WarmIcon;
    case 'hot':
      return HotIcon;
    case 'burning':
      return BurningIcon;
    default:
      return WarmIcon; // 기본값
  }
};
