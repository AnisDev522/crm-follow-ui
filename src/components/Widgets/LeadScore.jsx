import React from 'react';

const LeadScore = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="text-gray-500 text-xs mb-3">Lead Score</div>
      <div className="flex flex-col items-center justify-center py-2">
        <div className="w-16 h-16 bg-blue-100/50 flex items-center justify-center relative mb-2" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
          <span className="text-[#0066FF] text-xl font-bold">0</span>
        </div>
        <a href="#" className="text-[#0066FF] text-xs hover:underline">ดูรายละเอียด</a>
      </div>
    </div>
  );
};

export default LeadScore;
