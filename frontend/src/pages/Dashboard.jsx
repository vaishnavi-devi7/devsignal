import React, { useEffect, useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { 
  Activity, 
  Code2, 
  FileText,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import GithubBrandIcon from '../components/ui/GithubBrandIcon';
import api, { githubApi, dsaApi, resumeApi, aiApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const MetricMiniCard = ({ title, value, icon: Icon, to, subtitle }) => (
  <Card className="flex flex-col h-full hover:border-accent/30 transition-colors">
    <CardContent className="p-4 flex items-center justify-between h-full">
      <div>
        <p className="text-xs text-secondary font-medium uppercase tracking-wider">{title}</p>
        {value === 'Connect' ? (
          <Link to={to} className="mt-2 inline-block">
            <Button variant="secondary" size="sm" className="h-7 text-xs">Connect</Button>
          </Link>
        ) : value === 'Upload' || value === 'Track' ? (
          <Link to={to} className="mt-2 inline-block">
            <Button variant="secondary" size="sm" className="h-7 text-xs">{value === 'Upload' ? 'Upload Resume' : 'Start Tracking'}</Button>
          </Link>
        ) : (
          <>
            <h4 className="text-2xl font-bold mt-1 tracking-tight">{value}</h4>
            {subtitle && <p className="text-xs text-secondary">{subtitle}</p>}
          </>
        )}
      </div>
      <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary">
        <Icon size={18} />
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [githubOverview, setGithubOverview] = useState(null);
  const [dsaStats, setDsaStats] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI State
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardRes, githubRes, dsaRes, resumeRes] = await Promise.all([
          api.get('/dashboard'),
          githubApi.getOverview().catch(() => ({ data: { connected: false } })),
          dsaApi.getStats().catch(() => ({ data: null })),
          resumeApi.getResume().catch(() => ({ data: { resume: null } }))
        ]);
        setData(dashboardRes.data);
        setGithubOverview(githubRes.data);
        setDsaStats(dsaRes.data);
        setResumeData(resumeRes.data.resume);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const generateInsights = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await aiApi.getProfileAnalysis();
      setAiInsights(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 503) {
        setAiError("AI service is not configured.");
      } else {
        setAiError("AI insights are currently unavailable.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12">Loading...</div>;
  }

  const dsaValue = dsaStats && dsaStats.totalSolved > 0 
    ? `${dsaStats.totalSolved} Solved` 
    : dsaStats ? '0 Solved' : 'Track';
    
  const dsaSubtitle = dsaStats && dsaStats.totalSolved > 0 
    ? `${dsaStats.currentStreak} Day Streak` 
    : null;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-sm text-secondary mt-1">Here's your developer readiness overview.</p>
      </div>

      {/* Row 1: Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricMiniCard title="Overall Score" value={data?.profile?.bio ? "Ready" : "Incomplete"} icon={Activity} />
        
        <MetricMiniCard 
          title="GitHub Impact" 
          value={githubOverview?.connected ? `${githubOverview.totalStars} Stars` : "Connect"} 
          icon={GithubBrandIcon}
          to="/github"
        />
        
        <MetricMiniCard 
          title="DSA Mastery" 
          value={dsaValue} 
          subtitle={dsaSubtitle}
          icon={Code2} 
          to="/dsa" 
        />
        
        <MetricMiniCard 
          title="Resume Status" 
          value={resumeData ? "Uploaded" : "Upload"} 
          subtitle={resumeData ? `Updated ${new Date(resumeData.updated_at).toLocaleDateString()}` : null}
          icon={FileText} 
          to="/resume" 
        />
      </div>

      {/* AI Developer Insights */}
      <Card className="border-accent/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Sparkles size={120} />
        </div>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-accent">
            <Sparkles size={18} />
            AI Developer Insights
          </CardTitle>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={generateInsights}
            disabled={aiLoading}
          >
            {aiLoading ? "Generating insights..." : aiInsights ? "Refresh Analysis" : "Generate Insights"}
          </Button>
        </CardHeader>
        <CardContent>
          {aiError ? (
            <div className="flex items-center gap-2 text-warning bg-warning/10 p-4 rounded-md text-sm border border-warning/20">
              <AlertCircle size={16} />
              {aiError}
            </div>
          ) : !aiInsights ? (
            <div className="text-sm text-secondary py-4">
              Generate your developer insights from your current profile to see strengths and skill gaps.
            </div>
          ) : (
            <div className="space-y-6 mt-4 relative z-10">
              <p className="text-sm text-primary leading-relaxed bg-surface/50 p-4 rounded-lg border border-border">
                {aiInsights.summary}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-green-500 mb-2 flex items-center gap-2">Strengths</h4>
                  <ul className="space-y-1">
                    {aiInsights.strengths?.map((str, i) => (
                      <li key={i} className="text-sm text-secondary flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span> <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-yellow-500 mb-2 flex items-center gap-2">Skill Gaps</h4>
                  <ul className="space-y-1">
                    {aiInsights.skillGaps?.map((gap, i) => (
                      <li key={i} className="text-sm text-secondary flex items-start gap-2">
                        <span className="text-yellow-500 mt-0.5">•</span> <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {aiInsights.careerFocus?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-primary mb-2">Career Focus</h4>
                  <div className="flex flex-wrap gap-2">
                    {aiInsights.careerFocus.map((focus, i) => (
                      <span key={i} className="px-2.5 py-1 bg-surface border border-border rounded-md text-xs text-primary">
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile summary */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-secondary">{data?.profile?.bio || 'No bio provided. Update your profile!'}</p>
          <p className="text-sm text-secondary mt-2">Location: {data?.profile?.location || 'Not set'}</p>
        </CardContent>
      </Card>

    </div>
  );
};

export default Dashboard;
