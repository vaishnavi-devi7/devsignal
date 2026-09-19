import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  CheckCircle2, 
  Circle,
  Target,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { aiApi } from '../lib/api';

const Roadmap = () => {
  const [tasks, setTasks] = useState({});
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Optionally auto-fetch if we want, or require button click.
    // The spec says: "Connect it to: GET /api/ai/roadmap". 
    // We will let the user trigger it to save costs, similar to Dashboard.
  }, []);

  const generateRoadmap = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiApi.getRoadmap();
      setRoadmapData(res.data);
      // Initialize tasks state based on phases
      const initialTasks = {};
      res.data.phases.forEach((phase, pIdx) => {
        phase.actions.forEach((action, aIdx) => {
          initialTasks[`p${pIdx}-a${aIdx}`] = false;
        });
      });
      setTasks(initialTasks);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 503) {
        setError("AI service is not configured.");
      } else {
        setError("AI insights are currently unavailable.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (id) => {
    setTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalTasks = Object.keys(tasks).length;
  const completedTasks = Object.values(tasks).filter(Boolean).length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-8 ">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">Your Roadmap</h1>
          <p className="text-secondary">A personalized, AI-generated path to becoming a stronger engineer.</p>
        </div>
        <Button onClick={generateRoadmap} disabled={loading} className="gap-2 shrink-0">
          <Sparkles size={16} />
          {loading ? "Building your roadmap..." : roadmapData ? "Refresh Roadmap" : "Generate Roadmap"}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-warning bg-warning/10 p-4 rounded-md text-sm border border-warning/20">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {!roadmapData && !loading && !error && (
        <Card className="border-accent/30 bg-surface/30">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Sparkles size={48} className="text-accent/50 mb-4" />
            <h3 className="text-lg font-medium text-primary">No Roadmap Generated</h3>
            <p className="text-sm text-secondary mt-2 max-w-md">
              Generate a personalized learning roadmap based on your current resume, GitHub activity, and DSA history.
            </p>
          </CardContent>
        </Card>
      )}

      {roadmapData && (
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Timeline */}
          <div className="flex-1">
            <div className="relative pl-6 md:pl-8 border-l border-border/60 space-y-12 pb-8">
              
              {roadmapData.phases.map((phase, index) => {
                const phaseKeys = phase.actions.map((_, aIdx) => `p${index}-a${aIdx}`);
                const isCompleted = phaseKeys.length > 0 && phaseKeys.every(id => tasks[id]);
                const isActive = !isCompleted && phaseKeys.some(id => tasks[id]) || (index === 0 && !isCompleted && completedTasks === 0);
                
                return (
                  <div key={index} className="relative">
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
                        {phase.duration}
                      </span>
                      <h3 className="text-xl font-medium text-primary">{phase.title}</h3>
                      <p className="text-sm text-secondary mt-2">{phase.reason}</p>
                    </div>

                    <div className="flex flex-col gap-2 bg-surface/30 p-1 rounded-lg border border-border/50">
                      {phase.actions.map((action, aIdx) => {
                        const id = `p${index}-a${aIdx}`;
                        return (
                          <button
                            key={id}
                            onClick={() => toggleTask(id)}
                            className={`flex items-start text-left gap-3 w-full p-3 rounded-md transition-all ${
                              tasks[id] 
                                ? 'bg-surface/50 text-secondary' 
                                : 'hover:bg-surfaceHover text-primary'
                            }`}
                          >
                            {tasks[id] ? (
                              <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                            ) : (
                              <Circle size={18} className="text-secondary shrink-0 mt-0.5" />
                            )}
                            <span className={`text-sm leading-snug ${tasks[id] ? 'line-through decoration-secondary/50' : ''}`}>
                              {action}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    
                    {phase.skills?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {phase.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="px-2 py-1 bg-surface border border-border rounded text-xs text-secondary">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar Panel */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-6">
                <div className="flex gap-3 items-start">
                  <Target className="text-accent shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-sm font-medium text-primary">Primary Goal</h4>
                    <p className="text-sm text-secondary mt-1">{roadmapData.goal}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
