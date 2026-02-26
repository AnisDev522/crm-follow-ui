import React from 'react';
import { X } from 'lucide-react';

const Header = () => {
  return (
    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 bg-white">
      <h2 className="text-gray-700 font-bold text-xs md:text-sm truncate mr-2">ข้อมูลของ Lead</h2>
      <div className="flex items-center text-gray-500 text-[9px] md:text-[10px] shrink-0">
        <span className="hidden sm:inline">ข้อมูล ณ วันที่ 20 ก.พ.</span>
        <button className="ml-3 md:ml-4 hover:text-gray-800"><X size={16} /></button>
      </div>
    </div>
  );
};

export default Header;
