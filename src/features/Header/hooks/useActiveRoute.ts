import { useLocation } from 'react-router-dom';

export const useActiveRoute = () => {
  const { pathname } = useLocation();

  const activeStates = {
    map: pathname === '/map',
    project: pathname.includes('/project'),
    study: pathname.includes('/study'),
    player: pathname === '/search/player',
    ranking: pathname === '/ranking',
  };

  return activeStates;
};
