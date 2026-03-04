import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import {
  CalendarDays, Clock, ChevronDown, Check,
  Bell, BellOff, Repeat, RepeatIcon, X, ArrowRight,
  Pencil, Plus, ChevronRight
} from 'lucide-react';

dayjs.locale('th');

// ── Data ────────────────────────────────────────────────────
const QUICK_DATES = [
  { key: 'tomorrow',  label: 'พรุ่งนี้',      days: 1 },
  { key: '3days',     label: '3 วัน',         days: 3 },
  { key: 'nextweek',  label: 'สัปดาห์หน้า',   days: 7 },
];

const REMINDER_PRESETS = [
  { value: '0',    label: 'ตรงเวลา' },
  { value: '5',    label: '5 นาที' },
  { value: '15',   label: '15 นาที' },
  { value: '30',   label: '30 นาที' },
  { value: '60',   label: '1 ชม.' },
  { value: '1440', label: '1 วัน' },
];

const REPEAT_PRESETS = [
  { value: 'daily',   label: 'ทุกวัน' },
  { value: 'weekly',  label: 'ทุกสัปดาห์' },
  { value: 'monthly', label: 'ทุกเดือน' },
];

const FREQ_OPTIONS = [
  { value: 'daily',   label: 'วัน' },
  { value: 'weekly',  label: 'สัปดาห์' },
  { value: 'monthly', label: 'เดือน' },
  { value: 'yearly',  label: 'ปี' },
];

const REMINDER_UNITS = [
  { value: 1,     label: 'นาที' },
  { value: 60,    label: 'ชั่วโมง' },
  { value: 1440,  label: 'วัน' },
  { value: 10080, label: 'สัปดาห์' },
];

// ── Helpers ─────────────────────────────────────────────────
const addDays = (d) => dayjs().add(d, 'day');
const fmtDate = (d) => dayjs(d).format('D MMM YYYY');
const fmtDay  = (d) => dayjs(d).format('dd');

function reverseReminder(minutes) {
  const found = REMINDER_PRESETS.find(p => p.value === String(minutes));
  if (found) return { option: String(minutes), val: 1, unit: 1 };
  for (const u of [...REMINDER_UNITS].reverse()) {
    if (minutes >= u.value && minutes % u.value === 0)
      return { option: 'custom', val: minutes / u.value, unit: u.value };
  }
  return { option: 'custom', val: minutes, unit: 1 };
}

// ── Tiny Components ─────────────────────────────────────────
const Pill = ({ active, children, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-[6px] rounded-full text-[11px] font-medium transition-all cursor-pointer select-none whitespace-nowrap
      ${active
        ? 'bg-[#0066FF] text-white shadow-sm'
        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
      } ${className}`}
  >
    {children}
  </button>
);

const Switch = ({ on, onToggle }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={onToggle}
    className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer shrink-0
      ${on ? 'bg-[#0066FF]' : 'bg-gray-200'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
      ${on ? 'translate-x-4' : ''}`} />
  </button>
);

const MiniSelect = ({ value, onChange, options, className = '' }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="appearance-none w-full rounded-lg bg-white border border-gray-200 pl-2.5 pr-7 py-1.5 text-[11px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0066FF]/30 cursor-pointer"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

// ════════════════════════════════════════════════════════════
// FollowUpForm
// ════════════════════════════════════════════════════════════
const FollowUpForm = ({ editingItem, onSave, onCancel, showCancel = true }) => {
  const isEdit = !!editingItem;

  /* ── state ───────────────────────────────────────────── */
  const [note, setNote]           = useState('');
  const [dateOption, setDateOption] = useState('tomorrow');
  const [customDate, setCustomDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [customTime, setCustomTime] = useState('09:00');

  const [reminderOn, setReminderOn]             = useState(false);
  const [reminderOption, setReminderOption]       = useState('0');
  const [customRemVal, setCustomRemVal]           = useState(1);
  const [customRemUnit, setCustomRemUnit]         = useState(60);

  const [repeatOn, setRepeatOn]                   = useState(false);
  const [repeatType, setRepeatType]               = useState('daily');
  const [repeatInterval, setRepeatInterval]       = useState(1);
  const [repeatFreq, setRepeatFreq]               = useState('daily');
  const [repeatEndType, setRepeatEndType]         = useState('never');
  const [repeatEndDate, setRepeatEndDate]         = useState(dayjs().add(1, 'month').format('YYYY-MM-DD'));

  /* ── hydrate edit ────────────────────────────────────── */
  useEffect(() => {
    if (!editingItem) return;
    setNote(editingItem.note || '');
    setDateOption('custom');
    setCustomDate(editingItem.date || dayjs().format('YYYY-MM-DD'));
    setCustomTime(editingItem.time || '09:00');
    setReminderOn(!!editingItem.reminderEnabled);
    if (editingItem.reminderEnabled) {
      const r = reverseReminder(Number(editingItem.reminderMinutes));
      setReminderOption(r.option);
      setCustomRemVal(r.val);
      setCustomRemUnit(r.unit);
    }
    setRepeatOn(!!editingItem.repeatEnabled);
    if (editingItem.repeatEnabled) {
      setRepeatType(editingItem.repeatType || 'daily');
      setRepeatInterval(editingItem.repeatInterval || 1);
      setRepeatFreq(editingItem.repeatFrequency || 'daily');
      setRepeatEndType(editingItem.repeatEndType || 'never');
      setRepeatEndDate(editingItem.repeatEndDate || dayjs().add(1, 'month').format('YYYY-MM-DD'));
    }
  }, [editingItem]);

  /* ── derived ─────────────────────────────────────────── */
  const resolvedDate = dateOption === 'custom'
    ? customDate
    : addDays(QUICK_DATES.find(q => q.key === dateOption)?.days ?? 1).format('YYYY-MM-DD');
  const resolvedTime = dateOption === 'custom' ? customTime : '09:00';

  const reminderMinutes = (() => {
    if (!reminderOn) return 0;
    if (reminderOption === 'custom') return Number(customRemVal) * Number(customRemUnit);
    return Number(reminderOption);
  })();

  /* ── submit ──────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: isEdit ? editingItem.id : crypto.randomUUID(),
      note: note.trim() || '(ไม่มีชื่อ)',
      date: resolvedDate,
      time: resolvedTime,
      status: isEdit ? editingItem.status : 'pending',
      reminderEnabled: reminderOn,
      reminderMinutes: String(reminderMinutes),
      repeatEnabled: repeatOn,
      repeatType:      repeatOn ? repeatType : null,
      repeatFrequency: repeatOn && repeatType === 'custom' ? repeatFreq : null,
      repeatInterval:  repeatOn ? repeatInterval : null,
      repeatEndType:   repeatOn ? repeatEndType : null,
      repeatEndDate:   repeatOn && repeatEndType === 'on_date' ? repeatEndDate : null,
    });
  };

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto w-full">

      {/* ─── HEADER ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5">

        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-gray-800 leading-tight">
            {isEdit ? 'แก้ไขการติดตาม' : 'สร้างการติดตาม'}
          </h3>
          <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
            {isEdit ? 'แก้ไขรายละเอียดการนัดหมาย' : 'นัดหมายการติดตามลูกค้า'}
          </p>
        </div>

      </div>

      {/* ─── 1. NOTE ────────────────────────────────────── */}
      <div className="mb-4">
        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          รายละเอียด
        </label>
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="เช่น โทรติดตาม, ส่งใบเสนอราคา ..."
          autoFocus
          className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] text-gray-800 placeholder:text-gray-300
            focus:outline-none focus:ring-2 focus:ring-[#0066FF]/15 focus:border-[#0066FF]/40 transition-all"
        />
      </div>

      {/* ─── 2. DATE & TIME ─────────────────────────────── */}
      <div className="mb-4">
        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          วันที่ & เวลา
        </label>

        {/* quick date pills */}
        <div className="flex items-center gap-1.5 mb-2">
          {QUICK_DATES.map(q => (
            <Pill key={q.key} active={dateOption === q.key} onClick={() => setDateOption(q.key)}>
              {q.label}
            </Pill>
          ))}
          <Pill active={dateOption === 'custom'} onClick={() => setDateOption('custom')}>
            กำหนดเอง
          </Pill>
        </div>

        {/* resolved preview OR custom inputs */}
        {dateOption === 'custom' ? (
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <CalendarDays size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 py-2 text-xs text-gray-700
                  focus:outline-none focus:ring-2 focus:ring-[#0066FF]/15 focus:border-[#0066FF]/40 transition-all" />
            </div>
            <div className="w-[120px] relative">
              <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input type="time" value={customTime} onChange={e => setCustomTime(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 py-2 text-xs text-gray-700
                  focus:outline-none focus:ring-2 focus:ring-[#0066FF]/15 focus:border-[#0066FF]/40 transition-all" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-blue-50/60 rounded-lg px-3 py-2">
            <CalendarDays size={14} className="text-[#0066FF] shrink-0" />
            <span className="text-xs text-gray-700 font-medium">
              {fmtDay(resolvedDate)} {fmtDate(resolvedDate)}
            </span>
            <span className="text-gray-300">·</span>
            <Clock size={12} className="text-[#0066FF]" />
            <span className="text-xs text-gray-600">09:00 น.</span>
          </div>
        )}
      </div>

      {/* ─── OPTIONAL SETTINGS ──────────────────────────── */}
      <div className="space-y-2">

        {/* ── 3. REMINDER ──────────────────────────────── */}
        <div className={`rounded-xl border transition-all overflow-hidden
          ${reminderOn ? 'border-[#0066FF]/20 bg-blue-50/20' : 'border-gray-100 bg-white'}`}>

          {/* toggle row */}
          <button type="button"
            onClick={() => setReminderOn(!reminderOn)}
            className="w-full flex items-center justify-between px-3.5 py-3 cursor-pointer group">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors
                ${reminderOn ? 'bg-[#0066FF]/10' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                {reminderOn
                  ? <Bell size={14} className="text-[#0066FF]" />
                  : <BellOff size={14} className="text-gray-400" />}
              </div>
              <div className="text-left">
                <p className="text-[12px] font-semibold text-gray-700 leading-tight">การแจ้งเตือน</p>
                <p className="text-[10px] text-gray-400 leading-tight">
                  {reminderOn
                    ? (reminderOption === 'custom'
                        ? `เตือนก่อน ${customRemVal} ${REMINDER_UNITS.find(u => u.value === customRemUnit)?.label}`
                        : REMINDER_PRESETS.find(r => r.value === reminderOption)?.label ?? 'ตรงเวลา')
                    : 'ปิดอยู่'}
                </p>
              </div>
            </div>
            <Switch on={reminderOn} onToggle={() => setReminderOn(!reminderOn)} />
          </button>

          {/* expanded content */}
          {reminderOn && (
            <div className="px-3.5 pb-3 space-y-2">
              <div className="flex flex-wrap gap-1">
                {REMINDER_PRESETS.map(p => (
                  <Pill key={p.value} active={reminderOption === p.value} onClick={() => setReminderOption(p.value)}>
                    {p.label}
                  </Pill>
                ))}
                <Pill active={reminderOption === 'custom'} onClick={() => setReminderOption('custom')}>
                  กำหนดเอง
                </Pill>
              </div>

              {reminderOption === 'custom' && (
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-100 p-2">
                  <span className="text-[10px] text-gray-500 shrink-0">เตือนก่อน</span>
                  <input type="number" min={1} value={customRemVal}
                    onChange={e => setCustomRemVal(Math.max(1, +e.target.value))}
                    className="w-14 rounded-md border border-gray-200 px-2 py-1 text-[11px] text-center text-gray-700
                      focus:outline-none focus:ring-1 focus:ring-[#0066FF]/30" />
                  <MiniSelect value={customRemUnit} onChange={v => setCustomRemUnit(+v)} options={REMINDER_UNITS} className="w-20" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── 4. REPEAT ────────────────────────────────── */}
        <div className={`rounded-xl border transition-all overflow-hidden
          ${repeatOn ? 'border-[#0066FF]/20 bg-blue-50/20' : 'border-gray-100 bg-white'}`}>

          {/* toggle row */}
          <button type="button"
            onClick={() => setRepeatOn(!repeatOn)}
            className="w-full flex items-center justify-between px-3.5 py-3 cursor-pointer group">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors
                ${repeatOn ? 'bg-[#0066FF]/10' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                <Repeat size={14} className={repeatOn ? 'text-[#0066FF]' : 'text-gray-400'} />
              </div>
              <div className="text-left">
                <p className="text-[12px] font-semibold text-gray-700 leading-tight">การทำซ้ำ</p>
                <p className="text-[10px] text-gray-400 leading-tight">
                  {repeatOn
                    ? (repeatType === 'custom'
                        ? `ทุก ${repeatInterval} ${FREQ_OPTIONS.find(f => f.value === repeatFreq)?.label}`
                        : REPEAT_PRESETS.find(r => r.value === repeatType)?.label)
                    : 'ปิดอยู่'}
                </p>
              </div>
            </div>
            <Switch on={repeatOn} onToggle={() => setRepeatOn(!repeatOn)} />
          </button>

          {/* expanded content */}
          {repeatOn && (
            <div className="px-3.5 pb-3 space-y-3">

              {/* preset pills */}
              <div className="flex flex-wrap gap-1">
                {REPEAT_PRESETS.map(p => (
                  <Pill key={p.value} active={repeatType === p.value} onClick={() => setRepeatType(p.value)}>
                    {p.label}
                  </Pill>
                ))}
                <Pill active={repeatType === 'custom'} onClick={() => setRepeatType('custom')}>
                  กำหนดเอง
                </Pill>
              </div>

              {/* custom interval */}
              {repeatType === 'custom' && (
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-100 p-2">
                  <span className="text-[10px] text-gray-500 shrink-0">ทุกๆ</span>
                  <input type="number" min={1} value={repeatInterval}
                    onChange={e => setRepeatInterval(Math.max(1, +e.target.value))}
                    className="w-14 rounded-md border border-gray-200 px-2 py-1 text-[11px] text-center text-gray-700
                      focus:outline-none focus:ring-1 focus:ring-[#0066FF]/30" />
                  <MiniSelect value={repeatFreq} onChange={setRepeatFreq} options={FREQ_OPTIONS} className="w-20" />
                </div>
              )}

              {/* end condition */}
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-gray-400 shrink-0">สิ้นสุด</span>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="endRepeat" checked={repeatEndType === 'never'}
                    onChange={() => setRepeatEndType('never')}
                    className="accent-[#0066FF] w-3 h-3" />
                  <span className="text-gray-600">ไม่มี</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="endRepeat" checked={repeatEndType === 'on_date'}
                    onChange={() => setRepeatEndType('on_date')}
                    className="accent-[#0066FF] w-3 h-3" />
                  <span className="text-gray-600">วันที่</span>
                </label>

                {repeatEndType === 'on_date' && (
                  <input type="date" value={repeatEndDate} onChange={e => setRepeatEndDate(e.target.value)}
                    className="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-600
                      focus:outline-none focus:ring-1 focus:ring-[#0066FF]/30" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── SUMMARY BAR ───────────────────────────────── */}
      <div className="mt-5 mb-3 flex items-center gap-2 flex-wrap text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <CalendarDays size={11} />
          {fmtDate(resolvedDate)} {resolvedTime} น.
        </span>
        {reminderOn && (
          <>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Bell size={11} />
              {reminderOption === 'custom'
                ? `${customRemVal} ${REMINDER_UNITS.find(u => u.value === customRemUnit)?.label} ก่อน`
                : REMINDER_PRESETS.find(r => r.value === reminderOption)?.label}
            </span>
          </>
        )}
        {repeatOn && (
          <>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Repeat size={11} />
              {repeatType === 'custom'
                ? `ทุก ${repeatInterval} ${FREQ_OPTIONS.find(f => f.value === repeatFreq)?.label}`
                : REPEAT_PRESETS.find(r => r.value === repeatType)?.label}
            </span>
          </>
        )}
      </div>

      {/* ─── ACTIONS ────────────────────────────────────── */}
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-50">
        {showCancel && (
          <button type="button" onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-500
              hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer">
            ยกเลิก
          </button>
        )}
        <button type="submit"
          className="px-8 py-2 rounded-lg bg-[#0066FF] text-white text-[13px] font-semibold
            hover:bg-[#0055dd] active:scale-[0.98] transition-all shadow-sm shadow-blue-200/60 cursor-pointer">
          บันทึก
        </button>
      </div>
    </form>
  );
};

export default FollowUpForm;
