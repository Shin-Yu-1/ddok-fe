import NotificationList from '@/features/Notification/components/NotificationList/NotificationList';

export default function NotificationCenterContainer({
  onUnreadCountChange,
}: {
  onUnreadCountChange?: (count: number) => void;
}) {
  return <NotificationList onUnreadCountChange={onUnreadCountChange} useApi={true} />;
}
