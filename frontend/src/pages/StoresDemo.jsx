import React from 'react';
import AppShell from '../components/StoresModule/AppShell';
import GRNForm from '../components/StoresModule/GRNForm';
import IssuanceForm from '../components/StoresModule/IssuanceForm';
import LedgerView from '../components/StoresModule/LedgerView';

// Demo page showcasing all Stores Module components
const StoresDemo = () => {
  return (
    <AppShell>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-4">Ministry of Health Uganda</h1>
          <h2 className="text-2xl font-semibold mb-2">Assets Management - Stores Module</h2>
          <p className="text-blue-100 text-lg">
            Complete ERP solution for inventory management with GRN, Issuance, and Ledger functionality
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">GRN Management</h3>
            <p className="text-gray-600">
              Goods Received Note system with digital signatures, file uploads, and approval workflows.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Issuance System</h3>
            <p className="text-gray-600">
              Requisition and Issue Voucher management with multi-level approval and tracking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Stock Ledger</h3>
            <p className="text-gray-600">
              Real-time stock tracking with color-coded entries and automated balance calculations.
            </p>
          </div>
        </div>

        {/* Component Demos */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Component Demonstrations</h2>
            
            {/* GRN Form Demo */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">GRN Form</h3>
              <GRNForm />
            </div>

            {/* Issuance Form Demo */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Issuance Form</h3>
              <IssuanceForm />
            </div>

            {/* Ledger View Demo */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Stock Ledger</h3>
              <LedgerView itemId="DEMO-001" />
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Frontend Technologies</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• React 18 with Hooks</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Canvas-based signature capture</li>
                <li>• Drag & drop file uploads</li>
                <li>• Responsive design</li>
                <li>• Accessibility compliant</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Backend Integration</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• RESTful API endpoints</li>
                <li>• MySQL database with Prisma ORM</li>
                <li>• Role-based access control</li>
                <li>• File upload handling</li>
                <li>• Digital signature storage</li>
                <li>• Real-time updates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Uganda Flag Colors Showcase */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Uganda Flag Color Scheme</h2>
          <div className="flex space-x-4">
            <div className="flex-1 h-16 bg-black rounded flex items-center justify-center">
              <span className="text-white font-semibold">Black</span>
            </div>
            <div className="flex-1 h-16 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-black font-semibold">Yellow</span>
            </div>
            <div className="flex-1 h-16 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-semibold">Red</span>
            </div>
          </div>
          <p className="text-gray-600 mt-4 text-center">
            The top stripe uses these official Uganda flag colors for national branding
          </p>
        </div>
      </div>
    </AppShell>
  );
};

export default StoresDemo;
