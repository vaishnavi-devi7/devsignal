import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  CheckCircle2, 
  Circle,
  Target,
  Play
} from 'lucide-react';

const Roadmap = () => {
  const [tasks, setTasks] = useState({
    'w1-1': true,
    'w1-2': true,
    'w1-3': true,
    'w2-1': true,
    'w2-2': false,
    'w2-3': false,
    'w3-1': false,
    'w3-2': false,
    'w3-3': false,
  });

  const toggleTask = (id) => {
    setTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalTasks = Object.keys(tasks).length;
  const completedTasks = Object.values(tasks).filter(Boolean).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const roadmapData = [
    {
      week: 'WEEK 1',
      title: 'Dynamic Programming',
      status: 'completed', // completed, active, pending
      items: [
        { id: 'w1-1', label: 'Learn fundamentals' },
        { id: 'w1-2', label: 'Solve 5 problems' },
        { id: 'w1-3', label: 'Review mistakes' },
      ]
    },
    {
      week: 'WEEK 2',
      title: 'System Design',
      status: 'active',
      items: [
        { id: 'w2-1', label: 'REST architecture' },
        { id: 'w2-2', label: 'Caching' },
        { id: 'w2-3', label: 'Database design' },
      ]
    },
    {
      week: 'WEEK 3',
      title: 'Cloud',
      status: 'pending',
      items: [
        { id: 'w3-1', label: 'AWS deployment' },
        { id: 'w3-2', label: 'Docker' },
        { id: 'w3-3', label: 'CI/CD' },
      ]
    }
  ];

  return (
    <div className="space-y-8 ">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Your Roadmap</h1>
        <p className="text-secondary">A personalized path to becoming a stronger engineer.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Timeline */}
        <div className="flex-1">
          <div className="relative pl-6 md:pl-8 border-l border-border/60 space-y-12 pb-8">
            
            {roadmapData.map((phase, index) => {
              const isCompleted = phase.items.every(item => tasks[item.id]);
              const isActive = !isCompleted && phase.items.some(item => tasks[item.id]) || (index === 1 && !isCompleted); // mock logic for visual state
              
              return (
                <div key={phase.week} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[30px] md:-left-[39px] w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center transition-colors ${
                    isCompleted ? 'border-accent' : 
                    isActive ? 'border-accent shadow-[0_0_10px_rgba(0,112,243,0.5)]' : 
                    'border-border'
                  }`}>
                    {isCompleted && <div className="w-1.5 h-1.5 bg-accent rounded-full" />}
                  </div>

                  <div className="flex flex-col mb-4">
                    <span className={`text-xs font-bold tracking-widest uppercase mb-1 ${isActive ? 'text-accent' : 'text-secondary'}`}>
                      {phase.week}
                    </span>
                    <h3 className="text-xl font-medium text-primary">{phase.title}</h3>
                  </div>

                  <div className="flex flex-col gap-2 bg-surface/30 p-1 rounded-lg border border-border/50">
                    {phase.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleTask(item.id)}
                        className={`flex items-center gap-3 w-full p-3 rounded-md transition-all ${
                          tasks[item.id] 
                            ? 'bg-surface/50 text-secondary' 
                            : 'hover:bg-surfaceHover text-primary'
                        }`}
                      >
                        {tasks[item.id] ? (
                          <CheckCircle2 size={18} className="text-accent shrink-0" />
                        ) : (
                          <Circle size={18} className="text-secondary shrink-0" />
                        )}
                        <span className={`text-sm text-left ${tasks[item.id] ? 'line-through decoration-secondary/50' : ''}`}>
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          
          {/* Progress Card */}
          <Card className="bg-surface/30 border-border/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-end mb-3">
                <span className="text-sm font-medium text-secondary">Overall roadmap</span>
                <span className="text-3xl font-bold tracking-tighter text-primary">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-surfaceHover rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recommended Next Step */}
          <Card className="border-accent/20  shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-accent">
                <Target size={18} />
                Recommended next step
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-sm font-medium text-primary">Caching Strategies</h4>
                  <p className="text-xs text-secondary mt-1 leading-relaxed">
                    You've understood REST architecture. Move on to understanding Redis, Memcached, and CDN edge caching to prepare for scalable system design questions.
                  </p>
                </div>
                
                <Button variant="primary" className="w-full justify-center gap-2 h-10 ">
                  <Play size={14} /> Start Module
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Roadmap;
