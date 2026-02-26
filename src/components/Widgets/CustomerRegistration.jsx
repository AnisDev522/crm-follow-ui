import React from 'react';
import { MoreVertical, ChevronRight } from 'lucide-react';

const CustomerRegistration = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 relative">
      <div className="flex justify-between items-center mb-2">
        <div className="text-gray-500 text-xs">ทะเบียนลูกค้า</div>
        <MoreVertical size={14} className="text-gray-400 cursor-pointer" />
      </div>
      <div className="font-semibold text-gray-800 text-sm mb-2">test</div>
      
      <div className="text-xs">
        <div className="text-gray-400 mb-0.5">ประเภท</div>
        <div className="text-gray-800 mb-3">บุคคลธรรมดา</div>
      </div>

      <div className="flex items-center text-gray-400 text-xs cursor-pointer border-t border-gray-100 pt-2 mt-2">
        <ChevronRight size={14} className="mr-1 rotate-90"/> เพิ่มเติม
      </div>
    </div>
  );
};

export default CustomerRegistration;
