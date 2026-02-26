import React, { useState, useEffect } from 'react';
import { Repeat, ChevronDown, Clock, CalendarDays, RotateCw } from 'lucide-react';
import { Listbox, Portal } from '@headlessui/react';

/* ────────────────────────── Custom Select ────────────────────────── */
const CustomSelect = ({ value, onChange, options, disabled, labelPrefix = "" }) => {
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <Listbox.Button className={`flex items-center gap-1.5 text-[12px] font-medium transition-all rounded-lg px-3 py-1.5 ${disabled ? 'text-gray-300 cursor-not-allowed opacity-50' : 'text-gray-700 cursor-pointer hover:bg-gray-100 bg-gray-50 border border-gray-200'}`}>
          <span className="whitespace-nowrap">{labelPrefix}{selectedOption.label}</span>
          <ChevronDown size={13} className={disabled ? 'text-gray-200' : 'text-gray-400'} />
        </Listbox.Button>
        <Portal>
          <Listbox.Options 
            transition
            anchor="bottom start"
            className="z-[9999] min-w-[180px] [--anchor-gap:6px] [--anchor-max-height:220px] max-h-[--anchor-max-height] overflow-y-auto rounded-xl bg-white py-1.5 text-xs shadow-2xl ring-1 ring-black/8 focus:outline-none transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                className={({ focus, selected }) =>
                  `cursor-pointer select-none py-2.5 px-4 transition-colors ${
                    selected ? 'bg-blue-50 text-[#0066FF] font-semibold' : focus ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                  }`
                }
                value={option.value}
              >
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Portal>
      </div>
    </Listbox>
  );
};



/* ────────────────────────── Main Form ────────────────────────── */
const FollowUpForm = ({ 
  followUps,
  formNote, setFormNote, 
  activeDateTab, setActiveDateTab, 
  isReminderEnabled, setIsReminderEnabled,
  reminderMinutes, setReminderMinutes,
  isRepeatEnabled, setIsRepeatEnabled,
  repeatFrequency, setRepeatFrequency,
  repeatType, setRepeatType,
  repeatInterval, setRepeatInterval,
  repeatEndType, setRepeatEndType,
  repeatEndDate, setRepeatEndDate,
  repeatEndOccurrences, setRepeatEndOccurrences,
  handleSave, resetForm, setViewMode,
  getThaiDate,
  openDateTimePicker
}) => {
  const displayDate = getThaiDate(activeDateTab);

  const standardReminderValues = ['0', '5', '10', '15', '30', '60', '1440'];
  const isCustomReminder = !standardReminderValues.includes(String(reminderMinutes));

  const [customReminderValue, setCustomReminderValue] = useState(5);
  const [customReminderUnit, setCustomReminderUnit] = useState('minutes');

  useEffect(() => {
    if (isCustomReminder) {
      const minutes = parseInt(reminderMinutes);
      if (minutes % 10080 === 0) { setCustomReminderValue(minutes / 10080); setCustomReminderUnit('weeks'); }
      else if (minutes % 1440 === 0) { setCustomReminderValue(minutes / 1440); setCustomReminderUnit('days'); }
      else if (minutes % 60 === 0) { setCustomReminderValue(minutes / 60); setCustomReminderUnit('hours'); }
      else { setCustomReminderValue(minutes); setCustomReminderUnit('minutes'); }
    }
  }, [reminderMinutes, isCustomReminder]);

  /* ── Quick-date buttons config ── */
  const dateOptions = [
    { key: 'tomorrow', label: 'พรุ่งนี้' },
    { key: '3days', label: '3 วัน' },
    { key: 'nextweek', label: 'สัปดาห์หน้า' },
    { key: 'custom', label: 'กำหนดเอง', action: openDateTimePicker },
  ];

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* ══════════ Title ══════════ */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">การติดตาม</h3>
        <p className="text-xs text-gray-400 mt-0.5">ตั้งค่ารายละเอียดและกำหนดการติดตาม</p>
      </div>

      {/* ══════════ Note Input ══════════ */}
      <div className="mb-6">
        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 block">รายละเอียด</label>
        <input 
          type="text" 
          value={formNote}
          autoFocus
          onChange={(e) => setFormNote(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-blue-50 text-sm text-gray-700 placeholder-gray-300 transition-all bg-white"
          placeholder="เช่น ติดตามใบเสนอราคา, นัดประชุม..."
        />
      </div>

      {/* ══════════ Date & Time Section ══════════ */}
      <div className="mb-6">
        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 block">วันที่ติดตาม</label>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Date Display Card */}
          <div 
            onClick={openDateTimePicker}
            className="relative sm:w-[200px] bg-gray-50 rounded-2xl flex flex-col items-center justify-center py-5 px-6 cursor-pointer border border-gray-100 hover:bg-gray-100 transition-all group overflow-hidden"
          >
            <CalendarDays size={16} className="text-gray-400 mb-2" />
            <div className="text-gray-400 text-[11px] font-medium mb-0.5">{displayDate.dayName}</div>
            <div className="text-gray-500 text-xl font-light tracking-tight">{displayDate.dateStr}</div>
            {activeDateTab === 'custom' && (
              <div className="text-[#0066FF] text-base font-light mt-1">{displayDate.timeStr}</div>
            )}
          </div>

          {/* Quick Date Buttons */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            {dateOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => { opt.action ? opt.action() : setActiveDateTab(opt.key); }}
                className={`py-2.5 px-3 rounded-xl text-[13px] font-medium transition-all cursor-pointer border
                  ${activeDateTab === opt.key 
                    ? 'bg-blue-50 text-[#0066FF] border-[#0066FF]/30 shadow-sm' 
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ Settings Section ══════════ */}
      <div className="mb-6">
        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 block">ตั้งค่าเพิ่มเติม</label>
        
        <div className="space-y-3">
          {/* ── Reminder Setting ── */}
          <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isReminderEnabled ? 'border-[#0066FF]/20 bg-blue-50/30' : 'border-gray-200 bg-white'}`}>
            {/* Checkbox header */}
            <div className="flex items-center px-5 py-4 gap-4">
              <input
                type="checkbox"
                checked={isReminderEnabled}
                onChange={() => setIsReminderEnabled(!isReminderEnabled)}
                className="w-5 h-5 rounded border-2 border-gray-300 text-[#0066FF] focus:ring-[#0066FF] transition-all cursor-pointer shadow-sm"
              />
              <div>
                <span className="text-[13px] font-semibold text-gray-800 block">การแจ้งเตือน</span>
                <span className="text-[11px] text-gray-400">แจ้งเตือนก่อนถึงเวลานัด</span>
              </div>
            </div>

            {/* Reminder detail */}
            {isReminderEnabled && (
              <div className="px-5 pb-4 pt-0">
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Clock size={14} className="text-gray-400 shrink-0" />
                    <span className="text-[12px] text-gray-500 shrink-0">แจ้งเตือน</span>
                    <CustomSelect
                      value={isCustomReminder ? 'custom' : String(reminderMinutes)}
                      onChange={(val) => {
                        if (val === 'custom') setReminderMinutes('120');
                        else setReminderMinutes(val);
                      }}
                      options={[
                        { value: '0', label: 'ตรงเวลา' },
                        { value: '5', label: 'ก่อน 5 นาที' },
                        { value: '10', label: 'ก่อน 10 นาที' },
                        { value: '15', label: 'ก่อน 15 นาที' },
                        { value: '30', label: 'ก่อน 30 นาที' },
                        { value: '60', label: 'ก่อน 1 ชั่วโมง' },
                        { value: '1440', label: 'ก่อน 1 วัน' },
                        { value: 'custom', label: 'กำหนดเอง...' },
                      ]}
                    />
                  </div>

                  {isCustomReminder && (
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-dashed border-gray-100">
                      <span className="text-[11px] text-gray-400">ล่วงหน้า</span>
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                        <input
                          type="number"
                          min="1"
                          value={customReminderValue}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setCustomReminderValue(val);
                            let minutes = val;
                            if (customReminderUnit === 'hours') minutes = val * 60;
                            if (customReminderUnit === 'days') minutes = val * 1440;
                            if (customReminderUnit === 'weeks') minutes = val * 10080;
                            setReminderMinutes(String(minutes));
                          }}
                          className="w-12 text-center text-[12px] font-semibold text-gray-700 focus:outline-none bg-transparent py-1.5"
                        />
                      </div>
                      <CustomSelect
                        value={customReminderUnit}
                        onChange={(val) => {
                          setCustomReminderUnit(val);
                          let minutes = customReminderValue;
                          if (val === 'hours') minutes = customReminderValue * 60;
                          if (val === 'days') minutes = customReminderValue * 1440;
                          if (val === 'weeks') minutes = customReminderValue * 10080;
                          setReminderMinutes(String(minutes));
                        }}
                        options={[
                          { value: 'minutes', label: 'นาที' },
                          { value: 'hours', label: 'ชั่วโมง' },
                          { value: 'days', label: 'วัน' },
                          { value: 'weeks', label: 'สัปดาห์' },
                        ]}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Repeat Setting ── */}
          <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isRepeatEnabled ? 'border-[#0066FF]/20 bg-blue-50/30' : 'border-gray-200 bg-white'}`}>
            {/* Checkbox header */}
            <div className="flex items-center px-5 py-4 gap-4">
              <input
                type="checkbox"
                checked={isRepeatEnabled}
                onChange={() => setIsRepeatEnabled(!isRepeatEnabled)}
                className="w-5 h-5 rounded border-2 border-gray-300 text-[#0066FF] focus:ring-[#0066FF] transition-all cursor-pointer shadow-sm"
              />
              <div>
                <span className="text-[13px] font-semibold text-gray-800 block">การทำซ้ำ</span>
                <span className="text-[11px] text-gray-400">ตั้งค่าการติดตามซ้ำอัตโนมัติ</span>
              </div>
            </div>

            {/* Repeat detail */}
            {isRepeatEnabled && (
              <div className="px-5 pb-4 pt-0">
                <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
                  {/* Frequency Row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <RotateCw size={14} className="text-gray-400 shrink-0" />
                    <span className="text-[12px] text-gray-500 shrink-0">ความถี่</span>
                    <CustomSelect
                      value={repeatType}
                      onChange={(val) => {
                        setRepeatType(val);
                        if (val !== 'custom') { setRepeatFrequency(val); setRepeatInterval(1); }
                        else { setRepeatFrequency('daily'); setRepeatInterval(1); }
                      }}
                      options={[
                        { value: 'daily', label: 'ทุกวัน' },
                        { value: 'weekly', label: 'ทุกสัปดาห์' },
                        { value: 'monthly', label: 'ทุกเดือน' },
                        { value: 'custom', label: 'กำหนดเอง...' },
                      ]}
                    />
                  </div>

                  {/* Custom interval */}
                  {repeatType === 'custom' && (
                    <div className="flex items-center gap-3 pt-2 border-t border-dashed border-gray-100">
                      <span className="text-[11px] text-gray-400">ทุกๆ</span>
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                        <input
                          type="number"
                          min="1"
                          value={repeatInterval}
                          onChange={(e) => setRepeatInterval(parseInt(e.target.value) || 1)}
                          className="w-12 text-center text-[12px] font-semibold text-gray-700 focus:outline-none bg-transparent py-1.5"
                        />
                      </div>
                      <CustomSelect
                        value={repeatFrequency}
                        onChange={(val) => setRepeatFrequency(val)}
                        options={[
                          { value: 'daily', label: 'วัน' },
                          { value: 'weekly', label: 'สัปดาห์' },
                          { value: 'monthly', label: 'เดือน' },
                          { value: 'yearly', label: 'ปี' },
                        ]}
                      />
                    </div>
                  )}

                  {/* End Repeat */}
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-[11px] font-medium text-gray-400 mb-2.5 block">สิ้นสุดการทำซ้ำ</span>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2.5 cursor-pointer group py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <input 
                          type="radio" 
                          className="w-4 h-4 accent-[#0066FF] cursor-pointer" 
                          checked={repeatEndType === 'never'} 
                          onChange={() => setRepeatEndType('never')}
                        />
                        <span className={`text-[12px] ${repeatEndType === 'never' ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>ไม่มีวันสิ้นสุด</span>
                      </label>
                      
                      <label className="flex items-center gap-2.5 cursor-pointer group py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <input 
                          type="radio" 
                          className="w-4 h-4 accent-[#0066FF] cursor-pointer" 
                          checked={repeatEndType === 'on_date'} 
                          onChange={() => setRepeatEndType('on_date')}
                        />
                        <span className={`text-[12px] ${repeatEndType === 'on_date' ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>สิ้นสุดในวันที่</span>
                        {repeatEndType === 'on_date' && (
                          <input 
                            type="date" 
                            value={repeatEndDate.toISOString().split('T')[0]}
                            onChange={(e) => setRepeatEndDate(new Date(e.target.value))}
                            className="text-[12px] text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#0066FF] ml-1"
                          />
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════ Action Buttons ══════════ */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        {followUps && followUps.length > 0 && (
          <button 
            onClick={() => { resetForm(); setViewMode('list'); }}
            className="px-6 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] cursor-pointer transition-all"
          >
            ยกเลิก
          </button>
        )}
        <button
          onClick={handleSave}
          className="px-8 py-2.5 rounded-xl text-[13px] font-semibold bg-[#0066FF] text-white hover:bg-[#0052cc] active:scale-[0.98] cursor-pointer transition-all shadow-md shadow-blue-200/40"
        >
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default FollowUpForm;
