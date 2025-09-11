import { useNavigate } from 'react-router-dom';

export const useSubHeaderHandlers = () => {
  const navigate = useNavigate();

  return {
    handleMainClick: () => navigate('/main'),
    handleMapClick: () => navigate('/map'),
    handleProjectClick: () => navigate('/search/project'),
    handleStudyClick: () => navigate('/search/study'),
    handlePlayerClick: () => navigate('/search/player'),
    handleRankingClick: () => navigate('/ranking'),
  };
};
