import React, { useState, useEffect } from 'react';
import Dashboard from './components/dashboard/Dashboard';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from '@/components/auth/LoginPage';
import ForgotPasswordPage from '@/components/auth/ForgotPasswordPage';

import ModernSidebar from '@/components/layout/ModernSidebar';
import DemoShowcase from '@/components/demo/DemoShowcase';

// Import existing components
import AddPatient from '@/components/patients/AddPatient';
import PatientList from '@/components/patients/PatientList';
import PatientBiodata from '@/components/patients/PatientBiodata';
import DeletedPatients from '@/components/patients/DeletedPatients';
import PatientAttendance from '@/components/patients/PatientAttendance';
import PatientHistory from '@/components/patients/PatientHistory';
import PatientPaymentFees from '@/components/patients/PatientPaymentFees';
import PatientCallRecord from '@/components/patients/PatientCallRecord';
import PatientMedicalRecord from '@/components/patients/PatientMedicalRecord';

// Test Report Components (commented out if not available)
// import TestReportAmountPage from '@/components/patients/TestReportAmountPage';

// Staff Management Components
import AddStaff from '@/components/management/AddStaff';
import StaffCategory from '@/components/management/StaffCategory';
import StaffManagement from '@/components/management/StaffManagement';
import DeletedStaff from '@/components/management/DeletedStaff';
import AttendanceManagement from '@/components/management/AttendanceManagement';
import SalaryPayment from '@/components/management/SalaryPayment';
import DoctorManagement from '@/components/management/DoctorManagement';
import SupplierManagement from '@/components/management/SupplierManagement';

// Doctor Management Components
import AddDoctor from '@/components/management/AddDoctor';
import DoctorCategory from '@/components/management/DoctorCategory';
import DoctorAttendance from '@/components/management/DoctorAttendance';
import DoctorSalary from '@/components/management/DoctorSalary';
import DoctorAdvance from '@/pages/management/doctor-advance';
import StaffAdvance from '@/pages/management/staff-advance';
import DeletedDoctors from '@/components/management/DeletedDoctors';

// Medicine Management Components
import MedicineManagement from '@/components/management/MedicineManagement';
import CategoryManagement from '@/components/management/CategoryManagement';
import MedicineStock from '@/components/management/MedicineStock';
import MedicineAccounts from '@/components/management/MedicineAccounts';

// Settings Component (commented out if not available)
// import Settings from '@/components/management/Settings';

// Grocery Management Components
import GroceryManagement from '@/components/management/GroceryManagement';
import GroceryCategories from '@/components/management/GroceryCategories';
import GrocerySuppliers from '@/components/management/GrocerySuppliers';
import GroceryStock from '@/components/management/GroceryStock';
import GroceryAccounts from '@/components/management/GroceryAccounts';

// General Purchase Management Components
import GeneralManagement from '@/components/management/GeneralManagement';
import GeneralCategories from '@/components/management/GeneralCategories';
import GeneralSuppliers from '@/components/management/GeneralSuppliers';
import GeneralStock from '@/components/management/GeneralStock';
import GeneralAccounts from '@/components/management/GeneralAccounts';

// Import Leads components
import AddLeadCategory from '@/components/leads/AddLeadCategory';
import LeadsList from '@/components/leads/LeadsList';

// Import User Role Management components
import AddRole from '@/components/management/AddRole';
import RoleManagement from '@/components/management/RoleManagement';

import Administration from '@/components/Administration/Administration';

import { cn } from '@/lib/utils';
import './App.css';

const queryClient = new QueryClient();

function ModernApp() {
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // Enhanced app initialization without hanging on settings
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Gandhi Bai CRM - Initializing...');
        
        // Set basic title immediately
        document.title = 'Gandhi Bai De-Addiction Center CRM';
        
        // Try to load settings with timeout
        const settingsPromise = loadWebsiteSettingsWithTimeout();
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3000));
        
        await Promise.race([settingsPromise, timeoutPromise]);
        
        console.log('✅ App initialization complete');
      } catch (error) {
        console.warn('⚠️ Settings load failed, continuing with defaults:', error);
      } finally {
        setSettingsLoaded(true);
        setAppReady(true);
      }
    };

    initializeApp();
  }, []);

  // Load website settings with timeout and fallback
  const loadWebsiteSettingsWithTimeout = async () => {
    try {
      // Import the settings API dynamically to avoid blocking
      const { loadWebsiteSettings } = await import('@/utils/api');
      await loadWebsiteSettings();
      console.log('✅ Website settings loaded successfully');
    } catch (error) {
      console.warn('⚠️ Failed to load website settings, using defaults:', error);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('healthcare_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Invalid user data in localStorage:', error);
        localStorage.removeItem('healthcare_user');
      }
    } else {
      // Check if the URL is for forgot password
      if (window.location.pathname === '/forgot-password') {
        setShowForgotPassword(true);
        return;
      }
    }
  }, []);

  const handleLogin = (userData: { name: string; role: string; email: string }) => {
    setUser(userData);
    localStorage.setItem('healthcare_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('healthcare_user');
    // Force reload to ensure clean state
    window.location.href = '/';
  };

  // Show loading screen only briefly
  if (!appReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Gandhi Bai CRM</h2>
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          {showForgotPassword ? (
            <ForgotPasswordPage onBack={() => {
              setShowForgotPassword(false);
              window.history.pushState(null, '', '/');
            }} />
          ) : !user ? (
            <LoginPage onLogin={handleLogin} />
          ) : (
            <div className="min-h-screen bg-gray-50">
              <ModernSidebar 
                user={user} 
                onLogout={handleLogout} 
                onCollapsedChange={setSidebarCollapsed}
              />
              <main className={cn(
                "min-h-screen transition-all duration-300",
                "lg:ml-64", // Desktop: margin when expanded
                sidebarCollapsed && "lg:ml-20" // Desktop: margin when collapsed
              )}>
                <div className="w-full">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/demo" element={<DemoShowcase />} />
                    <Route path="/dashboard" element={<Dashboard user={user} />} />
                    <Route path="/home" element={<Dashboard user={user} />} />
                    <Route path="/files" element={<div className="p-6"><h1 className="text-2xl font-bold">Files</h1><p>Files management coming soon...</p></div>} />
                    <Route path="/messages" element={<div className="p-6"><h1 className="text-2xl font-bold">Messages</h1><p>Messages functionality coming soon...</p></div>} />
                    <Route path="/notifications" element={<div className="p-6"><h1 className="text-2xl font-bold">Notifications</h1><p>Notifications center coming soon...</p></div>} />
                    <Route path="/location" element={<div className="p-6"><h1 className="text-2xl font-bold">Location</h1><p>Location services coming soon...</p></div>} />
                    <Route path="/graph" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p>Advanced analytics coming soon...</p></div>} />
                    
                    {/* Patient Management Routes */}
                    <Route path="/patients/add" element={<AddPatient />} />
                    <Route path="/patients/list" element={<PatientList />} />
                    <Route path="/patients/details/:patientId" element={<PatientBiodata />} />
                    <Route path="/patients/test-report-amount" element={<div className="p-6"><h1 className="text-2xl font-bold">Test Report Amount</h1><p>Test report management coming soon...</p></div>} />
                    <Route path="/patients/deleted" element={<DeletedPatients />} />
                    <Route path="/patients/attendance" element={<PatientAttendance />} />
                    <Route path="/patients/medical-records" element={<PatientMedicalRecord />} />
                    <Route path="/patients/history" element={<PatientHistory />} />
                    <Route path="/patients/call-records" element={<PatientCallRecord />} />
                    <Route path="/patients/payment-fees" element={<PatientPaymentFees />} />
                    
                    {/* Staff Management Routes */}
                    <Route path="/management/add-staff" element={<AddStaff />} />
                    <Route path="/management/staff-category" element={<StaffCategory />} />
                    <Route path="/management/staff" element={<StaffManagement />} />
                    <Route path="/management/deleted-staff" element={<DeletedStaff />} />
                    <Route path="/management/attendance" element={<AttendanceManagement />} />
                    <Route path="/management/salary-payment" element={<SalaryPayment />} />
                    <Route path="/management/doctors" element={<DoctorManagement />} />
                    <Route path="/management/suppliers" element={<SupplierManagement />} />
                    <Route path="/management/grocery" element={<GroceryManagement />} />
                    
                    {/* Doctor Management Routes */}
                    <Route path="/management/add-doctor" element={<AddDoctor />} />
                    <Route path="/management/doctor-category" element={<DoctorCategory />} />
                    <Route path="/management/doctor-attendance" element={<DoctorAttendance />} />
                    <Route path="/management/doctor-salary" element={<DoctorSalary />} />
                    <Route path="/management/doctor-advance" element={<DoctorAdvance />} />
                    <Route path="/management/staff-advance" element={<StaffAdvance />} />
                    <Route path="/management/test-report-amount" element={<div className="p-6"><h1 className="text-2xl font-bold">Test Report Amount</h1><p>Test report management coming soon...</p></div>} />
                    <Route path="/management/deleted-doctors" element={<DeletedDoctors />} />
                    
                    {/* User Role Management Routes */}
                    <Route path="/management/user-role/add" element={<AddRole />} />
                    <Route path="/management/user-role/roles" element={<RoleManagement />} />
                    
                    {/* Medicine Management Routes */}
                    <Route path="/medicine/add" element={<MedicineManagement />} />
                    <Route path="/medicine/categories" element={<CategoryManagement />} />
                    <Route path="/medicine/suppliers" element={<SupplierManagement />} />
                    <Route path="/medicine/stock" element={<MedicineStock />} />
                    <Route path="/medicine/accounts" element={<MedicineAccounts />} />
                    
                    {/* Grocery Management Routes */}
                    <Route path="/grocery" element={<GroceryManagement />} />
                    <Route path="/grocery/categories" element={<GroceryCategories />} />
                    <Route path="/grocery/suppliers" element={<GrocerySuppliers />} />
                    <Route path="/grocery/stock" element={<GroceryStock />} />
                    <Route path="/grocery/accounts" element={<GroceryAccounts />} />
                    
                    {/* General Purchase Management Routes */}
                    <Route path="/general/add" element={<GeneralManagement />} />
                    <Route path="/general/categories" element={<GeneralCategories />} />
                    <Route path="/general/suppliers" element={<GeneralSuppliers />} />
                    <Route path="/general/stock" element={<GeneralStock />} />
                    <Route path="/general/accounts" element={<GeneralAccounts />} />
                    
                    {/* Leads Management Routes */}
                    <Route path="/leads/add-category" element={<AddLeadCategory />} />
                    <Route path="/leads/list" element={<LeadsList />} />
                    
                    {/* Settings */}
                    <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Settings management coming soon...</p></div>} />
                    
                    {/* Administration */}
                    <Route path="/administration" element={<Administration />} />
                      
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </div>
              </main>
            </div>
          )}
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default ModernApp;
