import React from 'react';
import { MoreVertical, Check } from 'lucide-react';

const LeadInfoBar = () => {
  return (
    <div className="flex flex-wrap md:flex-nowrap px-4 md:px-6 py-2.5 border-b border-gray-100 bg-white items-center text-[10px] md:text-[11px] gap-y-3 md:gap-0">
      <div className="flex items-center w-full md:w-56 border-b md:border-b-0 md:border-r border-gray-100 md:border-gray-200 pb-2 md:pb-0">
        <div className="relative mr-3 shrink-0">
          <div className="w-8 h-8 rounded-full border-2 border-[#0066FF] flex items-center justify-center text-[#0066FF] bg-white overflow-hidden">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#0066FF] rounded-full flex items-center justify-center text-white border-2 border-white">
            <Check size={8} strokeWidth={4} />
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-gray-500 mb-0.5 leading-none">ชื่อ Lead</div>
          <div className="font-bold text-[#1a1a1a] text-sm leading-tight truncate">test</div>
        </div>
      </div>
      
      <div className="px-4 md:px-6 border-r border-gray-100 md:border-gray-200 w-1/2 md:w-48">
        <div className="text-gray-500 mb-1">แหล่งที่มา</div>
        <div className="text-gray-800 truncate">Inbound Phone Calls</div>
      </div>
      
      <div className="px-4 md:px-6 border-r border-gray-100 md:border-gray-200 w-1/2 md:w-32">
        <div className="text-gray-500 mb-1">อายุ Lead</div>
        <div className="text-gray-800">5 ชม.</div>
      </div>

      <div className="px-4 md:px-6 border-r border-gray-100 md:border-gray-200 w-1/2 md:w-40 hidden sm:block">
        <div className="text-gray-500 mb-1">มูลค่า Lead</div>
        <div className="text-gray-800">0.00 THB</div>
      </div>

      <div className="px-4 md:px-6 flex-1 flex justify-between items-center min-w-0">
         <div className="truncate">
            <div className="text-gray-500 mb-1">ดูแลโดย</div>
            <div className="flex items-center text-gray-800 truncate">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#0066FF] mr-2 flex items-center justify-center text-[10px] text-white overflow-hidden shrink-0">
                <img src="https://ui-avatars.com/api/?name=Nattawut+Phakdee&background=0066ff&color=fff" alt="NP" />
              </div>
              <span className="truncate">Nattawut Phakdee</span>
            </div>
         </div>
         <MoreVertical size={16} className="text-gray-400 cursor-pointer shrink-0" />
      </div>
    </div>
  );
};

export default LeadInfoBar;
