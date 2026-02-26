import React from 'react';
import { MessageSquare, CalendarCheck, DollarSign, FileText, Info } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-full md:w-14 border-b md:border-b-0 md:border-r border-gray-100 flex md:flex-col items-center justify-around md:justify-start py-3 md:py-8 gap-4 md:gap-8 text-gray-400 bg-white shadow-sm md:shadow-none">
       <MessageSquare size={20} className="cursor-pointer hover:text-gray-600 transition-colors" />
       <div className="relative cursor-pointer">
          <CalendarCheck size={20} className="text-[#0066FF]" />
          <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[8px] font-bold px-1 rounded shadow-sm">ON</span>
       </div>
       <DollarSign size={20} className="cursor-pointer hover:text-gray-600 transition-colors" />
       <FileText size={20} className="cursor-pointer hover:text-gray-600 transition-colors" />
       <Info size={20} className="cursor-pointer hover:text-gray-600 transition-colors" />
    </div>
  );
};

export default Sidebar;
