
import React from 'react';
import { ActivityLog } from '../types';

interface ActivityLogsProps {
  logs: ActivityLog[];
}

const ActivityLogs: React.FC<ActivityLogsProps> = ({ logs }) => {
  if (logs.length === 0) {
    return <div className="text-slate-400 text-center py-8 italic">No recent activity</div>;
  }

  const getIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'UPLOAD': return <i className="fas fa-file-import text-orange-500"></i>;
      case 'SELECTION': return <i className="fas fa-check-circle text-green-500"></i>;
      case 'DELETE': return <i className="fas fa-trash text-red-500"></i>;
      default: return <i className="fas fa-info-circle text-blue-500"></i>;
    }
  };

  const getTimeString = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {logs.map((log) => (
        <div key={log.id} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border-l-2 border-transparent hover:border-orange-200">
          <div className="mt-1 flex-shrink-0">
            {getIcon(log.type)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm text-slate-700 leading-tight">
              <span className="font-bold">{log.user}:</span> {log.message}
            </p>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {getTimeString(log.timestamp)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityLogs;
