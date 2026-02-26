import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Repeat, ChevronDown, Check, Minus, Plus, Clock } from 'lucide-react';
import { Listbox, Portal } from '@headlessui/react';

const CustomSelect = ({ value, onChange, options, disabled, labelPrefix = "" }) => {
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <Listbox.Button className={`flex items-center gap-1 text-[11px] font-medium transition-opacity ${disabled ? 'text-gray-300 cursor-not-allowed opacity-50' : 'text-gray-700 cursor-pointer hover:text-[#0066FF]'}`}>
          <span>{labelPrefix}{selectedOption.label}</span>
          <ChevronDown size={12} className={disabled ? 'text-gray-200' : 'text-gray-400'} />
        </Listbox.Button>
        <Portal>
          <Listbox.Options 
            transition
            anchor="top start"
            className="z-[9999] min-w-max [--anchor-gap:8px] [--anchor-max-height:180px] max-h-[--anchor-max-height] overflow-y-auto rounded-lg bg-white py-1 text-xs shadow-2xl ring-1 ring-black/10 focus:outline-none transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {options.map((option, idx) => (
              <Listbox.Option
                key={idx}
                className={({ focus, selected }) =>
                  `cursor-pointer select-none py-2.5 px-4 ${
                    selected ? 'bg-blue-50 text-[#0066FF] font-semibold' : focus ? 'bg-gray-50 text-gray-900' : 'text-gray-900'
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

  // Constants for standard reminder options
  const standardReminderValues = ['0', '5', '10', '15', '30', '60', '1440'];
  const isCustomReminder = !standardReminderValues.includes(String(reminderMinutes));

  // State for custom reminder inputs
  const [customReminderValue, setCustomReminderValue] = useState(5);
  const [customReminderUnit, setCustomReminderUnit] = useState('minutes');

  // Initialize custom reminder inputs when reminderMinutes changes to a custom value
  useEffect(() => {
    if (isCustomReminder) {
      const minutes = parseInt(reminderMinutes);
      if (minutes % 10080 === 0) {
        setCustomReminderValue(minutes / 10080);
        setCustomReminderUnit('weeks');
      } else if (minutes % 1440 === 0) {
        setCustomReminderValue(minutes / 1440);
        setCustomReminderUnit('days');
      } else if (minutes % 60 === 0) {
        setCustomReminderValue(minutes / 60);
        setCustomReminderUnit('hours');
      } else {
        setCustomReminderValue(minutes);
        setCustomReminderUnit('minutes');
      }
    }
  }, [reminderMinutes, isCustomReminder]);

  return (
    <div className="max-w-4xl mx-auto w-full bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-base font-bold text-gray-800">การติดตาม</h3>
        </div>
      </div>

      <div className="border-b border-dashed border-gray-300 pb-1.5 mb-5">
        <input 
          type="text" 
          value={formNote}
          autoFocus
          onChange={(e) => setFormNote(e.target.value)}
          className="w-full focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
          placeholder="รายละเอียดการติดตาม..."
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-5">
        {/* ซ้ายมือ: กล่องแสดงวันที่ และ ปุ่มเลือกวัน */}
        <div className="w-full md:w-[45%] flex flex-col gap-4">
          <div 
            onClick={openDateTimePicker}
            className="bg-gray-50 rounded-xl flex flex-col items-center justify-center py-4 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors h-[120px]"
          >
            <div className="text-gray-400 text-sm mb-0.5">{displayDate.dayName}</div>
            <div className="text-gray-500 text-2xl font-light mb-0.5">{displayDate.dateStr}</div>
            {activeDateTab === 'custom' && (
              <div className="text-[#0066FF] text-xl font-light">{displayDate.timeStr}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button 
              onClick={() => setActiveDateTab('tomorrow')}
              className={`py-2 rounded-full border text-xs cursor-pointer ${activeDateTab === 'tomorrow' ? 'bg-[#0066FF] text-white border-[#0066FF]' : 'border-[#0066FF] text-[#0066FF] bg-white'}`}
            >
              วันพรุ่งนี้
            </button>
            <button 
              onClick={() => setActiveDateTab('3days')}
              className={`py-2 rounded-full border text-xs cursor-pointer ${activeDateTab === '3days' ? 'bg-[#0066FF] text-white border-[#0066FF]' : 'border-[#0066FF] text-[#0066FF] bg-white'}`}
            >
              3 วันถัดไป
            </button>
            <button 
              onClick={() => setActiveDateTab('nextweek')}
              className={`py-2 rounded-full border text-xs cursor-pointer ${activeDateTab === 'nextweek' ? 'bg-[#0066FF] text-white border-[#0066FF]' : 'border-[#0066FF] text-[#0066FF] bg-white'}`}
            >
              สัปดาห์ถัดไป
            </button>
            <button 
              onClick={openDateTimePicker}
              className={`py-2 rounded-full border text-xs cursor-pointer ${activeDateTab === 'custom' ? 'bg-[#0066FF] text-white border-[#0066FF]' : 'border-[#0066FF] text-[#0066FF] bg-white'}`}
            >
              กำหนดเอง
            </button>
          </div>
        </div>

        {/* ขวามือ: Settings */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="space-y-3">
                      {/* ── Reminder Card ── */}
                      <div className={`rounded-xl border transition-all duration-300 ${isReminderEnabled ? 'border-[#0066FF]/20 bg-gradient-to-r from-blue-50/60 to-white shadow-sm' : 'border-gray-100 bg-gray-50/40'}`}>
                        <div className="flex items-center px-4 py-3 gap-4">
                          <input
                            type="checkbox"
                            checked={isReminderEnabled}
                            onChange={() => setIsReminderEnabled(!isReminderEnabled)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#0066FF] focus:ring-[#0066FF] transition-all cursor-pointer shadow-sm"
                          />
                          <div>
                            <span className="text-[13px] font-bold text-gray-800 block leading-tight">การแจ้งเตือน</span>
                          </div>
                        </div>

                        {isReminderEnabled && (
                          <div className="px-4 pb-4 pt-1 space-y-3 animate-in fade-in duration-200">
                            <div className="flex items-center flex-wrap gap-y-2 gap-x-4">
                              <div className="flex items-center gap-2">
                                <Clock size={13} className="text-gray-400 shrink-0" />
                                <span className="text-[11px] text-gray-500 shrink-0">เวลา</span>
                                <div className="ml-4">
                                  <CustomSelect
                                    value={isCustomReminder ? 'custom' : String(reminderMinutes)}
                                    onChange={(val) => {
                                      if (val === 'custom') setReminderMinutes('120');
                                      else setReminderMinutes(val);
                                    }}
                                    labelPrefix={reminderMinutes === '0' ? '' : ' '}
                                    options={[
                                      { value: '0', label: 'เวลาที่ระบุไว้' },
                                      { value: '5', label: 'ล่วงหน้า 5 นาที' },
                                      { value: '10', label: 'ล่วงหน้า 10 นาที' },
                                      { value: '15', label: 'ล่วงหน้า 15 นาที' },
                                      { value: '30', label: 'ล่วงหน้า 30 นาที' },
                                      { value: '60', label: 'ล่วงหน้า 1 ชั่วโมง' },
                                      { value: '1440', label: 'ล่วงหน้า 1 วัน' },
                                      { value: 'custom', label: 'กำหนดเอง' },
                                    ]}
                                  />
                                </div>
                              </div>

                              {isCustomReminder && (
                                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-1 duration-200 ml-2">
                                  <div className="flex items-baseline gap-1.5 border-b border-dotted border-gray-300 pb-0.5 px-1">
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
                                      className="w-6 text-center text-[12px] font-medium text-gray-800 focus:outline-none bg-transparent"
                                    />
                                  </div>
                                  <div className="border-b border-dotted border-gray-300 pb-0.5 px-1">
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
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ── Repeat Card ── */}
                      <div className={`rounded-xl border transition-all duration-300 ${isRepeatEnabled ? 'border-[#0066FF]/20 bg-gradient-to-r from-blue-50/50 to-white shadow-sm' : 'border-gray-100 bg-gray-50/40'}`}>
                        <div className="flex items-center px-4 py-3 gap-4">
                          <input
                            type="checkbox"
                            checked={isRepeatEnabled}
                            onChange={() => setIsRepeatEnabled(!isRepeatEnabled)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#0066FF] focus:ring-[#0066FF] transition-all shadow-sm cursor-pointer"
                          />
                          <div>
                            <span className="text-[13px] font-bold text-gray-800 block leading-tight">การทำซ้ำ</span>
                          </div>
                        </div>

                        {isRepeatEnabled && (
                          <div className="px-4 pb-4 pt-1 space-y-3 animate-in fade-in duration-200">
                            <div className="flex items-center flex-wrap gap-y-3 gap-x-6">
                              <div className="flex items-center gap-2">
                                <Repeat size={13} className="text-gray-400 shrink-0" />
                                <span className="text-[11px] text-gray-500 shrink-0">ความถี่</span>
                                <div className="ml-4">
                                  <CustomSelect
                                    value={repeatType}
                                    onChange={(val) => {
                                      setRepeatType(val);
                                      if (val !== 'custom') {
                                        setRepeatFrequency(val);
                                        setRepeatInterval(1);
                                      } else {
                                        setRepeatFrequency('daily');
                                        setRepeatInterval(1);
                                      }
                                    }}
                                    options={[
                                      { value: 'daily', label: 'ทุกวัน' },
                                      { value: 'weekly', label: 'ทุกสัปดาห์' },
                                      { value: 'monthly', label: 'ทุกเดือน' },
                                      { value: 'custom', label: 'กำหนดเอง' },
                                    ]}
                                  />
                                </div>
                              </div>

                              {repeatType === 'custom' && (
                                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-1 duration-200 ml-2">
                                  <div className="flex items-baseline gap-1.5 border-b border-dotted border-gray-300 pb-0.5 px-1">
                                    <input
                                      type="number"
                                      min="1"
                                      value={repeatInterval}
                                      onChange={(e) => setRepeatInterval(parseInt(e.target.value) || 1)}
                                      className="w-6 text-center text-[12px] font-medium text-gray-800 focus:outline-none bg-transparent"
                                    />
                                  </div>
                                  <div className="border-b border-dotted border-gray-300 pb-0.5 px-1">
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
                                </div>
                              )}
                            </div>

                            {/* ── End Repeat Section ── */}
                            <div className="pt-2 border-t border-dashed border-gray-100 mt-1">
                              <span className="text-[11px] text-gray-400 block mb-2">สิ้นสุดการทำซ้ำ</span>
                              <div className="flex flex-col gap-2.5">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                  <input 
                                    type="radio" 
                                    className="w-3.5 h-3.5 accent-[#0066FF] cursor-pointer" 
                                    checked={repeatEndType === 'never'} 
                                    onChange={() => setRepeatEndType('never')}
                                  />
                                  <span className={`text-[11px] ${repeatEndType === 'never' ? 'text-gray-800 font-medium' : 'text-gray-500 group-hover:text-gray-700'}`}>ไม่มี</span>
                                </label>
                                
                                <div className="flex items-center gap-2">
                                  <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                      type="radio" 
                                      className="w-3.5 h-3.5 accent-[#0066FF] cursor-pointer" 
                                      checked={repeatEndType === 'on_date'} 
                                      onChange={() => setRepeatEndType('on_date')}
                                    />
                                    <span className={`text-[11px] ${repeatEndType === 'on_date' ? 'text-gray-800 font-medium' : 'text-gray-500 group-hover:text-gray-700'}`}>ในวันที่</span>
                                  </label>
                                  {repeatEndType === 'on_date' && (
                                    <input 
                                      type="date" 
                                      value={repeatEndDate.toISOString().split('T')[0]}
                                      onChange={(e) => setRepeatEndDate(new Date(e.target.value))}
                                      className="text-[11px] text-gray-700 border-b border-dotted border-gray-300 focus:outline-none bg-transparent"
                                    />
                                  )}
                                </div>


                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

        <div className="mt-2">
          {/* ── Save Button ── */}
          <div className="pt-2 flex justify-end gap-3 items-center">
          {followUps && followUps.length > 0 && (
            <button 
              onClick={() => setViewMode('list')}
              className="px-6 py-2 rounded-md font-semibold text-[13px] bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 active:scale-[0.98] cursor-pointer transition-all duration-150 flex items-center gap-1.5 shadow-sm"
            >
            ยกเลิก
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-8 py-2 rounded-md font-semibold text-[13px] bg-[#0066FF] text-white hover:bg-[#0052cc] active:scale-[0.98] cursor-pointer transition-all duration-150 shadow-md shadow-blue-200/50"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
);
};

export default FollowUpForm;
