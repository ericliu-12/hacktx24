import React from 'react';

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='border-4 shadow-md shadow-white border-purple-600 max-h-screen m-10 p-10 bg-transparent'>
      {children}
    </div>
  );
}
