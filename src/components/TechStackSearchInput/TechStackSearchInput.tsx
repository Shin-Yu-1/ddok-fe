import { MagnifyingGlassIcon } from '@phosphor-icons/react';

import Input from '@/components/Input/Input';

interface TechStackSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TechStackSearchInput = ({
  value,
  onChange,
  placeholder = '기술 검색하기',
  className,
}: TechStackSearchInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        width="100%"
        height="40px"
        fontSize="var(--fs-xxsmall)"
        backgroundColor="var(--white-3)"
        textColor="var(--black-1)"
        border="1px solid var(--gray-3)"
        focusBorder="1px solid var(--gray-3)"
        iconSize={24}
        rightIcon={<MagnifyingGlassIcon width={24} height={24} color="var(--black-1)" />}
        style={
          {
            '--placeholder-color': 'var(--gray-2)',
            cursor: 'pointer',
          } as React.CSSProperties
        }
      />
    </div>
  );
};

export default TechStackSearchInput;
