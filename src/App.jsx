import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LeadInfoBar from './components/LeadInfoBar';
import PipelineStepper from './components/PipelineStepper';
import Sidebar from './components/Sidebar';
import FollowUpList from './components/FollowUpList';
import FollowUpForm from './components/FollowUpForm';
import LeadScore from './components/Widgets/LeadScore';
import ContactInfo from './components/Widgets/ContactInfo';
import CustomerRegistration from './components/Widgets/CustomerRegistration';
import DateTimePickerModal from './components/DateTimePickerModal';
import ConfirmModal from './components/ConfirmModal';

const App = () => {
  // ---------------- STATE MANAGEMENT ----------------
  const [viewMode, setViewMode] = useState('list');
  
  const [followUps, setFollowUps] = useState([]);

  const [formNote, setFormNote] = useState('');
  const [activeDateTab, setActiveDateTab] = useState('tomorrow');
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState('10');
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState('daily');
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatType, setRepeatType] = useState('daily'); // 'daily', 'weekly', 'monthly', 'custom'
  const [repeatEndType, setRepeatEndType] = useState('never'); // 'never', 'on_date', 'after'
  const [repeatEndDate, setRepeatEndDate] = useState(new Date(2026, 1, 23));
  const [repeatEndOccurrences, setRepeatEndOccurrences] = useState(1);
  const [currentEditId, setCurrentEditId] = useState(null);

  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // ---------------- AUTO VIEW SWITCH ----------------
  useEffect(() => {
    if (followUps.length === 0 && viewMode === 'list') {
      setViewMode('form');
    }
  }, [followUps.length, viewMode]);

  // Custom Date/Time State
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const [customFullDate, setCustomFullDate] = useState(new Date(2026, 1, 23)); 
  const [customHour, setCustomHour] = useState(10);
  const [customMinute, setCustomMinute] = useState(28);

  // ---------------- HELPERS ----------------
  const getThaiDate = (tab) => {
    const now = new Date(2026, 1, 23); // ล็อกวันนี้ไว้ที่ 23 ก.พ. 2026 ตาม mockup
    let targetDate = new Date(now);

    if (tab === 'tomorrow') {
      targetDate.setDate(now.getDate() + 1);
    } else if (tab === '3days') {
      targetDate.setDate(now.getDate() + 3);
    } else if (tab === 'nextweek') {
      targetDate.setDate(now.getDate() + 7);
    } else if (tab === 'custom') {
      targetDate = customFullDate;
    }

    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

    // ดึงเวลามาแสดงด้วยถ้าเป็นแบบ custom
    const timeStr = `${String(customHour).padStart(2, '0')} : ${String(customMinute).padStart(2, '0')}`;

    return {
      dayName: days[targetDate.getDay()],
      dateStr: `${targetDate.getDate()} ${months[targetDate.getMonth()]} ${targetDate.getFullYear() + 543}`,
      timeStr: timeStr,
      full: `${days[targetDate.getDay()]} ${targetDate.getDate()} ${months[targetDate.getMonth()]} ${targetDate.getFullYear() + 543}`
    };
  };

  // ---------------- HANDLERS ----------------
  const handleSave = () => {
    const selectedDate = getThaiDate(activeDateTab);
    
    if (currentEditId) {
      // โหมดแก้ไข
      setFollowUps(followUps.map(item => 
        item.id === currentEditId 
          ? { 
              ...item, 
              note: formNote.trim() || '(ไม่มีชื่อ)', 
              date: selectedDate.full,
              time: activeDateTab === 'custom' ? selectedDate.timeStr : '09:00',
              reminderMinutes: isReminderEnabled ? reminderMinutes : null,
              reminderEnabled: isReminderEnabled,
              repeatEnabled: isRepeatEnabled,
              repeatType: isRepeatEnabled ? repeatType : null,
              repeatFrequency: isRepeatEnabled ? repeatFrequency : null,
              repeatInterval: isRepeatEnabled ? repeatInterval : 1,
              repeatEndType: isRepeatEnabled ? repeatEndType : 'never',
              repeatEndDate: isRepeatEnabled && repeatEndType === 'on_date' ? repeatEndDate : null,
              repeatEndOccurrences: isRepeatEnabled && repeatEndType === 'after' ? repeatEndOccurrences : 1
            } 
          : item
      ));
    } else {
      // โหมดสร้างใหม่
      const newId = Math.random().toString(36).substr(2, 9);
      const newFollowUp = {
        id: newId,
        note: formNote.trim() || '(ไม่มีชื่อ)', 
        date: selectedDate.full, 
        time: activeDateTab === 'custom' ? selectedDate.timeStr : '09:00',
        reminderMinutes: isReminderEnabled ? reminderMinutes : null,
        status: 'pending',
        reminderEnabled: isReminderEnabled,
        repeatEnabled: isRepeatEnabled,
        repeatType: isRepeatEnabled ? repeatType : null,
        repeatFrequency: isRepeatEnabled ? repeatFrequency : null,
        repeatInterval: isRepeatEnabled ? repeatInterval : 1,
        repeatEndType: isRepeatEnabled ? repeatEndType : 'never',
        repeatEndDate: isRepeatEnabled && repeatEndType === 'on_date' ? repeatEndDate : null,
        repeatEndOccurrences: isRepeatEnabled && repeatEndType === 'after' ? repeatEndOccurrences : 1
      };
      setFollowUps([...followUps, newFollowUp]);
    }
    
    resetForm(); // รีเซ็ตฟอร์มหลังจากบันทึกเสร็จ
    setViewMode('list');
  };

  const handleApplyCustomTime = (date, hour, minute) => {
    setCustomFullDate(date);
    setCustomHour(hour);
    setCustomMinute(minute);
    setActiveDateTab('custom');
    setIsDateTimePickerOpen(false);
  };

  const resetForm = () => {
    setFormNote('');
    setActiveDateTab('tomorrow');
    setIsReminderEnabled(false);
    setReminderMinutes('10');
    setIsRepeatEnabled(false);
    setRepeatType('daily');
    setRepeatFrequency('daily');
    setRepeatInterval(1);
    setRepeatEndType('never');
    setRepeatEndDate(new Date(2026, 1, 23));
    setRepeatEndOccurrences(1);
    setCurrentEditId(null);
    setCustomFullDate(new Date(2026, 1, 23));
    setCustomHour(10);
    setCustomMinute(28);
  };

  const handleDelete = () => {
    if (deleteItemId) {
      setFollowUps(followUps.filter(f => f.id !== deleteItemId));
      setDeleteItemId(null);
    }
  };

  const toggleStatus = (id) => {
    setFollowUps(followUps.map(item => 
      item.id === id ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' } : item
    ));
  };

  const clearAllFollowUps = () => {
    setFollowUps([]);
    setIsDeleteAllModalOpen(false);
  };

  const handleEdit = (item) => {
    setFormNote(item.note);
    setIsReminderEnabled(item.reminderEnabled);
    if (item.reminderMinutes) setReminderMinutes(item.reminderMinutes);
    setIsRepeatEnabled(item.repeatEnabled || false);
    if (item.repeatType) setRepeatType(item.repeatType);
    if (item.repeatFrequency) setRepeatFrequency(item.repeatFrequency);
    if (item.repeatInterval) setRepeatInterval(item.repeatInterval);
    if (item.repeatEndType) setRepeatEndType(item.repeatEndType);
    if (item.repeatEndDate) setRepeatEndDate(new Date(item.repeatEndDate));
    if (item.repeatEndOccurrences) setRepeatEndOccurrences(item.repeatEndOccurrences);
    
    // ตั้งค่า Tab วันที่ (เป็นตัวอย่างเบื้องต้น)
    if (item.date.includes('23 ม.ค. 2569') || item.date.includes('2026')) {
       // ในของจริงควรจะ parse วันที่เพื่อหา tab ที่ถูกต้อง 
       // แต่สำหรับตัวอย่างนี้เราจะข้ามไปเปิดหน้า form ก่อน
    }
    
    setCurrentEditId(item.id);
    setViewMode('form');
  };

  return (
    <div 
      className="h-screen w-full flex items-center justify-center font-sans text-xs bg-cover bg-center bg-no-repeat p-2 md:p-4"
      style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/bg.png')" }}
    >
      <div className="bg-white w-full h-full max-w-[1040px] max-h-[100vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200/50 backdrop-blur-sm">
        <Header />
        <LeadInfoBar />
        <PipelineStepper />

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden bg-white">
          <Sidebar />

          <div className="flex-1 flex flex-col p-5 md:p-8 overflow-y-auto">
            {viewMode === 'list' ? (
              <FollowUpList 
                followUps={followUps} 
                setViewMode={setViewMode} 
                handleDelete={setDeleteItemId}
                handleEdit={handleEdit}
                toggleStatus={toggleStatus}
                clearAllFollowUps={() => setIsDeleteAllModalOpen(true)}
              />
            ) : (
              <FollowUpForm 
                followUps={followUps}
                formNote={formNote}
                setFormNote={setFormNote}
                activeDateTab={activeDateTab}
                setActiveDateTab={setActiveDateTab}
                isReminderEnabled={isReminderEnabled}
                setIsReminderEnabled={setIsReminderEnabled}
                reminderMinutes={reminderMinutes}
                setReminderMinutes={setReminderMinutes}
                isRepeatEnabled={isRepeatEnabled}
                setIsRepeatEnabled={setIsRepeatEnabled}
                repeatFrequency={repeatFrequency}
                setRepeatFrequency={setRepeatFrequency}
                repeatType={repeatType}
                setRepeatType={setRepeatType}
                repeatInterval={repeatInterval}
                setRepeatInterval={setRepeatInterval}
                repeatEndType={repeatEndType}
                setRepeatEndType={setRepeatEndType}
                repeatEndDate={repeatEndDate}
                setRepeatEndDate={setRepeatEndDate}
                repeatEndOccurrences={repeatEndOccurrences}
                setRepeatEndOccurrences={setRepeatEndOccurrences}
                handleSave={handleSave}
                resetForm={resetForm}
                setViewMode={setViewMode}
                getThaiDate={getThaiDate}
                openDateTimePicker={() => setIsDateTimePickerOpen(true)}
              />
            )}
          </div>

          <div className="w-[300px] bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto hidden lg:block">
            <LeadScore />
            <ContactInfo />
            <CustomerRegistration />
          </div>
        </div>
      </div>

      {/* MODAL */}
      <DateTimePickerModal 
        isOpen={isDateTimePickerOpen}
        onClose={() => setIsDateTimePickerOpen(false)}
        onApply={handleApplyCustomTime}
        initialHour={customHour}
        initialMinute={customMinute}
      />

      <ConfirmModal 
        isOpen={isDeleteAllModalOpen}
        onClose={() => setIsDeleteAllModalOpen(false)}
        onConfirm={clearAllFollowUps}
        title="ยืนยันการยกเลิกทั้งหมด"
        message="คุณต้องการลบข้อมูลการติดตามทั้งหมดใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
        confirmText="ลบข้อมูลทั้งหมด"
      />

      <ConfirmModal 
        isOpen={deleteItemId !== null}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleDelete}
        title="ยืนยันการลบ"
        message="คุณต้องการลบรายการติดตามนี้ใช่หรือไม่?"
        confirmText="ลบรายการ"
      />
    </div>
  );
};

export default App;

