import React, { useState } from 'react';
import AppShell from '../components/StoresModule/AppShell';
import GRNForm from '../components/StoresModule/GRNForm';
import IssuanceForm from '../components/StoresModule/IssuanceForm';
import LedgerView from '../components/StoresModule/LedgerView';

// Main Stores Module Page
const StoresModule = () => {
  const [activeTab, setActiveTab] = useState('grn');

  const tabs = [
    { id: 'grn', label: 'GRN', component: GRNForm },
    { id: 'issuance', label: 'Issuance', component: IssuanceForm },
    { id: 'ledger', label: 'Ledger', component: LedgerView }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || GRNForm;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          <ActiveComponent />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total GRNs</h3>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
            <p className="text-2xl font-bold text-yellow-600">8</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Items in Stock</h3>
            <p className="text-2xl font-bold text-green-600">156</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Issuances Today</h3>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default StoresModule;
