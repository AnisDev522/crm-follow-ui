import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from './components/Header';
import LeadInfoBar from './components/LeadInfoBar';
import PipelineStepper from './components/PipelineStepper';
import Sidebar from './components/Sidebar';
import FollowUpList from './components/FollowUpList';
import LeadScore from './components/Widgets/LeadScore';
import ContactInfo from './components/Widgets/ContactInfo';
import CustomerRegistration from './components/Widgets/CustomerRegistration';
import ConfirmModal from './components/ConfirmModal';

const App = () => {
  // ... existing state ...
  const [viewMode, setViewMode] = useState('list');
  const [followUps, setFollowUps] = useState([]);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // ... handlers ...
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
                handleEdit={() => setViewMode('form')}
                toggleStatus={toggleStatus}
                clearAllFollowUps={() => setIsDeleteAllModalOpen(true)}
              />
            ) : (
              <div className="flex-1 bg-white flex flex-col">
                <button 
                  onClick={() => setViewMode('list')}
                  className="flex items-center gap-2 text-[#0066FF] hover:text-[#0052cc] transition-colors font-semibold text-sm mb-4 cursor-pointer w-fit"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                <div className="flex-1" /> {/* Blank area */}
              </div>
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

