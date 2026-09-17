import React from 'react';

const ProgressBar = ({ value, max = 100, className = '', colorClass = 'bg-accent', showLabel = false }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs text-secondary">
          <span>Progress</span>
          <span className="font-medium text-primary">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-1.5 w-full bg-surfaceHover rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
