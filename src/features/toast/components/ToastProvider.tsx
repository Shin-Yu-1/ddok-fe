import React from 'react';

import { Toaster } from 'sonner';

interface ToastProviderProps {
  children: React.ReactNode;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children, position = 'top-right' }) => {
  return (
    <>
      {children}
      <Toaster
        theme="light"
        position={position}
        expand={false}
        richColors={false}
        closeButton={true}
        // offset={120}
        visibleToasts={10}
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: '11px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            borderRadius: '8px',
            width: '270px',
            padding: '16px 20px',
            marginRight: '20px',
            marginTop: '80px',
            // background: '#ffffff',
            // border: '1px solid #e5e7eb',
            // color: '#374151',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        }}
      />
    </>
  );
};

export default ToastProvider;
