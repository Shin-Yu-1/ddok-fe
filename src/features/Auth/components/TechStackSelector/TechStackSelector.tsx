import { useState } from 'react';

import TechStackSearchInput from '@/components/TechStackSearchInput/TechStackSearchInput';
import SelectedTechStacks from '@/features/Auth/components/SelectedTechStacks/SelectedTechStacks';
import TechStackSearchResults from '@/features/Auth/components/TechStackSearchResults/TechStackSearchResults';

import styles from './TechStackSelector.module.scss';

interface TechStackSelectorProps {
  selectedTechStack: number[];
  onTechStackToggle: (techId: number) => void;
}

const TechStackSelector = ({ selectedTechStack, onTechStackToggle }: TechStackSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleTechStackSelect = (techId: number) => {
    onTechStackToggle(techId);
  };

  const handleTechStackRemove = (techId: number) => {
    onTechStackToggle(techId);
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>당신의 기술 스택을 선택해주세요</h2>
      <TechStackSearchInput onSearch={handleSearch} placeholder="기술 검색하기" />

      <TechStackSearchResults
        searchTerm={searchTerm}
        selectedTechStack={selectedTechStack}
        onTechStackSelect={handleTechStackSelect}
        onButtonKeyDown={handleButtonKeyDown}
      />

      <SelectedTechStacks
        selectedTechStack={selectedTechStack}
        onTechStackRemove={handleTechStackRemove}
      />
    </div>
  );
};

export default TechStackSelector;
