import React, { useState } from 'react';
import TopStripe from './TopStripe';

// AppShell with sidebar and header for Stores Module
export const AppShell = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 pt-[42px]"> {/* body padding to avoid stripe overlap */}
      <TopStripe height={12} />
      <header className="fixed top-[12px] left-0 right-0 z-40 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-8xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#111827] flex items-center justify-center text-white font-bold">MoH</div>
            <h1 className="text-lg font-semibold">Ministry of Health — Assets (Stores)</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1 rounded bg-yellow-400 text-black">New GRN</button>
            <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">P</div>
          </div>
        </div>
      </header>

      <div className="pt-[72px] max-w-8xl mx-auto px-4 grid grid-cols-12 gap-4">
        <nav className="col-span-3 md:col-span-2 lg:col-span-2 sticky top-28 self-start">
          <div className="bg-white rounded shadow p-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="mb-2 text-sm text-gray-600"
            >
              {sidebarOpen ? 'Hide' : 'Show'} Menu
            </button>
            {sidebarOpen && (
              <ul className="space-y-2">
                <li className="font-semibold">Dashboard</li>
                <li className="mt-2">Stores</li>
                <li className="ml-3 text-sm">- GRN</li>
                <li className="ml-3 text-sm">- Issuance</li>
                <li className="ml-3 text-sm">- Ledger</li>
                <li className="mt-2">Vehicle</li>
                <li>Finance</li>
                <li>Admin</li>
              </ul>
            )}
          </div>
        </nav>
        <main className="col-span-9 md:col-span-10 lg:col-span-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
