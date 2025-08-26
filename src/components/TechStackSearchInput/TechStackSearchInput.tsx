import { useState } from 'react';

import { MagnifyingGlassIcon } from '@phosphor-icons/react';

import Input from '@/components/Input/Input';

interface TechStackSearchInputProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  className?: string;
}

const TechStackSearchInput = ({
  onSearch,
  placeholder = '기술 검색하기',
  className,
}: TechStackSearchInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    onSearch(inputValue.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleIconClick = () => {
    handleSearch();
  };

  return (
    <div className={className}>
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        width="100%"
        height="40px"
        fontSize="var(--fs-xxsmall)"
        backgroundColor="var(--white-3)"
        textColor="var(--black-1)"
        border="1px solid var(--gray-3)"
        focusBorder="1px solid var(--gray-3)"
        iconSize={24}
        rightIcon={
          <button
            type="button"
            onClick={handleIconClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <MagnifyingGlassIcon width={24} height={24} color="var(--black-1)" />
          </button>
        }
        style={
          {
            '--placeholder-color': 'var(--gray-2)',
            marginBottom: '1.5rem',
          } as React.CSSProperties
        }
      />
    </div>
  );
};

export default TechStackSearchInput;
