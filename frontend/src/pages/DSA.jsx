import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import DsaTopicChart from '../components/ui/DsaTopicChart';
import WeeklyActivityChart from '../components/ui/WeeklyActivityChart';
import { 
  Code2, 
  Target, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  BrainCircuit, 
  ArrowUpRight,
  TrendingDown,
  Activity,
  History
} from 'lucide-react';

const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass = "text-primary" }) => (
  <Card className="flex flex-col">
    <CardContent className="p-5 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-secondary">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h3 className={`text-2xl font-bold tracking-tighter ${colorClass}`}>{value}</h3>
          {subtitle && <span className="text-xs text-secondary">{subtitle}</span>}
        </div>
      </div>
      <div className="p-2 bg-surfaceHover rounded-md text-secondary">
        <Icon size={20} />
      </div>
    </CardContent>
  </Card>
);

const DSA = () => {
  const recentProblems = [
    { name: 'Longest Palindromic Substring', diff: 'Medium', topic: 'Dynamic Programming', status: 'Solved', date: 'Today' },
    { name: 'Course Schedule II', diff: 'Medium', topic: 'Graphs', status: 'Attempted', date: 'Yesterday' },
    { name: 'Two Sum', diff: 'Easy', topic: 'Arrays', status: 'Solved', date: '2 days ago' },
    { name: 'Merge K Sorted Lists', diff: 'Hard', topic: 'Linked Lists', status: 'Solved', date: '3 days ago' },
    { name: 'Binary Tree Level Order', diff: 'Medium', topic: 'Trees', status: 'Solved', date: '1 week ago' },
  ];

  return (
    <div className="space-y-8 ">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">DSA Intelligence</h1>
        <p className="text-secondary">See where your problem-solving skills stand.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="Total Solved" value="127" icon={Code2} />
        <MetricCard title="Easy" value="82" subtitle="Top 20%" icon={Target} colorClass="text-green-500" />
        <MetricCard title="Medium" value="38" subtitle="Top 45%" icon={Target} colorClass="text-yellow-500" />
        <MetricCard title="Hard" value="7" subtitle="Top 60%" icon={Target} colorClass="text-red-500" />
        <MetricCard title="Current Streak" value="14" subtitle="Days" icon={Flame} colorClass="text-orange-500" />
      </div>

      {/* AI Recommendation */}
      <Card className=" border-accent/20">
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-4 bg-background rounded-full border border-border ">
            <BrainCircuit size={24} className="text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-primary mb-1">Focus on Dynamic Programming next.</h3>
            <p className="text-sm text-secondary">
              Your overall problem-solving speed is excellent, but your success rate drops by 65% when attempting 1D and 2D dynamic programming questions. Mastering memoization patterns will immediately improve your readiness score for tier-1 interviews.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Topics & Strengths Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Topic Performance */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={18} className="text-secondary" />
              Topic performance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pt-2">
            <DsaTopicChart />
          </CardContent>
        </Card>

        {/* Strengths & Weaknesses */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={18} className="text-secondary" />
              Skill assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-6">
            
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-secondary uppercase tracking-wider flex items-center gap-2">
                <ArrowUpRight size={14} className="text-green-500" /> Strong
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Arrays', 'Linked Lists', 'SQL'].map(topic => (
                  <span key={topic} className="px-2.5 py-1 text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20 rounded-md">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-medium text-secondary uppercase tracking-wider flex items-center gap-2">
                <TrendingDown size={14} className="text-red-500" /> Needs Improvement
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Dynamic Programming', 'Graphs', 'Trees'].map(topic => (
                  <span key={topic} className="px-2.5 py-1 text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20 rounded-md">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Recent Problems & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Problems Table */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History size={18} className="text-secondary" />
              Recent problems
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-secondary uppercase bg-surface/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">Problem</th>
                  <th className="px-6 py-3 font-medium">Difficulty</th>
                  <th className="px-6 py-3 font-medium">Topic</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentProblems.map((prob, i) => (
                  <tr key={i} className="hover:bg-surfaceHover/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary">{prob.name}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${
                        prob.diff === 'Easy' ? 'text-green-500' :
                        prob.diff === 'Medium' ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {prob.diff}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-secondary text-xs">{prob.topic}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        {prob.status === 'Solved' ? (
                          <><CheckCircle2 size={14} className="text-success" /> <span className="text-success">{prob.status}</span></>
                        ) : (
                          <><div className="w-3.5 h-3.5 rounded-full border-2 border-warning border-t-transparent animate-spin" /> <span className="text-warning">{prob.status}</span></>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary text-right whitespace-nowrap">{prob.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={18} className="text-secondary" />
              Weekly activity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pt-4">
            <WeeklyActivityChart />
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-primary">15</p>
              <p className="text-xs text-secondary">Problems solved this week</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default DSA;
