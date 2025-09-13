import { Outlet } from 'react-router-dom';

import { ToastProvider } from '@/features/toast';

function App() {
  return (
    <ToastProvider position="top-right">
      <Outlet />
    </ToastProvider>
  );
}

export default App;
