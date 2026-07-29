import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import PrintableReceiptModal from './components/PrintableReceiptModal';
import BackupRestoreModal from './components/BackupRestoreModal';

import DashboardView from './views/DashboardView';
import MembersView from './views/MembersView';
import FeeManagementView from './views/FeeManagementView';
import AttendanceView from './views/AttendanceView';
import TrainersView from './views/TrainersView';
import OnlineRegistrationView from './views/OnlineRegistrationView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';

import { authService } from './services/authService';
import { feesService } from './services/feesService';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [lateFeeCount, setLateFeeCount] = useState(0);

  // Cross-view actions state
  const [selectedFeeMemberId, setSelectedFeeMemberId] = useState(null);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [printableReceipt, setPrintableReceipt] = useState(null);

  useEffect(() => {
    // Check existing auth session
    authService.getCurrentUser().then((u) => {
      if (u) setUser(u);
    });

    // Check late fee alerts count
    feesService.getLateFeeAlerts().then((alerts) => {
      setLateFeeCount(alerts.length);
    });
  }, [activeTab]);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  const handleNavigateToFeeForMember = (memberId) => {
    setSelectedFeeMemberId(memberId);
    setActiveTab('fees');
  };

  const handleQuickAddMember = () => {
    setOpenAddMemberModal(true);
    setActiveTab('members');
  };

  const handleQuickCheckIn = () => {
    setActiveTab('attendance');
  };

  return (
    <div className="app-container">
      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Right Main Content Area */}
      <div className="main-content">
        <Navbar
          activeTab={activeTab}
          onOpenAddMember={handleQuickAddMember}
          onOpenCheckIn={handleQuickCheckIn}
          onOpenBackupModal={() => setIsBackupOpen(true)}
          user={user}
          lateFeeAlertCount={lateFeeCount}
          onNavigate={setActiveTab}
        />

        <main className="content-wrapper">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={setActiveTab}
              onRecordPaymentForMember={handleNavigateToFeeForMember}
              onOpenAddMember={handleQuickAddMember}
            />
          )}

          {activeTab === 'members' && (
            <MembersView
              onRecordPayment={handleNavigateToFeeForMember}
              initialAddOpen={openAddMemberModal}
            />
          )}

          {activeTab === 'fees' && (
            <FeeManagementView
              onSelectPrintReceipt={setPrintableReceipt}
              preSelectedMemberId={selectedFeeMemberId}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView />
          )}

          {activeTab === 'trainers' && (
            <TrainersView />
          )}

          {activeTab === 'registrations' && (
            <OnlineRegistrationView
              isAdminView={true}
              onApproveSuccess={() => {
                feesService.getLateFeeAlerts().then((a) => setLateFeeCount(a.length));
              }}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}

          {activeTab === 'public_register' && (
            <OnlineRegistrationView
              isAdminView={false}
            />
          )}
        </main>
      </div>

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(session) => {
          setUser(session);
        }}
      />

      {/* Printable Receipt Modal */}
      <PrintableReceiptModal
        isOpen={Boolean(printableReceipt)}
        onClose={() => setPrintableReceipt(null)}
        receiptData={printableReceipt}
      />

      {/* Backup & Restore Manager Modal */}
      <BackupRestoreModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onDataRestored={() => {
          feesService.getLateFeeAlerts().then((a) => setLateFeeCount(a.length));
          setActiveTab('dashboard');
        }}
      />
    </div>
  );
}
