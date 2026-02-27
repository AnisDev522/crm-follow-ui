import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  CalendarDays, Clock, Bell, Repeat, ChevronDown, Save
} from 'lucide-react';

// ── Preset Options ──────────────────────────────────────────
const DATE_OPTIONS = [
  { value: 'tomorrow', label: 'พรุ่งนี้' },
  { value: '3days', label: '3 วันถัดไป' },
  { value: 'nextweek', label: 'สัปดาห์ถัดไป' },
  { value: 'custom', label: 'กำหนดเอง' },
];

const REMINDER_OPTIONS = [
  { value: '0', label: 'เวลาที่ระบุไว้' },
  { value: '5', label: '5 นาที' },
  { value: '10', label: '10 นาที' },
  { value: '15', label: '15 นาที' },
  { value: '30', label: '30 นาที' },
  { value: '60', label: '1 ชั่วโมง' },
  { value: '1440', label: '1 วัน' },
  { value: 'custom', label: 'กำหนดเอง' },
];

const REPEAT_OPTIONS = [
  { value: 'daily', label: 'ทุกวัน' },
  { value: 'weekly', label: 'ทุกสัปดาห์' },
  { value: 'monthly', label: 'ทุกเดือน' },
  { value: 'custom', label: 'กำหนดเอง' },
];

const FREQ_OPTIONS = [
  { value: 'daily', label: 'วัน' },
  { value: 'weekly', label: 'สัปดาห์' },
  { value: 'monthly', label: 'เดือน' },
  { value: 'yearly', label: 'ปี' },
];

const REMINDER_UNIT_OPTIONS = [
  { value: 1, label: 'นาที' },
  { value: 60, label: 'ชั่วโมง' },
  { value: 1440, label: 'วัน' },
  { value: 10080, label: 'สัปดาห์' },
];

// ── Helpers ────────────────────────────────────────────────
function computeDate(option) {
  const now = dayjs();
  switch (option) {
    case 'tomorrow': return now.add(1, 'day');
    case '3days': return now.add(3, 'day');
    case 'nextweek': return now.add(1, 'week');
    default: return now;
  }
}

/** Reverse-map a reminderMinutes value back to preset or custom */
function reverseReminder(minutes) {
  const preset = REMINDER_OPTIONS.find(o => o.value === String(minutes));
  if (preset) return { option: String(minutes), value: 1, unit: 1 };
  // decompose into best unit
  for (const u of [...REMINDER_UNIT_OPTIONS].reverse()) {
    if (minutes >= u.value && minutes % u.value === 0) {
      return { option: 'custom', value: minutes / u.value, unit: u.value };
    }
  }
  return { option: 'custom', value: minutes, unit: 1 };
}

// ── Small UI Pieces ────────────────────────────────────────
const SectionLabel = ({ icon: Icon, children }) => (
  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
    <div className="text-[#0066FF]" />
    {children}
  </label>
);

const Chip = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
      active
        ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm shadow-blue-200'
        : 'bg-white text-gray-600 border-gray-200 hover:border-[#0066FF]/40 hover:text-[#0066FF]'
    }`}
  >
    {children}
  </button>
);

const Toggle = ({ checked, onChange, label }) => (
  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
    <span
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ${
        checked ? 'bg-[#0066FF]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </span>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </label>
);

const Select = ({ value, onChange, options, className = '' }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="appearance-none w-full rounded-lg border border-gray-200 bg-white pl-3 pr-8 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30 focus:border-[#0066FF]/50 transition-all cursor-pointer"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

// ════════════════════════════════════════════════════════════
// FollowUpForm Component
// ════════════════════════════════════════════════════════════
const FollowUpForm = ({ editingItem, onSave, onCancel, showCancel = true }) => {
  const isEdit = !!editingItem;

  // ── Core state ───────────────────────────────────────────
  const [note, setNote] = useState('');
  const [dateOption, setDateOption] = useState('tomorrow');
  const [customDate, setCustomDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [customTime, setCustomTime] = useState('09:00');

  // Reminder
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderOption, setReminderOption] = useState('0');
  const [customReminderValue, setCustomReminderValue] = useState(1);
  const [customReminderUnit, setCustomReminderUnit] = useState(60); // ชั่วโมง

  // Repeat
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatType, setRepeatType] = useState('daily');
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatFrequency, setRepeatFrequency] = useState('daily');
  const [repeatEndType, setRepeatEndType] = useState('never');
  const [repeatEndDate, setRepeatEndDate] = useState(dayjs().add(1, 'month').format('YYYY-MM-DD'));

  // ── Hydrate state from editingItem ───────────────────────
  useEffect(() => {
    if (!editingItem) return;
    setNote(editingItem.note || '');

    // Date
    setDateOption('custom');
    setCustomDate(editingItem.date || dayjs().format('YYYY-MM-DD'));
    setCustomTime(editingItem.time || '09:00');

    // Reminder
    setReminderEnabled(!!editingItem.reminderEnabled);
    if (editingItem.reminderEnabled) {
      const r = reverseReminder(Number(editingItem.reminderMinutes));
      setReminderOption(r.option);
      setCustomReminderValue(r.value);
      setCustomReminderUnit(r.unit);
    }

    // Repeat
    setRepeatEnabled(!!editingItem.repeatEnabled);
    if (editingItem.repeatEnabled) {
      setRepeatType(editingItem.repeatType || 'daily');
      setRepeatInterval(editingItem.repeatInterval || 1);
      setRepeatFrequency(editingItem.repeatFrequency || 'daily');
      setRepeatEndType(editingItem.repeatEndType || 'never');
      setRepeatEndDate(editingItem.repeatEndDate || dayjs().add(1, 'month').format('YYYY-MM-DD'));
    }
  }, [editingItem]);

  // ── Compute final date & time ────────────────────────────
  const resolvedDate =
    dateOption === 'custom' ? customDate : computeDate(dateOption).format('YYYY-MM-DD');
  const resolvedTime = dateOption === 'custom' ? customTime : '09:00';

  // ── Compute reminderMinutes ──────────────────────────────
  const computedReminderMinutes = (() => {
    if (!reminderEnabled) return 0;
    if (reminderOption === 'custom') {
      return Number(customReminderValue) * Number(customReminderUnit);
    }
    return Number(reminderOption);
  })();

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalNote = note.trim() || '(ไม่มีชื่อ)';

    const data = {
      id: isEdit ? editingItem.id : crypto.randomUUID(),
      note: finalNote,
      date: resolvedDate,
      time: resolvedTime,
      status: isEdit ? editingItem.status : 'pending',
      reminderEnabled,
      reminderMinutes: String(computedReminderMinutes),
      repeatEnabled,
      repeatType: repeatEnabled ? repeatType : null,
      repeatFrequency: repeatEnabled && repeatType === 'custom' ? repeatFrequency : null,
      repeatInterval: repeatEnabled ? repeatInterval : null,
      repeatEndType: repeatEnabled ? repeatEndType : null,
      repeatEndDate: repeatEnabled && repeatEndType === 'on_date' ? repeatEndDate : null,
    };

    onSave(data);
  };

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full space-y-6">
      {/* ── Header ──────────────────────────────── */}
      <div className="border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">
          {isEdit ? 'แก้ไขการติดตาม' : ''}
        </h3>
      </div>

      {/* ── Note ─────────────────────────────────── */}
      <div>
        <SectionLabel icon={CalendarDays}>รายละเอียด</SectionLabel>
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="เช่น โทรติดตามลูกค้า, ส่งใบเสนอราคา..."
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30 focus:border-[#0066FF]/50 transition-all"
          autoFocus
        />
      </div>

      {/* ── Date & Time ──────────────────────────── */}
      <div>
        <SectionLabel icon={Clock}>วันที่และเวลา</SectionLabel>
        <div className="flex flex-wrap gap-2 mb-3">
          {DATE_OPTIONS.map(opt => (
            <Chip
              key={opt.value}
              active={dateOption === opt.value}
              onClick={() => setDateOption(opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
        </div>

        {dateOption === 'custom' && (
          <div className="flex gap-3 mt-1">
            <input
              type="date"
              value={customDate}
              onChange={e => setCustomDate(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30 focus:border-[#0066FF]/50 transition-all"
            />
            <input
              type="time"
              value={customTime}
              onChange={e => setCustomTime(e.target.value)}
              className="w-32 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30 focus:border-[#0066FF]/50 transition-all"
            />
          </div>
        )}

        {dateOption !== 'custom' && (
          <p className="text-xs text-gray-400 mt-1">
            {computeDate(dateOption).format('DD/MM/YYYY')} เวลา 09:00 น.
          </p>
        )}
      </div>

      {/* ── Reminder ─────────────────────────────── */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <SectionLabel icon={Bell}>การแจ้งเตือน</SectionLabel>
          <Toggle checked={reminderEnabled} onChange={setReminderEnabled} label="" />
        </div>

        {reminderEnabled && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <Select
              value={reminderOption}
              onChange={setReminderOption}
              options={REMINDER_OPTIONS}
            />

            {reminderOption === 'custom' && (
              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-500 shrink-0">เตือนล่วงหน้า</span>
                <input
                  type="number"
                  min={1}
                  value={customReminderValue}
                  onChange={e => setCustomReminderValue(Math.max(1, Number(e.target.value)))}
                  className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30 focus:border-[#0066FF]/50 text-center transition-all"
                />
                <Select
                  value={customReminderUnit}
                  onChange={v => setCustomReminderUnit(Number(v))}
                  options={REMINDER_UNIT_OPTIONS}
                  className="w-28"
                />
              </div>
            )}

            
          </div>
        )}
      </div>

      {/* ── Repeat ───────────────────────────────── */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <SectionLabel icon={Repeat}>การทำซ้ำ</SectionLabel>
          <Toggle checked={repeatEnabled} onChange={setRepeatEnabled} label="" />
        </div>

        {repeatEnabled && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-wrap gap-2">
              {REPEAT_OPTIONS.map(opt => (
                <Chip
                  key={opt.value}
                  active={repeatType === opt.value}
                  onClick={() => setRepeatType(opt.value)}
                >
                  {opt.label}
                </Chip>
              ))}
            </div>

            {repeatType === 'custom' && (
              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-500 shrink-0">ทำซ้ำทุกๆ</span>
                <input
                  type="number"
                  min={1}
                  value={repeatInterval}
                  onChange={e => setRepeatInterval(Math.max(1, Number(e.target.value)))}
                  className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30 focus:border-[#0066FF]/50 text-center transition-all"
                />
                <Select
                  value={repeatFrequency}
                  onChange={setRepeatFrequency}
                  options={FREQ_OPTIONS}
                  className="w-28"
                />
              </div>
            )}

            {/* End Repeat */}
            <div className="pt-2 border-t border-gray-200/80">
              <p className="text-xs font-medium text-gray-600 mb-2">สิ้นสุดการทำซ้ำ</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="endRepeat"
                    checked={repeatEndType === 'never'}
                    onChange={() => setRepeatEndType('never')}
                    className="accent-[#0066FF]"
                  />
                  <span className="text-xs text-gray-600">ไม่มีสิ้นสุด</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer shrink-0">
                    <input
                      type="radio"
                      name="endRepeat"
                      checked={repeatEndType === 'on_date'}
                      onChange={() => setRepeatEndType('on_date')}
                      className="accent-[#0066FF]"
                    />
                    <span className="text-xs text-gray-600">สิ้นสุดในวันที่</span>
                  </label>
                  {repeatEndType === 'on_date' && (
                    <input
                      type="date"
                      value={repeatEndDate}
                      onChange={e => setRepeatEndDate(e.target.value)}
                      className="w-40 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30 focus:border-[#0066FF]/50 transition-all"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Actions ──────────────────────────────── */}
      <div className="flex justify-end gap-3 pt-2">
        {showCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-blue-50 hover:text-[#0066FF] hover:border-blue-200 transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
        )}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0066FF] text-white text-sm font-medium hover:bg-[#0052cc] transition-colors shadow-sm shadow-blue-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEdit ? 'บันทึก' : 'บันทึก'}
        </button>
      </div>
    </form>
  );
};

export default FollowUpForm;
