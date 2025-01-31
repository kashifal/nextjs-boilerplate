import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white p-4 rounded-2xl shadow-sm animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-11 h-11 bg-gray-200 rounded-full"></div>
    </div>
    <div>
      <div className="h-4 w-20 bg-gray-200 mb-2"></div>
      <div className="h-6 w-32 bg-gray-200"></div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="grid grid-cols-6 p-4 items-center animate-pulse">
    <div className="col-span-1 flex items-center gap-2">
      <div className="w-11 h-11 bg-gray-200 rounded-lg"></div>
      <div className="h-5 w-20 bg-gray-200 rounded"></div>
    </div>
    <div className="col-span-1">
      <div className="h-5 w-24 bg-gray-200 rounded"></div>
    </div>
    <div className="col-span-1">
      <div className="h-5 w-20 bg-gray-200 rounded"></div>
    </div>
    <div className="col-span-1">
      <div className="h-5 w-16 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export const StatsSkeleton = () => (
  <div className="flex flex-col md:border-r-2 border-gray-200 lg:mr-5 animate-pulse">
    <div className="h-6 w-32 bg-gray-200 mb-2 rounded"></div>
    <div className="h-8 w-40 bg-gray-200 mb-2 rounded"></div>
    <div className="h-4 w-24 bg-gray-200 rounded"></div>
  </div>
); 