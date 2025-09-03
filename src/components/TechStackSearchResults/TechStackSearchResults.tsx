import { useState, useEffect } from 'react';

import { searchTechStacks } from '@/api/auth';
import Button from '@/components/Button/Button';

import styles from './TechStackSearchResults.module.scss';

interface TechStackSearchResultsProps {
  searchTerm: string;
  selectedTechStack: string[];
  onTechStackSelect: (techName: string) => void;
  onButtonKeyDown: (e: React.KeyboardEvent) => void;
}

const TechStackSearchResults = ({
  searchTerm,
  selectedTechStack,
  onTechStackSelect,
  onButtonKeyDown,
}: TechStackSearchResultsProps) => {
  const [searchedTechStacks, setSearchedTechStacks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechStacks = async () => {
      if (!searchTerm.trim()) {
        setSearchedTechStacks([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await searchTechStacks(searchTerm);
        // 선택되지 않은 기술스택만 필터링
        const filteredResults = results.filter(tech => !selectedTechStack.includes(tech));
        setSearchedTechStacks(filteredResults);
      } catch (err) {
        console.error('기술 스택 검색 실패:', err);
        setError('기술 스택을 불러오는데 실패했습니다.');
        setSearchedTechStacks([]);
      } finally {
        setIsLoading(false);
      }
    };

    // 디바운싱: 500ms 후에 검색 실행
    const timeoutId = setTimeout(fetchTechStacks, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedTechStack]);

  if (!searchTerm.trim()) {
    return null;
  }

  return (
    <div className={styles.searchSection}>
      <p className={styles.sectionSubtitle}>'{searchTerm}' 검색 결과</p>

      {isLoading && (
        <div className={styles.loading}>
          <p>검색 중...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && searchedTechStacks.length > 0 && (
        <div className={styles.techStackContainer}>
          {searchedTechStacks.map((tech, index) => (
            <Button
              key={`search-${tech}-${index}`}
              variant="primary"
              radius="xxsm"
              size="sm"
              onClick={() => onTechStackSelect(tech)}
              onKeyDown={onButtonKeyDown}
              className={`${styles.techButton}`}
            >
              <span className={styles.techName}>{tech}</span>
              <span className={styles.icon}>+</span>
            </Button>
          ))}
        </div>
      )}

      {!isLoading && !error && searchTerm.trim() && searchedTechStacks.length === 0 && (
        <div className={styles.noResults}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default TechStackSearchResults;
