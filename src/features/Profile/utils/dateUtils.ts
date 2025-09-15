export const formatDateToDot = (dateString: string): string => {
  if (!dateString) return '';

  if (dateString.includes('.')) return dateString;

  return dateString.replace(/-/g, '.');
};

export const formatDateRange = (startDate: string, endDate?: string): string => {
  const formattedStartDate = formatDateToDot(startDate);

  if (!endDate) {
    return `${formattedStartDate} -`;
  }

  const formattedEndDate = formatDateToDot(endDate);
  return `${formattedStartDate} - ${formattedEndDate}`;
};

export const formatTime = (hour: string): string => {
  const hourNum = parseInt(hour, 10);
  if (hourNum === 0) return '00:00';
  return `${hour.padStart(2, '0')}:00`;
};
