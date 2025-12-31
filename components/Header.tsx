
import React from 'react';
import { AppMode } from '../types';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ mode, setMode }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-lg text-white">
            <i className="fas fa-bowl-food text-lg"></i>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent hidden sm:block">
            MealLink
          </h1>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setMode(AppMode.COLLEAGUE)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === AppMode.COLLEAGUE
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Colleague
          </button>
          <button
            onClick={() => setMode(AppMode.ADMIN)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === AppMode.ADMIN
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
