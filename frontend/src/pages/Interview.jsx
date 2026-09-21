import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Sparkles,
  AlertCircle,
  Code2,
  FolderGit2,
  BrainCircuit,
  Users
} from 'lucide-react';
import { aiApi } from '../lib/api';

const Interview = () => {
  const [prepData, setPrepData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePrep = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await aiApi.getInterviewPrep();
      setPrepData(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 503) {
        setError("AI service is not configured. Add AI_API_KEY to the backend environment to enable AI features.");
      } else {
        setError("AI insights are currently unavailable.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 ">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">Interview Prep</h1>
          <p className="text-secondary">AI-generated interview questions based on your actual profile.</p>
        </div>
        <Button onClick={generatePrep} disabled={loading} className="gap-2 shrink-0">
          <Sparkles size={16} />
          {loading ? "Preparing topics..." : prepData ? "Refresh Prep" : "Generate Prep"}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-warning bg-warning/10 p-4 rounded-md text-sm border border-warning/20">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {!prepData && !loading && !error && (
        <Card className="border-accent/30 bg-surface/30">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Sparkles size={48} className="text-accent/50 mb-4" />
            <h3 className="text-lg font-medium text-primary">No Prep Generated</h3>
            <p className="text-sm text-secondary mt-2 max-w-md">
              Generate personalized interview questions focused on your technologies, projects, and DSA history.
            </p>
          </CardContent>
        </Card>
      )}

      {prepData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Code2 size={18} />
                Technical Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {prepData.technicalTopics?.map((item, i) => (
                <div key={i}>
                  <h4 className="text-sm font-medium text-primary mb-2">{item.topic}</h4>
                  <ul className="space-y-2">
                    {item.questions?.map((q, qIdx) => (
                      <li key={qIdx} className="text-sm text-secondary flex gap-2">
                        <span className="text-accent shrink-0 mt-0.5">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-500">
                <FolderGit2 size={18} />
                Project Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {prepData.projectQuestions?.map((item, i) => (
                <div key={i}>
                  <h4 className="text-sm font-medium text-primary mb-2">{item.project}</h4>
                  <ul className="space-y-2">
                    {item.questions?.map((q, qIdx) => (
                      <li key={qIdx} className="text-sm text-secondary flex gap-2">
                        <span className="text-green-500 shrink-0 mt-0.5">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-500">
                <BrainCircuit size={18} />
                DSA Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {prepData.dsaTopics?.map((item, i) => (
                <div key={i} className="bg-surface/50 p-4 rounded-lg border border-border">
                  <h4 className="text-sm font-medium text-primary mb-1">{item.topic}</h4>
                  <p className="text-sm text-secondary">{item.advice}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-500">
                <Users size={18} />
                Behavioral Themes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {prepData.behavioralThemes?.map((theme, i) => (
                  <li key={i} className="text-sm text-secondary flex gap-2">
                    <span className="text-purple-500 shrink-0 mt-0.5">•</span>
                    <span>{theme}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
};

export default Interview;
