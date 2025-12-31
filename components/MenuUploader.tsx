
import React, { useState } from 'react';
import { Meal } from '../types';
import { parseMenuWithGemini } from '../services/geminiService';

interface MenuUploaderProps {
  onUpload: (meals: Meal[]) => void;
}

const MenuUploader: React.FC<MenuUploaderProps> = ({ onUpload }) => {
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const processMenu = async () => {
    setLoading(true);
    try {
      let result: Meal[] = [];
      if (file) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
        });
        reader.readAsDataURL(file);
        const base64 = await base64Promise;
        result = await parseMenuWithGemini({ data: base64, mimeType: file.type });
      } else if (inputText.trim()) {
        result = await parseMenuWithGemini(inputText);
      } else {
        alert("Please provide some text or an image of the menu.");
        setLoading(false);
        return;
      }

      if (result.length > 0) {
        onUpload(result);
        setInputText('');
        setFile(null);
      } else {
        alert("Could not extract any meals. Try clearer input.");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing menu. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Paste Menu Text</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g. 1. Grilled Chicken, 2. Salad, 3. Pasta..."
          className="w-full h-24 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none transition-all"
        />
      </div>

      <div className="relative">
        <div className="flex items-center justify-center w-full">
          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${file ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:bg-slate-50'}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <i className={`fas ${file ? 'fa-check-circle text-orange-500' : 'fa-cloud-upload-alt text-slate-400'} text-3xl mb-2`}></i>
              <p className="text-sm text-slate-500">
                {file ? file.name : <><span className="font-semibold">Click to upload</span> menu image</>}
              </p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      <button
        onClick={processMenu}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-all shadow-md active:transform active:scale-95"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <i className="fas fa-circle-notch fa-spin"></i> Analyzing with Gemini...
          </span>
        ) : "Process & Publish Menu"}
      </button>
    </div>
  );
};

export default MenuUploader;
