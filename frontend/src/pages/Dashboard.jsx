import React, { useEffect, useState } from 'react';
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
  Trophy
} from 'lucide-react';
import GithubBrandIcon from '../components/ui/GithubBrandIcon';
import CircularProgress from '../components/ui/CircularProgress';
import SkillChart from '../components/ui/SkillChart';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const MetricMiniCard = ({ title, value, icon: Icon }) => (
  <Card className="flex flex-col">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-secondary font-medium uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl font-bold mt-1 tracking-tight">{value}</h4>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
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
        <MetricMiniCard title="GitHub Impact" value="N/A" icon={GithubBrandIcon} />
        <MetricMiniCard title="DSA Mastery" value="N/A" icon={Code2} />
        <MetricMiniCard title="Resume Match" value="N/A" icon={FileText} />
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
