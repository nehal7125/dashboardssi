import React from 'react';
import { ReactNode } from 'react';

const PublicLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {children}
    </div>
  );
};

export default PublicLayout;
