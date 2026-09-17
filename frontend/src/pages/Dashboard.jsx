import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { 
  Activity, 
  Code2, 
  Briefcase, 
  FileText, 
  AlertCircle, 
  ArrowRight,
  GitCommit,
  CheckCircle2,
  Terminal,
  Trophy,
} from 'lucide-react';
import GithubBrandIcon from '../components/ui/GithubBrandIcon';
import CircularProgress from '../components/ui/CircularProgress';
import SkillChart from '../components/ui/SkillChart';

const MetricMiniCard = ({ title, value, icon: Icon }) => (
  <div className="flex flex-col p-4 rounded-lg bg-surface/50 border border-border transition-colors hover:bg-surfaceHover">
    <div className="flex items-center gap-2 text-secondary mb-2">
      <Icon size={16} />
      <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
    </div>
    <div className="text-3xl font-bold tracking-tighter text-primary">{value}</div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8 ">
      
      {/* Greeting Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Good morning, Alex.</h1>
        <p className="text-secondary">Here's your developer profile at a glance.</p>
      </div>

      {/* Row 1: Hero Metrics */}
      <Card className=" border-border/50 ">
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border/50">
          
          {/* Readiness Score */}
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className=""></div>
            <h2 className="text-sm font-medium text-secondary mb-6 tracking-wide uppercase">Developer Readiness</h2>
            <CircularProgress value={84} max={100} size={160} label="out of 100" />
            <p className="text-sm text-secondary mt-6 max-w-xs">
              You are in the top <strong className="text-primary font-medium">12%</strong> of applicants for Mid-level Software Engineering roles.
            </p>
          </div>

          {/* 4 Key Metrics */}
          <div className="flex-[1.5] p-8 bg-surface/10">
            <div className="grid grid-cols-2 gap-4 h-full">
              <MetricMiniCard title="GitHub" value="82" icon={GithubBrandIcon} />
              <MetricMiniCard title="DSA" value="76" icon={Code2} />
              <MetricMiniCard title="Projects" value="91" icon={Briefcase} />
              <MetricMiniCard title="Resume" value="79" icon={FileText} />
            </div>
          </div>
        </div>
      </Card>

      {/* Row 2: Weaknesses & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Next Steps */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={18} className="text-accent" />
              Recommended next steps
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-md bg-surface/50 border border-border group hover:border-accent/30 transition-colors cursor-pointer">
                <div className="mt-0.5 bg-accent/10 p-1.5 rounded text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Solve 5 Dynamic Programming problems</h4>
                  <p className="text-xs text-secondary mt-1">Your recent contest performance showed a gap in 1D DP optimization.</p>
                </div>
                <ArrowRight size={16} className="text-secondary group-hover:text-primary" />
              </div>

              <div className="flex items-start gap-4 p-4 rounded-md bg-surface/50 border border-border group hover:border-accent/30 transition-colors cursor-pointer">
                <div className="mt-0.5 bg-accent/10 p-1.5 rounded text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Improve AWS deployment knowledge</h4>
                  <p className="text-xs text-secondary mt-1">Add a CI/CD pipeline to your primary full-stack project.</p>
                </div>
                <ArrowRight size={16} className="text-secondary group-hover:text-primary" />
              </div>

              <div className="flex items-start gap-4 p-4 rounded-md bg-surface/50 border border-border group hover:border-accent/30 transition-colors cursor-pointer">
                <div className="mt-0.5 bg-accent/10 p-1.5 rounded text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Add testing to your latest project</h4>
                  <p className="text-xs text-secondary mt-1">Your resume lacks explicit mention of Jest or unit testing experience.</p>
                </div>
                <ArrowRight size={16} className="text-secondary group-hover:text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Areas to improve */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle size={18} className="text-warning" />
              Areas to improve
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-3">
            {[
              { name: 'Dynamic Programming', severity: 'High Priority' },
              { name: 'System Design', severity: 'Medium Priority' },
              { name: 'Cloud Deployment', severity: 'Medium Priority' }
            ].map((area) => (
              <div key={area.name} className="flex flex-col p-3 rounded bg-surface/30 border border-border">
                <span className="text-sm font-medium">{area.name}</span>
                <span className="text-xs text-secondary mt-1">{area.severity}</span>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>

      {/* Row 3: Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Skill Distribution */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal size={18} className="text-secondary" />
              Skill distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <SkillChart />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={18} className="text-secondary" />
              Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-5">
              {[
                { action: 'Pushed 12 commits', target: 'devsignal-web', time: '2 hours ago', icon: GitCommit },
                { action: 'Solved 2 Mediums', target: 'LeetCode', time: 'Yesterday', icon: Code2 },
                { action: 'Updated Resume', target: 'ATS Parser', time: '3 days ago', icon: FileText },
                { action: 'Merged PR #42', target: 'devsignal-api', time: '4 days ago', icon: GithubBrandIcon },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-0.5 relative">
                    <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-secondary z-10 relative">
                      <activity.icon size={14} />
                    </div>
                    {i !== 3 && <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-8 bg-border"></div>}
                  </div>
                  <div className="flex-1 pt-1.5 pb-3">
                    <p className="text-sm font-medium">{activity.action} <span className="text-secondary font-normal">to {activity.target}</span></p>
                    <p className="text-xs text-secondary mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profile Strength */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy size={18} className="text-secondary" />
              Profile strength
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Overall Completion</span>
                <span className="text-accent font-medium">92%</span>
              </div>
              <div className="w-full h-2 bg-surfaceHover rounded-full overflow-hidden">
                <div className="w-[92%] h-full bg-accent rounded-full" />
              </div>
            </div>
            
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-success" />
                <span className="text-sm text-secondary">GitHub Account Linked</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-success" />
                <span className="text-sm text-secondary">LeetCode Synced</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-success" />
                <span className="text-sm text-secondary">Resume Uploaded</span>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-4 h-4 rounded-full border border-secondary" />
                <span className="text-sm text-secondary">Complete Mock Interview</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
