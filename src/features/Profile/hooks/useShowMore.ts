import { useState } from 'react';

export const useShowMore = (initialLimit: number = 8) => {
  const [showAll, setShowAll] = useState(false);

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
  };

  const getDisplayItems = <T>(items: T[]): T[] => {
    return showAll ? items : items.slice(0, initialLimit);
  };

  const hasMoreItems = (items: unknown[]): boolean => {
    return items.length > initialLimit;
  };

  const getShowMoreText = (showAll: boolean, itemType: string): string => {
    return showAll ? `Show less ${itemType} ▲` : `Show more ${itemType} ▼`;
  };

  return {
    showAll,
    handleToggleShowAll,
    getDisplayItems,
    hasMoreItems,
    getShowMoreText,
  };
};
