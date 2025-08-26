export type SectionType = 'notification' | 'chat' | 'friend' | 'map';

export interface ButtonConfig {
  id: SectionType;
  label: string;
  icon: React.ReactNode;
}
