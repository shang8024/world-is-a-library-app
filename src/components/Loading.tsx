import React from 'react';
import { Spinner } from '@/components/ui/spinner';

const Loading = () => {
  return (
    <div className="w-full min-h-[calc(100vh-56px)] flex gap-3 justify-center items-center">
      <Spinner size="large" className='size-10 text-2xl animate-spin'>Loading...</Spinner>
    </div>
  );
};

export default Loading;
