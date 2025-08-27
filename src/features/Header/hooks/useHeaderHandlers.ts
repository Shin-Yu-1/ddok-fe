import { useNavigate } from 'react-router-dom';

export const useHeaderHandlers = () => {
  const navigate = useNavigate();

  return {
    handleSignIn: () => navigate('/auth/signin'),
    handleSignUp: () => navigate('/auth/signup'),
    handleLogout: () => navigate('/'),
    handleProfileClick: () => navigate('/profile/my'),
    handleLogoClick: () => navigate('/'),
  };
};
