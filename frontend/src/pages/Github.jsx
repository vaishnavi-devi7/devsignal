import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { 
  BookOpen, 
  Star, 
  Users, 
  GitCommit, 
  Activity, 
  BrainCircuit, 
  AlertTriangle,
  Link2,
  Clock,
  RefreshCw,
  LogOut
} from 'lucide-react';
import GithubBrandIcon from '../components/ui/GithubBrandIcon';
import { githubApi } from '../lib/api';

const MetricCard = ({ title, value, icon: Icon }) => (
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

const Github = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ connected: false });
  const [overview, setOverview] = useState(null);
  const [repos, setRepos] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const fetchData = async () => {
    try {
      const statusRes = await githubApi.getStatus();
      setStatus(statusRes.data);
      
      if (statusRes.data.connected) {
        const [overviewRes, repoRes] = await Promise.all([
          githubApi.getOverview(),
          githubApi.getRepositories()
        ]);
        setOverview(overviewRes.data);
        setRepos(repoRes.data.repositories || []);
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConnect = async () => {
    try {
      const authRes = await githubApi.auth();
      window.location.href = authRes.data.url;
    } catch (error) {
      console.error('Failed to get auth URL', error);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await githubApi.sync();
      await fetchData();
    } catch (error) {
      console.error('Sync failed', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await githubApi.disconnect();
      setStatus({ connected: false });
      setOverview(null);
      setRepos([]);
    } catch (error) {
      console.error('Disconnect failed', error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12">Loading GitHub intelligence...</div>;
  }

  if (!status.connected) {
    return (
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-surface border border-border rounded-full flex items-center justify-center text-primary mb-4">
          <GithubBrandIcon size={40} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-center">GitHub Intelligence</h1>
        <p className="text-secondary text-center max-w-md">
          Connect your GitHub account to analyze your repositories, track your engineering impact, and uncover insights into your coding habits.
        </p>
        <Button variant="primary" onClick={handleConnect} className="h-12 px-8 rounded-full">
          Connect GitHub Account
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">GitHub Intelligence</h1>
          <p className="text-secondary flex items-center gap-2">
            Connected as <span className="font-semibold text-primary">{status.username}</span>
            {status.lastSynced && (
              <span className="text-xs ml-2 opacity-70">
                Last synced: {new Date(status.lastSynced).toLocaleString()}
              </span>
            )}
          </p>
        </div>
        
        {/* Actions Section */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button 
            variant="secondary" 
            onClick={handleSync} 
            isLoading={isSyncing}
            className="h-10 whitespace-nowrap bg-surface/50 hover:bg-surface border-border/50"
            icon={<RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />}
          >
            Sync Data
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleDisconnect} 
            isLoading={isDisconnecting}
            className="h-10 whitespace-nowrap bg-surface/50 hover:bg-danger/20 hover:text-danger hover:border-danger/30 border-border/50 transition-colors"
            icon={<LogOut size={16} />}
          >
            Disconnect
          </Button>
        </div>
      </div>

      {/* 4 Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Repositories" value={overview?.repositoryCount || 0} icon={BookOpen} />
        <MetricCard title="Total Stars" value={overview?.totalStars || 0} icon={Star} />
        <MetricCard title="Total Forks" value={overview?.totalForks || 0} icon={Activity} />
        <MetricCard title="Open Issues" value={overview?.totalOpenIssues || 0} icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Repository Quality */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={18} className="text-secondary" />
              Repositories
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
                    <th className="px-6 py-3 font-medium">Forks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {repos.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-6 text-secondary">No repositories found.</td></tr>
                  ) : (
                    repos.map((repo, i) => (
                      <tr key={i} className="hover:bg-surfaceHover/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-primary flex items-center gap-2">
                          <GithubBrandIcon size={14} className="text-secondary" />
                          <a href={repo.url} target="_blank" rel="noreferrer" className="hover:underline">{repo.name}</a>
                          {repo.isPrivate && <span className="text-[10px] bg-surface border border-border px-1.5 rounded uppercase ml-2 text-secondary">Private</span>}
                        </td>
                        <td className="px-6 py-4 text-secondary">{repo.language || 'Unknown'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-secondary">
                            <Star size={14} className="text-yellow-500" />
                            <span>{repo.stars}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-secondary">
                          <div className="flex items-center gap-1">
                            <Activity size={14} />
                            <span>{repo.forks}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
              <div className="space-y-4">
                {overview?.languages?.length > 0 ? (
                  overview.languages.slice(0, 5).map((lang, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{lang.language}</span>
                      <span className="text-xs text-secondary">{lang.count} repos</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-secondary">No language data available.</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit size={18} className="text-accent" />
                Engineering Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-secondary">
                Connect additional data sources and solve DSA problems to generate AI insights.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Github;
