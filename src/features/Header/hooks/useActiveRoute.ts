import { useLocation } from 'react-router-dom';

export const useActiveRoute = () => {
  const { pathname } = useLocation();

  const activeStates = {
    main: pathname === '/main',
    map: pathname === '/map',
    project: pathname.includes('/project'),
    study: pathname.includes('/study'),
    player: pathname.includes('/search/player') || pathname.includes('/profile/user'),
    ranking: pathname === '/ranking',
  };

  return activeStates;
};
