import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Briefcase, 
  MapPin, 
  Search, 
  BookmarkPlus, 
  BookmarkMinus,
  CheckCircle2, 
  AlertCircle,
  FileText,
  Activity,
  ArrowLeft,
  Calendar,
  Globe,
  Sparkles
} from 'lucide-react';
import { jobsApi, aiApi } from '../lib/api';

const Jobs = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'saved'
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [remoteFilter, setRemoteFilter] = useState('');
  const [employmentFilter, setEmploymentFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobMatch, setJobMatch] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        location: locationFilter,
        remote_type: remoteFilter,
        employment_type: employmentFilter,
        source: sourceFilter,
        limit: 50
      };
      const res = await jobsApi.getJobs(params);
      setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await jobsApi.getSavedJobs();
      setSavedJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const viewJobDetails = async (job) => {
    setSelectedJob(job);
    setAiInsight(null);
    setAiError(null);
    try {
      setLoadingMatch(true);
      const res = await jobsApi.getJobMatch(job.id);
      setJobMatch(res.data);
    } catch (err) {
      console.error(err);
      setJobMatch(null);
    } finally {
      setLoadingMatch(false);
    }
  };

  const generateInsight = async () => {
    if (!selectedJob) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await aiApi.getJobInsight(selectedJob.id);
      setAiInsight(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 503) {
        setAiError("AI service is not configured. Add AI_API_KEY to the backend environment to enable AI features.");
      } else {
        setAiError("AI insights are currently unavailable.");
      }
    } finally {
      setAiLoading(false);
    }
  };

  const toggleSaveJob = async (jobId, isSaved) => {
    try {
      if (isSaved) {
        await jobsApi.unsaveJob(jobId);
      } else {
        await jobsApi.saveJob(jobId);
      }
      await fetchSavedJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(sj => sj.id === jobId);
  };

  if (selectedJob) {
    const isSaved = isJobSaved(selectedJob.id);
    
    // Compute whether there are any actual missing elements
    let hasMissing = false;
    if (jobMatch) {
      hasMissing = (
        (jobMatch.missingSkills?.length > 0) ||
        (jobMatch.missingLanguages?.length > 0) ||
        (jobMatch.missingFrameworks?.length > 0) ||
        (jobMatch.missingDatabases?.length > 0) ||
        (jobMatch.missingTools?.length > 0)
      );
    }
    
    return (
      <div className="space-y-6">
        <button 
          onClick={() => { setSelectedJob(null); setJobMatch(null); setAiInsight(null); setAiError(null); }}
          className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} /> Back to jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-primary mb-2">{selectedJob.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
                      <span className="flex items-center gap-1 font-medium text-primary"><Briefcase size={16} /> {selectedJob.company}</span>
                      <span className="flex items-center gap-1"><MapPin size={16} /> {selectedJob.location || 'Location varies'}</span>
                      <span className="flex items-center gap-1"><Globe size={16} /> {selectedJob.remote_type}</span>
                    </div>
                  </div>
                  <Button 
                    variant={isSaved ? "secondary" : "primary"}
                    onClick={() => toggleSaveJob(selectedJob.id, isSaved)}
                    icon={isSaved ? <BookmarkMinus size={16} /> : <BookmarkPlus size={16} />}
                  >
                    {isSaved ? 'Unsave Job' : 'Save Job'}
                  </Button>
                </div>
                
                <div className="prose prose-sm dark:prose-invert max-w-none text-secondary">
                  <p>{selectedJob.description}</p>
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Requirements</h3>
                  
                  {selectedJob.skills?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-secondary mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map(s => <span key={s} className="px-2.5 py-1 text-xs font-medium bg-surfaceHover border border-border rounded-md text-primary">{s}</span>)}
                      </div>
                    </div>
                  )}
                  {selectedJob.programming_languages?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-secondary mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.programming_languages.map(s => <span key={s} className="px-2.5 py-1 text-xs font-medium bg-surfaceHover border border-border rounded-md text-primary">{s}</span>)}
                      </div>
                    </div>
                  )}
                  {selectedJob.frameworks?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-secondary mb-2">Frameworks</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.frameworks.map(s => <span key={s} className="px-2.5 py-1 text-xs font-medium bg-surfaceHover border border-border rounded-md text-primary">{s}</span>)}
                      </div>
                    </div>
                  )}
                  {selectedJob.databases?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-secondary mb-2">Databases</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.databases.map(s => <span key={s} className="px-2.5 py-1 text-xs font-medium bg-surfaceHover border border-border rounded-md text-primary">{s}</span>)}
                      </div>
                    </div>
                  )}
                  {selectedJob.tools?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-secondary mb-2">Tools</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.tools.map(s => <span key={s} className="px-2.5 py-1 text-xs font-medium bg-surfaceHover border border-border rounded-md text-primary">{s}</span>)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                  <span className="text-xs text-secondary flex items-center gap-1">
                    <Calendar size={14} /> Posted: {new Date(selectedJob.posted_at).toLocaleDateString()}
                  </span>
                  <a href={selectedJob.apply_url} target="_blank" rel="noreferrer">
                    <Button variant="primary">Apply Externally</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={18} className="text-accent" />
                  Profile Match
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingMatch ? (
                  <div className="text-center p-6 text-sm text-secondary">Analyzing profile match...</div>
                ) : jobMatch ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                      <span className="text-sm font-medium">Match Score</span>
                      <span className={`text-2xl font-bold ${jobMatch.score > 75 ? 'text-green-500' : jobMatch.score > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {jobMatch.score}%
                      </span>
                    </div>

                    {!jobMatch.profileCoverage.resume && (
                      <p className="text-xs text-warning bg-warning/10 p-2 rounded border border-warning/20">
                        Resume missing. Upload your resume for a better match score.
                      </p>
                    )}

                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-primary">
                        <CheckCircle2 size={16} className="text-green-500" /> Why this matches
                      </h4>
                      <ul className="space-y-2 text-sm text-secondary">
                        {jobMatch.matchedSkills?.length > 0 && <li>• Matched Skills: {jobMatch.matchedSkills.join(', ')}</li>}
                        {jobMatch.matchedLanguages?.length > 0 && <li>• Matched Languages: {jobMatch.matchedLanguages.join(', ')}</li>}
                        {jobMatch.matchedFrameworks?.length > 0 && <li>• Matched Frameworks: {jobMatch.matchedFrameworks.join(', ')}</li>}
                        {jobMatch.matchedDatabases?.length > 0 && <li>• Matched Databases: {jobMatch.matchedDatabases.join(', ')}</li>}
                        {jobMatch.matchedTools?.length > 0 && <li>• Matched Tools: {jobMatch.matchedTools.join(', ')}</li>}
                        {jobMatch.dsaEvidence?.solved > 0 && <li>• You have solved {jobMatch.dsaEvidence.solved} DSA problems (Topics: {jobMatch.dsaEvidence.relevantTopics.slice(0,3).join(', ')})</li>}
                        
                        {(jobMatch.score === 100 && jobMatch.matchedSkills.length === 0 && !hasMissing) && 
                          <li>• This job has no specific parsed technical requirements.</li>
                        }
                      </ul>
                    </div>

                    {hasMissing && (
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-primary">
                          <AlertCircle size={16} className="text-red-500" /> What you're missing
                        </h4>
                        <ul className="space-y-2 text-sm text-secondary">
                          {jobMatch.missingSkills?.length > 0 && <li>• Missing Skills: {jobMatch.missingSkills.join(', ')}</li>}
                          {jobMatch.missingLanguages?.length > 0 && <li>• Missing Languages: {jobMatch.missingLanguages.join(', ')}</li>}
                          {jobMatch.missingFrameworks?.length > 0 && <li>• Missing Frameworks: {jobMatch.missingFrameworks.join(', ')}</li>}
                          {jobMatch.missingDatabases?.length > 0 && <li>• Missing Databases: {jobMatch.missingDatabases.join(', ')}</li>}
                          {jobMatch.missingTools?.length > 0 && <li>• Missing Tools: {jobMatch.missingTools.join(', ')}</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-6 text-sm text-secondary">Match data unavailable.</div>
                )}
              </CardContent>
            </Card>

            {/* AI Job Insight */}
            <Card className="border-accent/30 overflow-hidden relative mt-6">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Sparkles size={120} />
              </div>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-accent">
                  <Sparkles size={18} />
                  AI Job Insight
                </CardTitle>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={generateInsight}
                  disabled={aiLoading}
                >
                  {aiLoading ? "Analyzing this role..." : aiInsight ? "Refresh Analysis" : "Explain this match"}
                </Button>
              </CardHeader>
              <CardContent>
                {aiError ? (
                  <div className="flex items-center gap-2 text-warning bg-warning/10 p-4 rounded-md text-sm border border-warning/20">
                    <AlertCircle size={16} />
                    {aiError}
                  </div>
                ) : !aiInsight ? (
                  <div className="text-sm text-secondary py-4">
                    Get an AI-powered explanation of why your profile fits this role and what you can improve.
                  </div>
                ) : (
                  <div className="space-y-6 mt-4 relative z-10">
                    <p className="text-sm text-primary leading-relaxed bg-surface/50 p-4 rounded-lg border border-border">
                      {aiInsight.summary}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-green-500 mb-2 flex items-center gap-2">Why It Fits</h4>
                        <ul className="space-y-1">
                          {aiInsight.whyItFits?.map((item, i) => (
                            <li key={i} className="text-sm text-secondary flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">•</span> <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-500 mb-2 flex items-center gap-2">What to Improve</h4>
                        <ul className="space-y-1">
                          {aiInsight.whatToImprove?.map((item, i) => (
                            <li key={i} className="text-sm text-secondary flex items-start gap-2">
                              <span className="text-yellow-500 mt-0.5">•</span> <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {aiInsight.interviewFocus?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-primary mb-2">Interview Focus</h4>
                        <div className="flex flex-wrap gap-2">
                          {aiInsight.interviewFocus.map((focus, i) => (
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
          </div>
        </div>
      </div>
    );
  }

  const currentJobsList = activeTab === 'all' ? jobs : savedJobs;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Job Intelligence</h1>
        <p className="text-secondary">Explore opportunities and understand how they align with your developer profile.</p>
      </div>

      <div className="flex gap-4 border-b border-border">
        <button 
          onClick={() => setActiveTab('all')} 
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all' ? 'border-accent text-accent' : 'border-transparent text-secondary hover:text-primary'}`}
        >
          All Jobs
        </button>
        <button 
          onClick={() => setActiveTab('saved')} 
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'saved' ? 'border-accent text-accent' : 'border-transparent text-secondary hover:text-primary'}`}
        >
          Saved Jobs
        </button>
      </div>

      {activeTab === 'all' && (
        <Card className="p-4 bg-surface/30">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input 
                  type="text" 
                  placeholder="Search jobs, roles, or companies..." 
                  className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-accent"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-48">
                <input 
                  type="text" 
                  placeholder="Location" 
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-accent"
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-48">
                <select 
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-accent"
                  value={remoteFilter}
                  onChange={e => setRemoteFilter(e.target.value)}
                >
                  <option value="">Any Remote Type</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
              <div className="w-full sm:w-48">
                <select 
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-accent"
                  value={employmentFilter}
                  onChange={e => setEmploymentFilter(e.target.value)}
                >
                  <option value="">Any Employment</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="w-full sm:w-48">
                <select 
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-accent"
                  value={sourceFilter}
                  onChange={e => setSourceFilter(e.target.value)}
                >
                  <option value="">Any Source</option>
                  <option value="DevSignal Seed">DevSignal Seed</option>
                </select>
              </div>
              <Button type="submit" variant="primary">Search</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-secondary">Loading jobs...</div>
      ) : currentJobsList.length === 0 ? (
        <div className="text-center py-16 border border-border rounded-lg bg-surface/30">
          <Briefcase size={48} className="text-secondary mb-4 opacity-50 mx-auto" />
          <h2 className="text-xl font-semibold mb-2">{activeTab === 'all' ? 'No jobs found.' : 'No saved jobs yet.'}</h2>
          <p className="text-secondary text-sm">Adjust your filters or try a different search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentJobsList.map(job => {
            const isSaved = isJobSaved(job.id);
            return (
              <Card key={job.id} className="hover:border-accent/40 transition-colors cursor-pointer" onClick={() => viewJobDetails(job)}>
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-primary">{job.title}</h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id, isSaved); }}
                      className={`p-1.5 rounded-md transition-colors ${isSaved ? 'text-accent bg-accent/10' : 'text-secondary hover:text-primary hover:bg-surfaceHover'}`}
                    >
                      {isSaved ? <BookmarkMinus size={16} /> : <BookmarkPlus size={16} />}
                    </button>
                  </div>
                  
                  <div className="text-sm text-secondary mb-4">
                    <div className="flex items-center gap-1.5 mb-1"><Briefcase size={14} /> {job.company}</div>
                    <div className="flex items-center gap-1.5 mb-1"><MapPin size={14} /> {job.location || 'Location varies'} • {job.remote_type}</div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.skills?.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-surface border border-border rounded text-xs text-primary">{skill}</span>
                      ))}
                      {job.skills?.length > 3 && <span className="px-2 py-0.5 bg-surface border border-border rounded text-xs text-secondary">+{job.skills.length - 3}</span>}
                    </div>
                    <div className="text-xs text-secondary flex justify-between items-center">
                      <span>{job.employment_type}</span>
                      <span>{new Date(job.posted_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default Jobs;
