import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { 
  Code2, 
  Target, 
  Flame, 
  History,
  CheckCircle2,
  BrainCircuit,
  Plus,
  Trash2,
  Edit2,
  Search,
  FilterX
} from 'lucide-react';
import { dsaApi } from '../lib/api';

const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass = "text-primary" }) => (
  <Card className="flex flex-col">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-secondary font-medium uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl font-bold mt-1 tracking-tight">{value}</h4>
        {subtitle && <p className="text-xs text-secondary mt-1">{subtitle}</p>}
      </div>
      <div className={`w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center ${colorClass}`}>
        <Icon size={18} />
      </div>
    </CardContent>
  </Card>
);

const DsaModal = ({ isOpen, onClose, onSave, editingProblem }) => {
  const [formData, setFormData] = useState({
    title: '',
    platform: 'LeetCode',
    problemUrl: '',
    difficulty: 'Easy',
    topic: 'Array',
    status: 'Solved',
    language: 'JavaScript',
    solvedAt: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (editingProblem) {
      setFormData({
        title: editingProblem.title,
        platform: editingProblem.platform,
        problemUrl: editingProblem.problem_url || '',
        difficulty: editingProblem.difficulty,
        topic: editingProblem.topic || '',
        status: editingProblem.status,
        language: editingProblem.language || '',
        solvedAt: editingProblem.solved_at ? new Date(editingProblem.solved_at).toISOString().split('T')[0] : '',
        notes: editingProblem.notes || ''
      });
    } else {
      setFormData({
        title: '',
        platform: 'LeetCode',
        problemUrl: '',
        difficulty: 'Easy',
        topic: 'Array',
        status: 'Solved',
        language: 'JavaScript',
        solvedAt: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [editingProblem, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-accent/20">
        <CardHeader>
          <CardTitle>{editingProblem ? 'Edit Problem' : 'Add Problem'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
            <div>
              <label className="text-sm font-medium mb-1 block">Title *</label>
              <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Two Sum" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Platform *</label>
                <select required className="w-full bg-background border border-border rounded-md h-10 px-3 text-sm focus:outline-none focus:border-accent" value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})}>
                  <option>LeetCode</option>
                  <option>HackerRank</option>
                  <option>Codeforces</option>
                  <option>CodeSignal</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Difficulty *</label>
                <select required className="w-full bg-background border border-border rounded-md h-10 px-3 text-sm focus:outline-none focus:border-accent" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Topic</label>
                <Input value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} placeholder="e.g. Array, Graph" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Language</label>
                <Input value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} placeholder="e.g. Python, C++" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Status *</label>
                <select required className="w-full bg-background border border-border rounded-md h-10 px-3 text-sm focus:outline-none focus:border-accent" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option>Solved</option>
                  <option>Attempted</option>
                  <option>Unsolved</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Solved Date</label>
                <Input type="date" value={formData.solvedAt} onChange={e => setFormData({...formData, solvedAt: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Problem URL</label>
              <Input type="url" value={formData.problemUrl} onChange={e => setFormData({...formData, problemUrl: e.target.value})} placeholder="https://..." />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-border mt-2">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary">Save Problem</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const DSA = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [topics, setTopics] = useState([]);
  
  const [problems, setProblems] = useState([]);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);

  const fetchStatsAndTopics = async () => {
    try {
      const [statsRes, topicsRes] = await Promise.all([
        dsaApi.getStats(),
        dsaApi.getTopics()
      ]);
      setStats(statsRes.data);
      setTopics(topicsRes.data.topics);
    } catch (error) {
      console.error('Failed to fetch stats/topics', error);
    }
  };

  const fetchProblems = async () => {
    try {
      const queryParams = { search: searchTerm, limit: 50 };
      if (filterDifficulty) queryParams.difficulty = filterDifficulty;
      if (filterTopic) queryParams.topic = filterTopic;
      if (filterPlatform) queryParams.platform = filterPlatform;
      if (filterStatus) queryParams.status = filterStatus;

      const probsRes = await dsaApi.getProblems(queryParams);
      setProblems(probsRes.data.problems);
    } catch (error) {
      console.error('Failed to fetch problems', error);
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    await fetchStatsAndTopics();
    await fetchProblems();
    setLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []); // Initial load only

  useEffect(() => {
    // When filters change, only refetch problems
    if (!loading) {
      fetchProblems();
    }
  }, [searchTerm, filterDifficulty, filterTopic, filterPlatform, filterStatus]);

  const handleSaveProblem = async (data) => {
    try {
      // Data cleanup
      const payload = {
        ...data,
        solvedAt: data.status === 'Solved' ? data.solvedAt || null : null
      };

      if (editingProblem) {
        await dsaApi.updateProblem(editingProblem.id, payload);
      } else {
        await dsaApi.createProblem(payload);
      }
      setIsModalOpen(false);
      setEditingProblem(null);
      await fetchStatsAndTopics();
      await fetchProblems();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving problem');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await dsaApi.deleteProblem(id);
        await fetchStatsAndTopics();
        await fetchProblems();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterDifficulty('');
    setFilterTopic('');
    setFilterPlatform('');
    setFilterStatus('');
  };

  if (loading && !stats) {
    return <div className="p-12 text-center">Loading DSA Intelligence...</div>;
  }

  const hasData = stats && (stats.totalSolved > 0 || stats.totalAttempted > 0);
  const isFiltered = searchTerm || filterDifficulty || filterTopic || filterPlatform || filterStatus;

  // Intelligence derivation
  let intelligenceText = "Start solving problems to generate DSA insights.";
  if (hasData) {
    if (topics.length > 0) {
      const topTopic = topics[0].topic;
      intelligenceText = `${topTopic} is currently your most practiced topic.`;
    }
    
    if (stats.hard < (stats.easy + stats.medium) / 4 && stats.totalSolved > 10) {
      intelligenceText = "Your current problem mix contains fewer Hard problems than Easy and Medium.";
    }
    
    if (stats.currentStreak > 0) {
      intelligenceText += ` You're currently on a ${stats.currentStreak}-day solving streak!`;
    }
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">DSA Intelligence</h1>
          <p className="text-secondary">See where your problem-solving skills stand.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => { setEditingProblem(null); setIsModalOpen(true); }}
          icon={<Plus size={16} />}
        >
          Add Problem
        </Button>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-16 border border-border rounded-lg bg-surface/30">
          <Code2 size={48} className="text-secondary mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">No DSA problems tracked yet.</h2>
          <p className="text-secondary text-sm mb-6 text-center max-w-md">Record your first problem to start building your statistics, tracking your streaks, and unlocking developer intelligence.</p>
          <Button variant="primary" onClick={() => { setEditingProblem(null); setIsModalOpen(true); }} icon={<Plus size={16} />}>
            Add Problem
          </Button>
        </div>
      ) : (
        <>
          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard title="Total Solved" value={stats.totalSolved} icon={Code2} />
            <MetricCard title="Easy" value={stats.easy} icon={Target} colorClass="text-green-500" />
            <MetricCard title="Medium" value={stats.medium} icon={Target} colorClass="text-yellow-500" />
            <MetricCard title="Hard" value={stats.hard} icon={Target} colorClass="text-red-500" />
            <MetricCard title="Current Streak" value={stats.currentStreak} subtitle={`Longest: ${stats.longestStreak}`} icon={Flame} colorClass="text-orange-500" />
          </div>

          {/* AI Recommendation */}
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="p-4 bg-background rounded-full border border-border">
                <BrainCircuit size={24} className="text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-primary mb-1">DSA Insights</h3>
                <p className="text-sm text-secondary">
                  {intelligenceText}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Topic Performance */}
            <Card className="lg:col-span-1 flex flex-col">
              <CardHeader>
                <CardTitle>Topic Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto max-h-[300px]">
                <div className="space-y-4">
                  {topics.map((t, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t.topic}</span>
                      <div className="flex gap-3 text-xs">
                        <span className="text-success">{t.solved} solved</span>
                        {t.attempted > 0 && <span className="text-warning">{t.attempted} att</span>}
                      </div>
                    </div>
                  ))}
                  {topics.length === 0 && <span className="text-secondary text-sm">No topic data available.</span>}
                </div>
              </CardContent>
            </Card>

            {/* Recent Problems Table */}
            <Card className="lg:col-span-2 flex flex-col">
              <CardHeader className="flex flex-col gap-4 border-b border-border/50 pb-4">
                <div className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <History size={18} className="text-secondary" />
                    Problem List
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {isFiltered && (
                      <button 
                        onClick={handleClearFilters}
                        className="text-xs flex items-center gap-1 text-secondary hover:text-primary transition-colors bg-surface px-2 py-1.5 rounded-md border border-border"
                      >
                        <FilterX size={14} /> Clear
                      </button>
                    )}
                    <div className="relative w-48">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                      <input 
                        type="text" 
                        placeholder="Search titles..." 
                        className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-accent"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Filters Row */}
                <div className="flex flex-wrap gap-3">
                  <select 
                    className="bg-background border border-border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-accent"
                    value={filterDifficulty}
                    onChange={e => setFilterDifficulty(e.target.value)}
                  >
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <select 
                    className="bg-background border border-border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-accent max-w-[140px]"
                    value={filterTopic}
                    onChange={e => setFilterTopic(e.target.value)}
                  >
                    <option value="">All Topics</option>
                    {topics.map(t => (
                      <option key={t.topic} value={t.topic}>{t.topic}</option>
                    ))}
                  </select>

                  <select 
                    className="bg-background border border-border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-accent max-w-[140px]"
                    value={filterPlatform}
                    onChange={e => setFilterPlatform(e.target.value)}
                  >
                    <option value="">All Platforms</option>
                    {stats.platforms?.map(p => (
                      <option key={p.platform} value={p.platform}>{p.platform}</option>
                    ))}
                  </select>

                  <select 
                    className="bg-background border border-border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-accent"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="Solved">Solved</option>
                    <option value="Attempted">Attempted</option>
                    <option value="Unsolved">Unsolved</option>
                  </select>
                </div>
              </CardHeader>

              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-secondary uppercase bg-surface/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 font-medium">Problem</th>
                      <th className="px-6 py-3 font-medium">Difficulty</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {problems.map((prob) => (
                      <tr key={prob.id} className="hover:bg-surfaceHover/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-primary">
                            {prob.problem_url ? (
                              <a href={prob.problem_url} target="_blank" rel="noreferrer" className="hover:underline">{prob.title}</a>
                            ) : prob.title}
                          </div>
                          <div className="text-xs text-secondary mt-0.5">{prob.platform} {prob.topic ? `• ${prob.topic}` : ''}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium px-2 py-1 rounded border ${
                            prob.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            prob.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                            'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                            {prob.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            {prob.status === 'Solved' ? (
                              <><CheckCircle2 size={14} className="text-success" /> <span className="text-success">{prob.status}</span></>
                            ) : (
                              <><div className="w-3.5 h-3.5 rounded-full border-2 border-warning border-t-transparent animate-spin" /> <span className="text-warning">{prob.status}</span></>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-secondary text-xs whitespace-nowrap">
                          {prob.solved_at ? new Date(prob.solved_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 text-secondary">
                            <button onClick={() => { setEditingProblem(prob); setIsModalOpen(true); }} className="hover:text-primary transition-colors p-1 rounded hover:bg-surface"><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete(prob.id)} className="hover:text-danger transition-colors p-1 rounded hover:bg-danger/10"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {problems.length === 0 && (
                      <tr><td colSpan="5" className="text-center py-12 text-secondary">No problems match your filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>

          </div>
        </>
      )}

      <DsaModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingProblem(null); }} 
        onSave={handleSaveProblem}
        editingProblem={editingProblem}
      />
    </div>
  );
};

export default DSA;
