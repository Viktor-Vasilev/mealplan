
import React, { useState, useEffect, useCallback } from 'react';
import { Meal, Selection, DailyMenu, ActivityLog, AppMode } from './types';
import Header from './components/Header';
import MenuUploader from './components/MenuUploader';
import SelectionForm from './components/SelectionForm';
import StatsDashboard from './components/StatsDashboard';
import ActivityLogs from './components/ActivityLogs';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.COLLEAGUE);
  const [menu, setMenu] = useState<DailyMenu | null>(null);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Initialize data from localStorage
  useEffect(() => {
    const savedMenu = localStorage.getItem('meal_tracker_menu');
    const savedSelections = localStorage.getItem('meal_tracker_selections');
    const savedLogs = localStorage.getItem('meal_tracker_logs');

    if (savedMenu) setMenu(JSON.parse(savedMenu));
    if (savedSelections) setSelections(JSON.parse(savedSelections));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('meal_tracker_menu', JSON.stringify(menu));
    localStorage.setItem('meal_tracker_selections', JSON.stringify(selections));
    localStorage.setItem('meal_tracker_logs', JSON.stringify(logs));
  }, [menu, selections, logs]);

  const addLog = (message: string, type: ActivityLog['type'], user: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      message,
      type,
      user,
      timestamp: Date.now()
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  const handleMenuUpload = (meals: Meal[]) => {
    const newMenu: DailyMenu = {
      id: `menu-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      meals,
      uploadedAt: Date.now()
    };
    setMenu(newMenu);
    setSelections([]); // Clear old selections for the new menu
    addLog(`Uploaded a new menu with ${meals.length} items.`, 'UPLOAD', 'Admin');
  };

  const handleSelection = (userName: string, mealIds: string[]) => {
    const newSelection: Selection = {
      id: `sel-${Date.now()}`,
      userName,
      mealIds,
      timestamp: Date.now()
    };
    setSelections(prev => [...prev, newSelection]);
    addLog(`${userName} selected 4 meals.`, 'SELECTION', userName);
  };

  const clearAllData = () => {
    if (window.confirm("Are you sure you want to clear all current selections and menu?")) {
      setMenu(null);
      setSelections([]);
      addLog("Cleared all data.", 'DELETE', 'Admin');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header mode={mode} setMode={setMode} />
      
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {mode === AppMode.ADMIN ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-upload text-orange-500"></i>
                  Menu Management
                </h2>
                <MenuUploader onUpload={handleMenuUpload} />
                {menu && (
                  <button 
                    onClick={clearAllData}
                    className="mt-4 text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <i className="fas fa-trash-alt"></i> Clear All Current Data
                  </button>
                )}
              </section>

              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-history text-blue-500"></i>
                  Activity Logs
                </h2>
                <ActivityLogs logs={logs} />
              </section>
            </div>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <i className="fas fa-chart-pie text-green-500"></i>
                Selection Summary
              </h2>
              <StatsDashboard menu={menu} selections={selections} />
            </section>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Choose Your 4 Meals</h2>
                <p className="text-slate-500">Select exactly 4 items for your daily meal pack.</p>
                {menu && (
                  <div className="mt-2 text-sm bg-orange-50 text-orange-700 px-3 py-1 rounded-full inline-block">
                    Current Menu: {menu.date}
                  </div>
                )}
              </div>
              
              {!menu ? (
                <div className="text-center py-12 text-slate-400">
                  <i className="fas fa-utensils text-4xl mb-4 block"></i>
                  <p>No menu uploaded yet for today. Please wait for the admin.</p>
                </div>
              ) : (
                <SelectionForm menu={menu} onSelect={handleSelection} />
              )}
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold mb-4 text-slate-700">Today's Trending Meals</h2>
                <StatsDashboard menu={menu} selections={selections} mini />
            </section>
          </div>
        )}
      </main>

      {/* Footer / Mobile Nav */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-slate-200 py-3 px-6 flex justify-around items-center md:hidden">
         <button onClick={() => setMode(AppMode.COLLEAGUE)} className={`flex flex-col items-center ${mode === AppMode.COLLEAGUE ? 'text-orange-500' : 'text-slate-400'}`}>
            <i className="fas fa-utensils"></i>
            <span className="text-xs">Order</span>
         </button>
         <button onClick={() => setMode(AppMode.ADMIN)} className={`flex flex-col items-center ${mode === AppMode.ADMIN ? 'text-orange-500' : 'text-slate-400'}`}>
            <i className="fas fa-user-shield"></i>
            <span className="text-xs">Admin</span>
         </button>
      </footer>
    </div>
  );
};

export default App;
