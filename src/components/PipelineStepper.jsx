import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Target } from 'lucide-react';

const PipelineStepper = () => {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-2 md:py-3 border-b border-gray-200 bg-white relative">
      <button className="flex items-center px-3 md:px-4 py-1.5 rounded-full border border-gray-300 text-gray-400 text-[9px] md:text-[10px] cursor-pointer shrink-0">
        <ChevronLeft size={12} className="md:mr-1"/> <span className="hidden md:inline">ย้อนกลับ</span>
      </button>
      
      <div className="flex-1 flex items-center justify-center px-2 md:px-10 relative">
        {/* Progress Line - Hidden or simplified on mobile */}
        <div className="absolute top-[14px] md:top-[20px] left-[15%] right-[15%] h-[1px] bg-gray-200 -z-0"></div>
        
        <div className="flex flex-col items-center mx-1 md:mx-14 bg-white px-1 md:px-2 z-10 shrink-0">
          <div className="w-6 h-6 md:w-7 md:h-7 rounded-full border-[1.5px] border-[#0066FF] text-[#0066FF] flex items-center justify-center font-bold text-[11px] md:text-sm bg-white mb-0.5 md:mb-1">1</div>
          <span className="text-[#0066FF] text-[8px] md:text-[10px] font-medium leading-none hidden sm:inline">ใหม่</span>
        </div>
        
        <div className="flex flex-col items-center mx-1 md:mx-14 bg-white px-1 md:px-2 z-10 shrink-0">
          <div className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-gray-400 text-gray-600 flex items-center justify-center text-[11px] md:text-sm bg-white mb-0.5 md:mb-1">2</div>
          <span className="text-gray-600 text-[8px] md:text-[10px] text-center leading-none hidden sm:inline">นำเสนอ</span>
        </div>

        <div className="flex flex-col items-center mx-1 md:mx-14 bg-white px-1 md:px-2 z-10 shrink-0">
          <div className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-gray-400 text-gray-600 flex items-center justify-center text-[11px] md:text-sm bg-white mb-0.5 md:mb-1">3</div>
          <span className="text-gray-600 text-[8px] md:text-[10px] text-center leading-none hidden sm:inline">ต่อรอง</span>
        </div>

        <div className="flex flex-col items-center mx-1 md:mx-14 bg-white px-1 md:px-2 z-10 shrink-0">
          <div className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-gray-400 text-gray-600 flex items-center justify-center text-[11px] md:text-sm bg-white mb-0.5 md:mb-1 relative">
            4
          </div>
          <div className="flex flex-col items-center hidden sm:flex">
            <span className="text-gray-600 text-[8px] md:text-[10px] text-center leading-none pt-0.5 mt-0.5">ปิดการขาย</span>
          </div>
        </div>
      </div>

      <button className="flex items-center px-3 md:px-4 py-1.5 rounded-full border border-[#0066FF] text-[#0066FF] text-[9px] md:text-[10px] cursor-pointer shrink-0">
        <span className="hidden md:inline">ถัดไป</span> <ChevronRight size={12} className="md:ml-1"/>
      </button>
    </div>
  );
};

export default PipelineStepper;
