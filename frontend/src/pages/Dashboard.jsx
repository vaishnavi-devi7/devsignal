import React, { useEffect, useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { 
  Activity, 
  Code2, 
  FileText 
} from 'lucide-react';
import GithubBrandIcon from '../components/ui/GithubBrandIcon';
import api, { githubApi, dsaApi, resumeApi } from '../lib/api';
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
