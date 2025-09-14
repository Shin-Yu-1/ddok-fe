import { Outlet } from 'react-router-dom';

import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import { ToastProvider } from '@/features/toast';

function App() {
  return (
    <ToastProvider position="top-right">
      <ScrollToTop />
      <Outlet />
    </ToastProvider>
  );
}

export default App;
