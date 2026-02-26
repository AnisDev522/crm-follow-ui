import React from 'react';
import { MoreVertical, Phone, Mail, ChevronRight } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 relative">
      <div className="flex justify-between items-center mb-2">
        <div className="text-gray-500 text-xs">ผู้ติดต่อ</div>
        <MoreVertical size={14} className="text-gray-400 cursor-pointer" />
      </div>
      <div className="font-semibold text-gray-800 text-sm">test test</div>
      <div className="text-gray-400 text-xs mb-3">test</div>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-[#0066FF] text-xs">
          <Phone size={12} className="mr-2" /> 098-878-9877
        </div>
        <div className="flex items-start text-[#0066FF] text-xs break-all">
          <Mail size={12} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>anis.yayo@ext.readyplanet.com</span>
        </div>
      </div>
      <div className="flex items-center text-gray-400 text-xs cursor-pointer border-t border-gray-100 pt-2 mt-2">
        <ChevronRight size={14} className="mr-1 rotate-90"/> เพิ่มเติม
      </div>
    </div>
  );
};

export default ContactInfo;
