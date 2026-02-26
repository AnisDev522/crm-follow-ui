import React, { Fragment } from 'react';
import { Plus, Calendar as CalendarIcon, Edit2, Trash2, Trash, CheckCircle2, Circle, Repeat, MoreVertical } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';

const FollowUpList = ({ followUps, setViewMode, handleDelete, handleEdit, toggleStatus, clearAllFollowUps }) => {
  const getRepeatText = (item) => {
    if (!item.repeatEnabled) return null;
    
    // Simple formats handle directly
    if (item.repeatType === 'daily') return 'ทุกวัน';
    if (item.repeatType === 'monthly') return 'ทุกเดือน';
    if (item.repeatType === 'weekly') return 'ทุกสัปดาห์';

    // Custom format handling
    if (item.repeatType === 'custom') {
      const interval = item.repeatInterval > 1 ? `ทุกๆ ${item.repeatInterval} ` : 'ทุก';
      
      switch (item.repeatFrequency) {
        case 'daily':
           return item.repeatInterval > 1 ? `ทุกๆ ${item.repeatInterval} วัน` : 'ทุกวัน';
        case 'weekly':
           return `${interval}สัปดาห์`;
        case 'monthly':
           return `${interval}เดือน`;
        case 'yearly':
           return `${interval}ปี`;
        default:
          return 'กำหนดเอง';
      }
    }

    return 'ทำซ้ำ';
  };
  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 border-b border-gray-100 pb-4 gap-4 sm:gap-0">
        <div>
          <h3 className="text-lg font-bold text-gray-800">การติดตาม</h3>
          <p className="text-xs text-gray-600 mt-1">จัดการนัดหมายและตารางการติดตามลูกค้ารายนี้</p>
        </div>
        <button 
          onClick={() => setViewMode('form')}
          className="flex items-center px-4 py-2 bg-[#0066FF] text-white rounded-md hover:bg-[#0052cc] transition-colors text-sm cursor-pointer"
        >
          <Plus size={16} className="mr-2"/> สร้าง
        </button>
      </div>

      <div className="space-y-4">
        {followUps.length > 0 && (
          <button 
            onClick={clearAllFollowUps}
            className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-500 transition-colors cursor-pointer px-1"
          >
            <Trash size={12} /> ยกเลิกทั้งหมด
          </button>
        )}
        {followUps.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
            <CalendarIcon className="mx-auto mb-3 text-gray-400" size={32} />
            <p className="mb-4">ยังไม่มีการติดตาม</p>
            <button 
              onClick={() => setViewMode('form')}
              className="inline-flex items-center px-4 py-2 bg-white border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors text-xs font-medium"
            >
              <Plus size={14} className="mr-1.5"/> สร้างรายการแรก
            </button>
          </div>
        ) : (
          followUps.map(item => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex items-start gap-4 hover:shadow-md transition-all bg-white">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-base text-gray-800">
                    {item.note}
                  </h4>
                  <div className="flex items-center -mr-3">
                    <Menu as="div" className="relative">
                      <Menu.Button className="p-1.5 rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer">
                        <MoreVertical size={18} />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-1 w-32 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10 py-1 overflow-hidden">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleEdit(item)}
                                className={`${
                                  active ? 'bg-blue-50 text-[#0066FF]' : 'text-gray-700'
                                } group flex w-full items-center px-3 py-2 text-xs cursor-pointer transition-colors`}
                              >
                                <Edit2 size={14} className="mr-2" />
                                แก้ไข
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleDelete(item.id)}
                                className={`${
                                  active ? 'bg-red-50 text-red-600' : 'text-gray-700'
                                } group flex w-full items-center px-3 py-2 text-xs cursor-pointer transition-colors`}
                              >
                                <Trash2 size={14} className="mr-2" />
                                ลบ
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="flex items-center flex-wrap gap-3 mt-2 text-[10px] md:text-xs text-gray-500">
                  <span className="flex items-center">
                    <CalendarIcon size={12} className="mr-1 text-gray-400"/> {item.date}
                  </span>
                  
                  {item.reminderEnabled && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center">
                        {item.reminderMinutes === '0' 
                          ? 'แจ้งเตือนเวลาที่ระบุ' 
                          : item.reminderMinutes === '1440'
                            ? 'แจ้งเตือนล่วงหน้า 1 วัน'
                            : item.reminderMinutes === '60'
                              ? 'แจ้งเตือนล่วงหน้า 1 ชั่วโมง'
                              : `แจ้งเตือนล่วงหน้า ${item.reminderMinutes} นาที`
                        }
                      </span>
                    </>
                  )}

                  {item.repeatEnabled && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="flex items-center">
                        <Repeat size={10} className="mr-1.5 text-gray-400"/> {getRepeatText(item)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FollowUpList;
