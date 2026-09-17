import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import CircularProgress from '../components/ui/CircularProgress';
import { 
  Briefcase, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  ThumbsUp,
  AlertTriangle,
  ArrowRight,
  BarChart2
} from 'lucide-react';

const Jobs = () => {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState(
`Software Engineer

Requirements:
- React
- Node.js
- JavaScript
- SQL
- AWS
- Data Structures
- REST APIs`
  );

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 1500);
  };

  const matchedSkills = ['React', 'JavaScript', 'Node.js', 'SQL', 'AWS'];
  const missingSkills = ['Docker', 'System Design'];
  const partialSkills = ['Testing'];

  const recommendedActions = [
    'Learn Docker fundamentals',
    'Strengthen system design',
    'Add automated testing to projects'
  ];

  if (!isAnalyzed) {
    return (
      <div className="space-y-8 ">
        <div className="flex flex-col gap-1 text-center max-w-xl mx-auto mt-8">
          <div className="mx-auto bg-accent/10 p-4 rounded-full mb-4">
            <Briefcase size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Job Match</h1>
          <p className="text-secondary">See how well your profile matches a role.</p>
        </div>

        <Card className="max-w-3xl mx-auto border-border/60  bg-surface/30">
          <CardContent className="p-8 flex flex-col">
            <label className="text-sm font-medium text-primary mb-3">Paste Job Description</label>
            <textarea
              className="w-full h-64 bg-background border border-border rounded-md p-4 text-sm text-primary placeholder:text-secondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none transition-colors font-mono"
              placeholder="Paste the job requirements here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <div className="mt-6 flex justify-end">
              <Button 
                variant="primary" 
                onClick={handleAnalyze} 
                isLoading={isAnalyzing}
                icon={<Search size={18} />}
                className="w-full sm:w-auto h-11 px-8"
              >
                Analyze Match
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 ">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">Job Match</h1>
          <p className="text-secondary">Analysis complete against provided job description.</p>
        </div>
        <Button variant="secondary" onClick={() => setIsAnalyzed(false)}>
          Analyze Another Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Match Score */}
        <Card className="flex flex-col items-center justify-center p-8  border-border/50  relative overflow-hidden">
          <h2 className="text-sm font-medium text-secondary mb-6 tracking-wide uppercase">Job Match Score</h2>
          <CircularProgress value={84} max={100} size={160} label="Match" />
          <p className="text-sm text-secondary mt-6 text-center max-w-[200px]">
            Strong alignment. You meet the core engineering requirements.
          </p>
        </Card>

        {/* Visual Match Breakdown */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 size={18} className="text-secondary" />
              Match Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            
            <div className="flex h-6 w-full rounded-full overflow-hidden bg-surfaceHover mb-6 shadow-inner">
              <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: '65%' }} title="Matched (65%)" />
              <div className="bg-yellow-500 h-full transition-all duration-1000 delay-150" style={{ width: '15%' }} title="Partial (15%)" />
              <div className="bg-red-500 h-full transition-all duration-1000 delay-300" style={{ width: '20%' }} title="Missing (20%)" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col p-4 rounded-md bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-500 mb-1">
                  <CheckCircle2 size={16} />
                  <span className="text-sm font-medium">Matched</span>
                </div>
                <span className="text-2xl font-bold text-primary">5 <span className="text-sm font-normal text-secondary">skills</span></span>
              </div>
              <div className="flex flex-col p-4 rounded-md bg-yellow-500/5 border border-yellow-500/20">
                <div className="flex items-center gap-2 text-yellow-500 mb-1">
                  <HelpCircle size={16} />
                  <span className="text-sm font-medium">Partial</span>
                </div>
                <span className="text-2xl font-bold text-primary">1 <span className="text-sm font-normal text-secondary">skill</span></span>
              </div>
              <div className="flex flex-col p-4 rounded-md bg-red-500/5 border border-red-500/20">
                <div className="flex items-center gap-2 text-red-500 mb-1">
                  <AlertCircle size={16} />
                  <span className="text-sm font-medium">Missing</span>
                </div>
                <span className="text-2xl font-bold text-primary">2 <span className="text-sm font-normal text-secondary">skills</span></span>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Skill Comparison Lists */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
            
            <div className="p-6">
              <h3 className="text-sm font-medium text-primary flex items-center gap-2 mb-4">
                <CheckCircle2 size={16} className="text-green-500" /> Matched Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 text-xs font-medium bg-surfaceHover border border-border rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-surface/10">
              <h3 className="text-sm font-medium text-primary flex items-center gap-2 mb-4">
                <HelpCircle size={16} className="text-yellow-500" /> Partial Match
              </h3>
              <div className="flex flex-wrap gap-2">
                {partialSkills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 text-xs font-medium bg-surfaceHover border border-border rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-surface/30">
              <h3 className="text-sm font-medium text-primary flex items-center gap-2 mb-4">
                <AlertCircle size={16} className="text-red-500" /> Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 text-xs font-medium bg-surfaceHover border border-border rounded-md text-secondary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Intelligence Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Why you're a good match */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp size={18} className="text-green-500" />
              Why you're a good match
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-secondary leading-relaxed">
              You possess the entire core full-stack foundation required for this role (<strong className="text-primary font-medium">React, Node.js, JavaScript, SQL</strong>). Your extensive project history demonstrates practical AWS experience, aligning perfectly with their infrastructure needs.
            </p>
          </CardContent>
        </Card>

        {/* What's missing */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning" />
              What's missing
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-secondary leading-relaxed">
              The role heavily emphasizes containerization and scalable architecture. You lack explicit <strong className="text-primary font-medium">Docker</strong> experience and evidence of formal <strong className="text-primary font-medium">System Design</strong> applications in your GitHub or Resume.
            </p>
          </CardContent>
        </Card>

        {/* Recommended actions */}
        <Card className="flex flex-col border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <ArrowRight size={18} />
              Recommended actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ol className="space-y-3">
              {recommendedActions.map((action, i) => (
                <li key={i} className="flex gap-3 text-sm text-primary">
                  <span className="text-accent font-mono font-medium">{i + 1}.</span>
                  <span>{action}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Jobs;
