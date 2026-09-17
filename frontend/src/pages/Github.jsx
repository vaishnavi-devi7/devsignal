import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ActivityHeatmap from '../components/ui/ActivityHeatmap';
import LanguageDistribution from '../components/ui/LanguageDistribution';
import GithubIcon from '../components/ui/GithubBrandIcon';
import { 
  Star, 
  Users, 
  GitCommit, 
  BookOpen, 
  Activity, 
  BrainCircuit, 
  AlertTriangle,
  Link2,
  Clock
} from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon }) => (
  <Card className="flex flex-col">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-secondary">{title}</p>
          <h3 className="text-3xl font-bold tracking-tighter text-primary mt-2">{value}</h3>
        </div>
        <div className="p-2 bg-surfaceHover rounded-md text-secondary">
          <Icon size={20} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Github = () => {
  const [username, setUsername] = useState('alexdeveloper');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => setIsConnecting(false), 1000);
  };

  const repositories = [
    { name: 'MarketMind AI', lang: 'Python', stars: 84, forks: 12, updated: '2 days ago', activity: 'High' },
    { name: 'Smart Library', lang: 'TypeScript', stars: 45, forks: 8, updated: '1 week ago', activity: 'Medium' },
    { name: 'QueryFlow', lang: 'JavaScript', stars: 32, forks: 4, updated: '2 weeks ago', activity: 'High' },
    { name: 'DevSignal', lang: 'React', stars: 25, forks: 2, updated: '3 days ago', activity: 'Very High' },
  ];

  return (
    <div className="space-y-8 ">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">GitHub Intelligence</h1>
          <p className="text-secondary">Understand how you build.</p>
        </div>
        
        {/* Connect Section */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input 
            placeholder="GitHub Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full md:w-64 h-10"
            icon={GithubIcon}
          />
          <Button 
            variant="primary" 
            onClick={handleConnect} 
            isLoading={isConnecting}
            className="h-10 whitespace-nowrap"
          >
            Connect
          </Button>
        </div>
      </div>

      {/* 4 Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Repositories" value="42" icon={BookOpen} />
        <MetricCard title="Total Stars" value="186" icon={Star} />
        <MetricCard title="Followers" value="73" icon={Users} />
        <MetricCard title="Contributions" value="1,284" icon={GitCommit} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contribution Chart */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={18} className="text-accent" />
              Contribution activity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="w-full">
              <ActivityHeatmap />
            </div>
          </CardContent>
        </Card>

        {/* Engineering Insights */}
        <Card className="flex flex-col bg-surface/30 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <BrainCircuit size={18} />
              Engineering Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <p className="text-sm text-primary">Your strongest language is <span className="font-semibold text-accent">JavaScript</span>.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <p className="text-sm text-primary">You consistently work on <span className="font-semibold text-accent">full-stack projects</span>.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <p className="text-sm text-primary">Your contribution activity has <span className="font-semibold text-accent">increased</span> over the last 3 months.</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Repository Quality */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={18} className="text-secondary" />
              Repository quality
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-secondary uppercase bg-surface/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-medium">Repository</th>
                    <th className="px-6 py-3 font-medium">Language</th>
                    <th className="px-6 py-3 font-medium">Stars</th>
                    <th className="px-6 py-3 font-medium">Activity</th>
                    <th className="px-6 py-3 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {repositories.map((repo, i) => (
                    <tr key={i} className="hover:bg-surfaceHover/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-primary flex items-center gap-2">
                        <GithubIcon size={14} className="text-secondary" />
                        {repo.name}
                      </td>
                      <td className="px-6 py-4 text-secondary">{repo.lang}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-secondary">
                          <Star size={14} className="text-yellow-500" />
                          <span>{repo.stars}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full border ${
                          repo.activity === 'Very High' ? 'bg-accent/10 text-accent border-accent/20' :
                          repo.activity === 'High' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        }`}>
                          {repo.activity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-secondary flex items-center gap-1">
                        <Clock size={12} />
                        {repo.updated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Side Column: Languages & Areas to Improve */}
        <div className="flex flex-col gap-6">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 size={18} className="text-secondary" />
                Language distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LanguageDistribution />
            </CardContent>
          </Card>
          
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-warning" />
                Areas to improve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Open source contribution', 'Testing', 'Documentation'].map((area, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-md bg-surface/50 border border-border">
                    <span className="text-sm font-medium text-primary">{area}</span>
                    <span className="text-xs text-warning bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                      Needs Work
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Github;
