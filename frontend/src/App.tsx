import { useState } from 'react';
import { RoutesTab } from './adapters/ui/RoutesTab';
import { CompareTab } from './adapters/ui/CompareTab';
import { BankingTab } from './adapters/ui/BankingTab';
import { PoolingTab } from './adapters/ui/PoolingTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<'routes' | 'compare' | 'banking' | 'pooling'>('routes');

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 font-sans selection:bg-brand-500/30">
      {/* Premium Header */}
      <header className="bg-dark-800/80 backdrop-blur-md border-b border-dark-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Fuel<span className="text-brand-400">EU</span> Maritime
              </h1>
            </div>

            <nav className="hidden md:flex space-x-1">
              {[
                { id: 'routes', label: 'Routes Data' },
                { id: 'compare', label: 'Compare Intensity' },
                { id: 'banking', label: 'Article 20 (Banking)' },
                { id: 'pooling', label: 'Article 21 (Pooling)' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab.id
                    ? 'bg-brand-500/10 text-brand-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700/50'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dynamic decorative background elements */}
        <div className="fixed top-20 left-10 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="fixed bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 animate-fade-in">
          {activeTab === 'routes' && <RoutesTab />}
          {activeTab === 'compare' && <CompareTab />}
          {activeTab === 'banking' && <BankingTab />}
          {activeTab === 'pooling' && <PoolingTab />}
        </div>
      </main>
    </div>
  );
}
