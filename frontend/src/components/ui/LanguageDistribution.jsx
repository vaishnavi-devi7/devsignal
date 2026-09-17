import React from 'react';

const LanguageDistribution = () => {
  const languages = [
    { name: 'JavaScript', percentage: 54, color: 'bg-yellow-400' },
    { name: 'TypeScript', percentage: 28, color: 'bg-blue-500' },
    { name: 'Python', percentage: 12, color: 'bg-green-500' },
    { name: 'HTML/CSS', percentage: 6, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-4">
      {/* Progress Bar Container */}
      <div className="h-2 w-full rounded-full flex overflow-hidden bg-surfaceHover">
        {languages.map((lang) => (
          <div 
            key={lang.name} 
            className={`h-full ${lang.color}`} 
            style={{ width: `${lang.percentage}%` }}
          />
        ))}
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${lang.color}`} />
              <span className="text-secondary">{lang.name}</span>
            </div>
            <span className="font-medium text-primary">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageDistribution;
