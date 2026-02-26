import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

const DateTimePickerModal = ({ isOpen, onClose, onApply, initialHour, initialMinute }) => {
  const [hour, setHour] = useState(initialHour || 10);
  const [minute, setMinute] = useState(initialMinute || 28);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 23)); // เริ่มที่ 23 ก.พ. 2026
  const [selectedDay, setSelectedDay] = useState(23);
  
  // วันนี้สำหรับเช็ค disable (ล็อกที่ 23 ก.พ. 2026 ตามโจทย์)
  const today = new Date(2026, 1, 23);
  
  const days = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

  // คำนวณวันที่ในเดือนนั้นๆ รวมถึงวันของเดือนก่อนหน้าและถัดไปเพื่อนำมาเติมให้เต็ม Rows
  const getDaysInMonth = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    
    const dates = [];
    
    // เติมวันจากเดือนก่อนหน้า
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      dates.push({ 
        d: lastDayOfPrevMonth - i, 
        isCurrentMonth: false,
        isPast: true 
      });
    }

    // เติมวันของเดือนปัจจุบัน
    for (let i = 1; i <= daysInMonth; i++) {
      const dateToCheck = new Date(year, month, i);
      dates.push({ 
        d: i, 
        isCurrentMonth: true,
        isPast: dateToCheck < new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        isToday: dateToCheck.getTime() === new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
      });
    }

    // เติมวันจากเดือนถัดไปเพื่อให้ครบ 42 ช่อง (6 แถว)
    const remainingSlots = 42 - dates.length;
    for (let i = 1; i <= remainingSlots; i++) {
      dates.push({ 
        d: i, 
        isCurrentMonth: false,
        isPast: false 
      });
    }
    
    return dates;
  };

  const dates = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  if (!isOpen) return null;

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    // ไม่ให้ย้อนกลับไปก่อนเดือนปัจจุบัน
    if (newDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentDate(newDate);
      setSelectedDay(1); // รีเซ็ตวันที่เลือกเมื่อเปลี่ยนเดือน
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(1); // รีเซ็ตวันที่เลือกเมื่อเปลี่ยนเดือน
  };

  const handleApply = () => {
    const finalDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    onApply(finalDate, hour, minute);
    onClose();
  };

  const handleDateClick = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return; // เลือกได้เฉพาะวันในเดือนที่กำลังดูอยู่
    
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (clickedDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      setSelectedDay(day);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] overflow-hidden px-4 md:px-8 py-4">
        <div className="p-2">
          <h3 className="text-base font-bold text-gray-800 mb-4">ระบุวันและเวลา</h3>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Calendar Part */}
            <div className="w-full md:flex-1">
              <div className="flex justify-between items-center mb-3">
                <button 
                  onClick={handlePrevMonth}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <ChevronLeft size={18}/>
                </button>
                <span className="font-semibold text-gray-700 text-sm">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear() + 543}
                </span>
                <button 
                  onClick={handleNextMonth}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <ChevronRight size={18}/>
                </button>
              </div>
              
              <div className="grid grid-cols-7 text-center mb-1">
                {days.map(d => (
                  <div key={d} className="text-[10px] text-gray-400 font-medium py-1">{d}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 text-center gap-y-1">
                {dates.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleDateClick(item.d, item.isCurrentMonth)}
                    className={`text-xs py-1 flex items-center justify-center rounded-md transition-colors h-7 w-7 mx-auto
                      ${!item.isCurrentMonth ? 'text-gray-200 cursor-default' : 
                        (item.d === selectedDay) ? 'bg-[#0066FF] text-white font-bold' : 
                        item.isPast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 cursor-pointer'}
                    `}
                  >
                    {item.d}
                  </div>
                ))}
              </div>
            </div>

            {/* Time Picker Part */}
            <div className="w-full md:w-32 flex flex-col items-center justify-center md:border-l border-t md:border-t-0 border-gray-100 pl-0 pt-4 md:pl-4 md:pt-0">
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <button onClick={() => setHour(h => (h + 1) % 24)} className="text-gray-400 hover:text-[#0066FF] mb-1"><ChevronUp size={20}/></button>
                  <div className="text-4xl font-light text-gray-600">{String(hour).padStart(2, '0')}</div>
                  <button onClick={() => setHour(h => (h - 1 + 24) % 24)} className="text-gray-400 hover:text-[#0066FF] mt-1"><ChevronDown size={20}/></button>
                </div>
                
                <div className="text-3xl font-light text-gray-400 mb-1">:</div>
                
                <div className="flex flex-col items-center">
                  <button onClick={() => setMinute(m => (m + 1) % 60)} className="text-gray-400 hover:text-[#0066FF] mb-1"><ChevronUp size={20}/></button>
                  <div className="text-4xl font-light text-gray-600">{String(minute).padStart(2, '0')}</div>
                  <button onClick={() => setMinute(m => (m - 1 + 60) % 60)} className="text-gray-400 hover:text-[#0066FF] mt-1"><ChevronDown size={20}/></button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-8">
            <button 
              onClick={onClose}
              className="px-5 py-1.5 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 text-xs font-medium"
            >
              ยกเลิก
            </button>
            <button 
              onClick={handleApply}
              className="px-7 py-1.5 bg-[#0066FF] text-white rounded-md hover:bg-[#0052cc] text-xs font-medium"
            >
              นำไปใช้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimePickerModal;
