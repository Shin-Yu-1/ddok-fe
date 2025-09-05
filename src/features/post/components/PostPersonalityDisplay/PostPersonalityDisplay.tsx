import styles from './PostPersonalityDisplay.module.scss';

interface PostPersonalityDisplayProps {
  selectedPersonality: string[];
}

const PostPersonalityDisplay = ({ selectedPersonality }: PostPersonalityDisplayProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.chipContainer}>
        {selectedPersonality.map((trait, index) => (
          <div key={`trait-${index}`} className={styles.chip}>
            {trait}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPersonalityDisplay;
