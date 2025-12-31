
import React, { useState } from 'react';
import { DailyMenu, Meal } from '../types';

interface SelectionFormProps {
  menu: DailyMenu;
  onSelect: (userName: string, mealIds: string[]) => void;
}

const SelectionForm: React.FC<SelectionFormProps> = ({ menu, onSelect }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [userName, setUserName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds(prev => [...prev, id]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return alert("Please enter your name.");
    if (selectedIds.length !== 4) return alert("Please select exactly 4 meals.");
    
    onSelect(userName, selectedIds);
    setSubmitted(true);
    // Reset for next potential user on same device or just feedback
    setTimeout(() => {
        setSubmitted(false);
        setUserName('');
        setSelectedIds([]);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="text-center py-12 animate-in fade-in duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-4">
          <i className="fas fa-check text-4xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-slate-800">Order Submitted!</h3>
        <p className="text-slate-500 mt-2">Thanks, {userName}. Your 4 meals are logged.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-6 text-orange-500 font-medium underline underline-offset-4"
        >
          Submit another order
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 block ml-1">Your Name</label>
        <input
          required
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your full name"
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {menu.meals.map((meal) => {
          const isSelected = selectedIds.includes(meal.id);
          const isDisabled = !isSelected && selectedIds.length >= 4;
          
          return (
            <div
              key={meal.id}
              onClick={() => !isDisabled && toggleSelection(meal.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                isSelected 
                  ? 'border-orange-500 bg-orange-50' 
                  : isDisabled 
                    ? 'border-slate-100 opacity-50 cursor-not-allowed bg-slate-50' 
                    : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-orange-500 uppercase block mb-0.5">{meal.category || 'Meal'}</span>
                <p className={`font-semibold ${isSelected ? 'text-orange-900' : 'text-slate-700'}`}>{meal.name}</p>
                {meal.description && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{meal.description}</p>}
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-200'}`}>
                {isSelected && <i className="fas fa-check text-[10px]"></i>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg flex items-center justify-between">
        <div className="text-slate-700">
          <span className={`font-bold ${selectedIds.length === 4 ? 'text-green-600' : 'text-orange-500'}`}>{selectedIds.length}</span> / 4 Selected
        </div>
        <button
          type="submit"
          disabled={selectedIds.length !== 4 || !userName.trim()}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md"
        >
          Submit Selection
        </button>
      </div>
    </form>
  );
};

export default SelectionForm;
