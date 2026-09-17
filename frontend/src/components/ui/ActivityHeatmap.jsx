import React from 'react';

const ActivityHeatmap = () => {
  // Generate mock data for 52 weeks x 7 days
  const weeks = 52;
  const days = 7;
  
  // Randomize a little bit but make the recent ones darker
  const boxes = Array.from({ length: weeks * days }).map((_, i) => {
    const isRecent = i > (weeks * days) - 60;
    const rand = Math.random();
    
    let intensity = 0;
    if (rand > 0.8) intensity = 3;
    else if (rand > 0.6) intensity = 2;
    else if (rand > 0.4) intensity = 1;
    
    if (isRecent && rand > 0.3) intensity = Math.min(3, intensity + 1);
    
    return intensity;
  });

  const getColor = (intensity) => {
    switch (intensity) {
      case 3: return 'bg-accent';
      case 2: return 'bg-accent/60';
      case 1: return 'bg-accent/30';
      default: return 'bg-surfaceHover';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: days }).map((_, d) => {
              const intensity = boxes[w * days + d];
              return (
                <div 
                  key={`${w}-${d}`} 
                  className={`w-3 h-3 rounded-sm ${getColor(intensity)} transition-colors hover:ring-1 hover:ring-accent`}
                  title={`${intensity} contributions`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center text-xs text-secondary mt-1">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-surfaceHover" />
          <div className="w-3 h-3 rounded-sm bg-accent/30" />
          <div className="w-3 h-3 rounded-sm bg-accent/60" />
          <div className="w-3 h-3 rounded-sm bg-accent" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
