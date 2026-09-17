import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import CircularProgress from '../components/ui/CircularProgress';
import { 
  FileText, 
  UploadCloud, 
  FileUp, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Wand2,
  ListChecks,
  Activity,
  Plus
} from 'lucide-react';

const ProgressBar = ({ label, percentage }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-sm">
      <span className="font-medium text-secondary">{label}</span>
      <span className="font-medium text-primary">{percentage}%</span>
    </div>
    <div className="w-full h-2 bg-surfaceHover rounded-full overflow-hidden">
      <div 
        className="h-full bg-accent rounded-full transition-all duration-1000 ease-out" 
        style={{ width: `${percentage}%` }} 
      />
    </div>
  </div>
);

const Resume = () => {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDemo = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsAnalyzed(true);
    }, 1500);
  };

  const detectedSkills = ['Python', 'Java', 'React', 'Node.js', 'AWS', 'SQL', 'Git'];
  const missingSkills = ['Docker', 'Testing', 'System Design'];
  
  const improvements = [
    { title: 'Add measurable results to project descriptions.', type: 'High Priority' },
    { title: 'Highlight deployment experience.', type: 'Medium Priority' },
    { title: 'Add testing technologies.', type: 'Medium Priority' }
  ];

  if (!isAnalyzed) {
    return (
      <div className="space-y-8 ">
        <div className="flex flex-col gap-1 text-center max-w-xl mx-auto mt-8">
          <div className="mx-auto bg-accent/10 p-4 rounded-full mb-4">
            <FileText size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Resume Intelligence</h1>
          <p className="text-secondary">Turn your resume into actionable insights.</p>
        </div>

        <Card className="max-w-2xl mx-auto bg-surface/30 border-dashed border-2 border-border/60 hover:border-accent/40 transition-colors">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <UploadCloud size={48} className="text-secondary mb-4" />
            <h3 className="text-lg font-medium text-primary mb-1">Drop your resume here</h3>
            <p className="text-sm text-secondary mb-8">PDF supported (Max 5MB)</p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button variant="primary" icon={<FileUp size={18} />} className="w-full sm:w-auto h-11">
                Upload Resume
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleDemo} 
                isLoading={isUploading}
                icon={<Wand2 size={18} />}
                className="w-full sm:w-auto h-11"
              >
                View Demo Analysis
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
          <h1 className="text-3xl font-semibold tracking-tight">Resume Intelligence</h1>
          <p className="text-secondary">Analysis complete for <strong className="text-primary font-medium">alex_resume_v4.pdf</strong></p>
        </div>
        <Button variant="secondary" onClick={() => setIsAnalyzed(false)}>
          Upload New Resume
        </Button>
      </div>

      {/* Hero Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Score */}
        <Card className="flex flex-col items-center justify-center p-8  border-border/50  relative overflow-hidden">
          <div className=""></div>
          <h2 className="text-sm font-medium text-secondary mb-6 tracking-wide uppercase">Overall Score</h2>
          <CircularProgress value={79} max={100} size={160} label="out of 100" />
          <p className="text-sm text-secondary mt-6 text-center max-w-[200px]">
            Your resume is strong, but lacks measurable impact metrics.
          </p>
        </Card>

        {/* Sub Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={18} className="text-secondary" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center space-y-6 pt-2">
            <ProgressBar label="ATS Compatibility" percentage={84} />
            <ProgressBar label="Technical Skills" percentage={91} />
            <ProgressBar label="Impact" percentage={73} />
            <ProgressBar label="Projects" percentage={86} />
          </CardContent>
        </Card>

      </div>

      {/* Skills Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Detected Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              Detected Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {detectedSkills.map(skill => (
                <span key={skill} className="px-3 py-1.5 text-sm font-medium bg-surfaceHover border border-border rounded-md text-primary">
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Missing Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle size={18} className="text-warning" />
              Missing / Recommended
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map(skill => (
                <span key={skill} className="px-3 py-1.5 text-sm font-medium bg-warning/10 border border-warning/20 rounded-md text-warning flex items-center gap-1.5">
                  <Plus size={14} />
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-xs text-secondary mt-4">
              These skills are frequently requested in Job Descriptions matching your profile, but are missing from your resume.
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Resume Improvements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks size={18} className="text-accent" />
            Resume Improvements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {improvements.map((improvement, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-md bg-surface/30 border border-border group hover:border-accent/30 transition-colors">
                <div className="mt-0.5 bg-accent/10 p-1.5 rounded text-accent">
                  <AlertTriangle size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-primary">{improvement.title}</h4>
                  <p className="text-xs text-secondary mt-1">{improvement.type}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default Resume;
