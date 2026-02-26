import React, { useState } from 'react';
import { 
  X, MessageSquare, CalendarCheck, DollarSign, FileText, Info, 
  MoreVertical, ChevronRight, ChevronLeft, Calendar as CalendarIcon, 
  Phone, Mail, Plus, Trash2, Edit2, CheckCircle2, Circle
} from 'lucide-react';

const App = () => {
  // ---------------- STATE MANAGEMENT ----------------
  // viewMode: 'list' (หน้ารายการ) หรือ 'form' (หน้าสร้าง/แก้ไข)
  const [viewMode, setViewMode] = useState('list');
  
  // mock data รายการติดตาม
  const [followUps, setFollowUps] = useState([
    {
      id: 1,
      note: 'โทรสอบถามความคืบหน้าเรื่องใบเสนอราคา',
      date: 'ศุกร์ 20 ก.พ. 2026',
      time: '10:00',
      status: 'pending'
    }
  ]);

  // ฟอร์ม State (สำหรับหน้าสร้างเหมือนในรูป)
  const [formNote, setFormNote] = useState('testttBB');
  const [activeDateTab, setActiveDateTab] = useState('tomorrow');

  // ---------------- HANDLERS ----------------
  const handleSave = () => {
    // จำลองการบันทึก
    const newFollowUp = {
      id: Date.now(),
      note: formNote || 'การติดตามใหม่',
      date: 'เสาร์ 21 ก.พ. 2026', // Mock วันที่จากฟอร์ม
      time: '09:00',
      status: 'pending'
    };
    setFollowUps([...followUps, newFollowUp]);
    setViewMode('list'); // บันทึกเสร็จกลับไปหน้ารายการ
  };

  const handleDelete = (id) => {
    setFollowUps(followUps.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-500/50 flex items-center justify-center p-4 font-sans text-sm">
      
      {/* --- MAIN MODAL CONTAINER --- */}
      <div className="bg-white w-[1200px] h-[800px] rounded-lg shadow-2xl flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h2 className="text-gray-700 font-semibold">ข้อมูลของ Lead</h2>
          <div className="flex items-center text-gray-500 text-xs">
            <span>ข้อมูล ณ วันที่ 20 ก.พ.</span>
            <button className="ml-4 hover:text-gray-800"><X size={18} /></button>
          </div>
        </div>

        {/* LEAD INFO BAR */}
        <div className="flex px-6 py-4 border-b border-gray-100 bg-white items-center text-xs">
          <div className="flex items-center w-64 border-r border-gray-200">
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center mr-3 text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
            </div>
            <div>
              <div className="text-gray-400 mb-1">ชื่อ Lead</div>
              <div className="font-semibold text-gray-800 text-sm">test</div>
            </div>
          </div>
          
          <div className="px-6 border-r border-gray-200 w-48">
            <div className="text-gray-400 mb-1">แหล่งที่มา</div>
            <div className="text-gray-800">Inbound Phone Calls</div>
          </div>
          
          <div className="px-6 border-r border-gray-200 w-32">
            <div className="text-gray-400 mb-1">อายุ Lead</div>
            <div className="text-gray-800">5 ชม.</div>
          </div>

          <div className="px-6 border-r border-gray-200 w-40">
            <div className="text-gray-400 mb-1">มูลค่า Lead</div>
            <div className="text-gray-800">0.00 THB</div>
          </div>

          <div className="px-6 flex-1 flex justify-between items-center">
             <div>
                <div className="text-gray-400 mb-1">ดูแลโดย</div>
                <div className="flex items-center text-gray-800">
                  <div className="w-4 h-4 rounded-full bg-purple-600 mr-2"></div>
                  Nattawut Phakdee
                </div>
             </div>
             <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
          </div>
        </div>

        {/* PIPELINE STEPPER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white relative">
          <button className="flex items-center px-4 py-1.5 rounded-full border border-gray-300 text-gray-400 text-xs">
            <ChevronLeft size={14} className="mr-1"/> ย้อนกลับ
          </button>
          
          <div className="flex-1 flex items-center justify-center px-10 relative">
            <div className="absolute top-1/2 left-20 right-20 h-[1px] bg-gray-200 -z-10"></div>
            
            <div className="flex flex-col items-center mx-8 bg-white px-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#4A14E2] text-[#4A14E2] flex items-center justify-center font-bold text-sm bg-white mb-1">1</div>
              <span className="text-[#4A14E2] text-xs font-medium">ใหม่</span>
            </div>
            
            <div className="flex flex-col items-center mx-8 bg-white px-2">
              <div className="w-8 h-8 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center text-sm bg-white mb-1">2</div>
              <span className="text-gray-400 text-xs">นำเสนอ</span>
            </div>

            <div className="flex flex-col items-center mx-8 bg-white px-2">
              <div className="w-8 h-8 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center text-sm bg-white mb-1">3</div>
              <span className="text-gray-400 text-xs">ต่อรอง</span>
            </div>

            <div className="flex flex-col items-center mx-8 bg-white px-2">
              <div className="w-8 h-8 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center text-sm bg-white mb-1 relative">
                4
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white">
                  <Plus size={10} />
                </div>
              </div>
              <span className="text-gray-400 text-xs">ปิดการขาย</span>
            </div>
          </div>

          <button className="flex items-center px-4 py-1.5 rounded-full border border-[#4A14E2] text-[#4A14E2] text-xs">
            ถัดไป <ChevronRight size={14} className="ml-1"/>
          </button>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex flex-1 overflow-hidden bg-white">
          
          {/* LEFT SIDEBAR (ICONS) */}
          <div className="w-16 border-r border-gray-200 flex flex-col items-center py-4 gap-6 text-gray-400">
             <MessageSquare size={22} className="cursor-pointer hover:text-gray-600" />
             <div className="relative cursor-pointer">
                <CalendarCheck size={22} className="text-[#4A14E2]" />
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-[9px] font-bold px-1 rounded">ON</span>
             </div>
             <DollarSign size={22} className="cursor-pointer hover:text-gray-600" />
             <FileText size={22} className="cursor-pointer hover:text-gray-600" />
             <Info size={22} className="cursor-pointer hover:text-gray-600" />
          </div>

          {/* CENTER CONTENT (THE FOLLOW UP SECTION) */}
          <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            
            {/* VIEW MODE: LIST (UI แบบใหม่สำหรับรองรับหลายรายการ) */}
            {viewMode === 'list' && (
              <div className="max-w-3xl mx-auto w-full">
                <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">การติดตามทั้งหมด</h3>
                    <p className="text-xs text-gray-500 mt-1">จัดการนัดหมายและตารางการติดตามลูกค้ารายนี้</p>
                  </div>
                  <button 
                    onClick={() => setViewMode('form')}
                    className="flex items-center px-4 py-2 bg-[#4A14E2] text-white rounded-md hover:bg-[#3b0eb8] transition-colors text-sm"
                  >
                    <Plus size={16} className="mr-2"/> สร้าง
                  </button>
                </div>

                <div className="space-y-4">
                  {followUps.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                      <CalendarIcon className="mx-auto mb-3 text-gray-400" size={32} />
                      <p>ยังไม่มีการติดตาม</p>
                    </div>
                  ) : (
                    followUps.map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex items-start gap-4 hover:shadow-md transition-shadow bg-white">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <CalendarIcon size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-800 text-base">{item.note}</h4>
                            <div className="flex items-center gap-2">
                               <button className="text-gray-400 hover:text-blue-600" onClick={() => setViewMode('form')}><Edit2 size={16}/></button>
                               <button className="text-gray-400 hover:text-red-500" onClick={() => handleDelete(item.id)}><Trash2 size={16}/></button>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center"><CalendarIcon size={14} className="mr-1"/> {item.date}</span>
                            <span className="flex items-center text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-xs border border-orange-100">รอแจ้งเตือนเวลา {item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}


            {/* VIEW MODE: FORM (UI ดั้งเดิม 100% ตามรูปภาพ) */}
            {viewMode === 'form' && (
              <div className="max-w-4xl mx-auto w-full bg-white rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800">การติดตาม</h3>
                  <button 
                    onClick={() => setViewMode('list')}
                    className="text-red-500 hover:underline text-sm"
                  >
                    ยกเลิกการติดตาม (กลับ)
                  </button>
                </div>

                <div className="border-b border-dashed border-gray-300 pb-2 mb-6">
                  <input 
                    type="text" 
                    value={formNote}
                    onChange={(e) => setFormNote(e.target.value)}
                    className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
                    placeholder="รายละเอียดการติดตาม..."
                  />
                </div>

                <div className="flex gap-6 mb-6">
                  {/* ปุ่มเลือกวันซ้ายมือ */}
                  <div className="w-[35%] flex flex-col gap-3">
                    <button 
                      onClick={() => setActiveDateTab('tomorrow')}
                      className={`py-2.5 rounded-full border ${activeDateTab === 'tomorrow' ? 'bg-[#4A14E2] text-white border-[#4A14E2]' : 'border-[#4A14E2] text-[#4A14E2] bg-white'}`}
                    >
                      วันพรุ่งนี้
                    </button>
                    <button 
                      onClick={() => setActiveDateTab('3days')}
                      className={`py-2.5 rounded-full border ${activeDateTab === '3days' ? 'bg-[#4A14E2] text-white border-[#4A14E2]' : 'border-[#4A14E2] text-[#4A14E2] bg-white'}`}
                    >
                      3 วันถัดไป
                    </button>
                    <button 
                      onClick={() => setActiveDateTab('nextweek')}
                      className={`py-2.5 rounded-full border ${activeDateTab === 'nextweek' ? 'bg-[#4A14E2] text-white border-[#4A14E2]' : 'border-[#4A14E2] text-[#4A14E2] bg-white'}`}
                    >
                      สัปดาห์ถัดไป
                    </button>
                    <button 
                      onClick={() => setActiveDateTab('custom')}
                      className={`py-2.5 rounded-full border ${activeDateTab === 'custom' ? 'bg-[#4A14E2] text-white border-[#4A14E2]' : 'border-[#4A14E2] text-[#4A14E2] bg-white'}`}
                    >
                      กำหนดเอง
                    </button>
                  </div>

                  {/* กล่องแสดงวันที่ขวามือ */}
                  <div className="flex-1 bg-gray-50 rounded-xl flex flex-col items-center justify-center py-12 border border-gray-100">
                    <div className="text-gray-400 text-lg mb-2">เสาร์</div>
                    <div className="text-gray-500 text-4xl font-light">21 ก.พ. 2026</div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-[#00A18A] rounded flex items-center justify-center mr-2">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                    <span className="text-gray-700 mr-2 text-sm">แจ้งเตือน</span>
                    <select className="border-b border-gray-300 focus:outline-none text-gray-700 text-sm bg-transparent pb-1">
                      <option>ล่วงหน้า 10 นาที</option>
                      <option>ล่วงหน้า 30 นาที</option>
                      <option>ล่วงหน้า 1 ชั่วโมง</option>
                    </select>
                  </div>

                  <button 
                    onClick={handleSave}
                    className={`px-8 py-2 rounded-md font-medium ${formNote ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-100 text-gray-400'}`}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR (WIDGETS) */}
          <div className="w-[300px] bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto hidden lg:block">
            
            {/* Widget 1: Lead Score */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="text-gray-500 text-xs mb-3">Lead Score</div>
              <div className="flex flex-col items-center justify-center py-2">
                <div className="w-16 h-16 bg-blue-100/50 flex items-center justify-center relative mb-2" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                  <span className="text-[#4A14E2] text-xl font-bold">0</span>
                </div>
                <a href="#" className="text-[#4A14E2] text-xs hover:underline">ดูรายละเอียด</a>
              </div>
            </div>

            {/* Widget 2: Contact Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 relative">
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-500 text-xs">ผู้ติดต่อ</div>
                <MoreVertical size={14} className="text-gray-400 cursor-pointer" />
              </div>
              <div className="font-semibold text-gray-800 text-sm">test test</div>
              <div className="text-gray-400 text-xs mb-3">test</div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center text-[#4A14E2] text-xs">
                  <Phone size={12} className="mr-2" /> 098-878-9877
                </div>
                <div className="flex items-start text-[#4A14E2] text-xs break-all">
                  <Mail size={12} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>anis.yayo@ext.readyplanet.com</span>
                </div>
              </div>
              <div className="flex items-center text-gray-400 text-xs cursor-pointer border-t border-gray-100 pt-2 mt-2">
                <ChevronRight size={14} className="mr-1 rotate-90"/> เพิ่มเติม
              </div>
            </div>

            {/* Widget 3: Customer Registration */}
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

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;