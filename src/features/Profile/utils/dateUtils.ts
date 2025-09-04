export const formatDateRange = (startDate: string, endDate?: string): string => {
  return endDate ? `${startDate} - ${endDate}` : `${startDate} -`;
};

export const formatTime = (hour: string): string => {
  const hourNum = parseInt(hour, 10);
  if (hourNum === 0) return '00:00';
  return `${hour.padStart(2, '0')}:00`;
};
