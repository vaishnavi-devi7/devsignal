import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  FileText, 
  UploadCloud, 
  FileUp, 
  CheckCircle2, 
  Trash2,
  RefreshCw
} from 'lucide-react';
import { resumeApi } from '../lib/api';

const Resume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchResume = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await resumeApi.getResume();
      setResume(res.data.resume);
    } catch (err) {
      console.error(err); setError('Failed to fetch resume information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Resume must be smaller than 5 MB.');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await resumeApi.uploadResume(formData);
      setResume(res.data.resume);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while processing your resume.');
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = null;
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your resume profile?')) {
      try {
        await resumeApi.deleteResume();
        setResume(null);
      } catch (err) {
        setError('Failed to delete resume.');
      }
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-secondary">Loading resume intelligence...</div>;
  }

  const hasResume = resume !== null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">Resume Intelligence</h1>
          <p className="text-secondary">Understand what your resume communicates about your developer profile.</p>
        </div>
        {hasResume && (
          <div className="flex gap-2">
            <div className="relative">
              <input 
                type="file" 
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <Button variant="secondary" icon={<RefreshCw size={16} />} isLoading={isUploading}>
                Replace Resume
              </Button>
            </div>
            <Button variant="secondary" onClick={handleDelete} className="hover:text-danger hover:border-danger/30 transition-colors">
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-md bg-danger/10 border border-danger/20 text-danger text-sm">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {!hasResume ? (
        <div className="flex flex-col gap-1 text-center max-w-xl mx-auto mt-8">
          <Card className="max-w-2xl mx-auto bg-surface/30 border-dashed border-2 border-border/60 hover:border-accent/40 transition-colors w-full">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <UploadCloud size={48} className="text-secondary mb-4" />
              <h3 className="text-lg font-medium text-primary mb-1">No resume uploaded yet.</h3>
              <p className="text-sm text-secondary mb-8 max-w-sm">Upload your resume to extract your skills, experience, projects, and education.</p>
              
              <div className="relative inline-block">
                <input 
                  type="file" 
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <Button variant="primary" icon={<FileUp size={18} />} className="w-full sm:w-auto h-11" isLoading={isUploading}>
                  {isUploading ? 'Parsing resume...' : 'Upload Resume'}
                </Button>
              </div>
              <p className="text-xs text-secondary mt-4">PDF or DOCX supported (Max 5MB)</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info */}
          <Card className="lg:col-span-1 h-min">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <FileText size={18} className="text-accent" />
                Resume Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-1">File</p>
                <p className="text-sm font-medium">{resume.file_name}</p>
                <p className="text-xs text-secondary">Updated {new Date(resume.updated_at).toLocaleDateString()}</p>
              </div>
              
              {(resume.full_name || resume.email || resume.phone || resume.location) && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-secondary uppercase tracking-wider mb-2">Contact Info</p>
                  {resume.full_name && <p className="text-sm font-medium">{resume.full_name}</p>}
                  {resume.email && <p className="text-sm text-secondary">{resume.email}</p>}
                  {resume.phone && <p className="text-sm text-secondary">{resume.phone}</p>}
                  {resume.location && <p className="text-sm text-secondary">{resume.location}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Extracted Data */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Skills & Tech */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-success" />
                  Technical Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {resume.programming_languages && resume.programming_languages.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-secondary uppercase tracking-wider mb-3">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.programming_languages.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs font-medium bg-surfaceHover border border-border rounded-md text-primary">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {resume.frameworks && resume.frameworks.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-secondary uppercase tracking-wider mb-3">Frameworks</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.frameworks.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs font-medium bg-surfaceHover border border-border rounded-md text-primary">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {resume.databases && resume.databases.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-secondary uppercase tracking-wider mb-3">Databases</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.databases.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs font-medium bg-surfaceHover border border-border rounded-md text-primary">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {resume.tools && resume.tools.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-secondary uppercase tracking-wider mb-3">Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {resume.tools.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs font-medium bg-surfaceHover border border-border rounded-md text-primary">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(!resume.skills || resume.skills.length === 0) && (
                  <p className="text-sm text-secondary">No technical skills detected automatically.</p>
                )}
                
              </CardContent>
            </Card>

            {/* Other Sections (Education, Experience, etc.) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={18} className="text-secondary" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-secondary">
                    Complex extraction of Education, Experience, and Projects is limited in this phase.
                  </p>
                  
                  {resume.education && resume.education.length > 0 && (
                     <div>
                       <h4 className="text-xs font-medium text-secondary uppercase tracking-wider mb-2">Education</h4>
                       <pre className="text-xs bg-surface p-2 rounded border border-border">{JSON.stringify(resume.education, null, 2)}</pre>
                     </div>
                  )}

                  {resume.experience && resume.experience.length > 0 && (
                     <div>
                       <h4 className="text-xs font-medium text-secondary uppercase tracking-wider mb-2">Experience</h4>
                       <pre className="text-xs bg-surface p-2 rounded border border-border">{JSON.stringify(resume.experience, null, 2)}</pre>
                     </div>
                  )}
                  
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      )}
    </div>
  );
};

export default Resume;
