import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import GithubBrandIcon from '../components/ui/GithubBrandIcon';
import { Code2, FileText, Briefcase, Map, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';
import ProgressBar from '../components/ui/ProgressBar';
import Navbar from '../components/layout/Navbar';

const BackgroundGrid = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-accent opacity-20 blur-[100px]"></div>
  </div>
);

const FeaturePreview = ({ title, value, icon: Icon }) => (
  <div className="flex flex-col gap-2 p-4 border border-border rounded-lg bg-surface/50">
    <div className="flex items-center justify-between text-secondary">
      <div className="flex items-center gap-2 text-xs font-medium">
        <Icon size={14} />
        <span>{title}</span>
      </div>
      <span className="text-xs">{value}</span>
    </div>
    <ProgressBar value={parseInt(value)} />
  </div>
);

const Section = ({ title, description, icon: Icon, reverse, children }) => (
  <div className={`flex flex-col gap-12 lg:gap-24 items-center ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} py-24`}>
    <div className="flex-1 space-y-6 text-center lg:text-left">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface">
        <Icon className="text-secondary" size={20} />
      </div>
      <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h3>
      <p className="text-secondary text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">{description}</p>
    </div>
    <div className="flex-1 w-full relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-accent/10 to-transparent blur-2xl opacity-50"></div>
      <Card className="relative bg-background/50 backdrop-blur-xl border-border/50">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="relative min-h-screen bg-background text-primary selection:bg-accent selection:text-white">
      <BackgroundGrid />
      
      {/* Navigation */}
      <Navbar />

      <main id="product" className="relative z-10 pt-32 pb-16 px-6 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mt-12 mb-24 ">
          <Badge variant="default" className="mb-6 border-border/50 bg-surface/50 text-secondary backdrop-blur-sm px-3 py-1 text-xs">
            Developer Intelligence Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 leading-tight max-w-4xl">
            Understand your <br className="hidden md:block"/> developer profile.
          </h1>
          <p className="text-lg md:text-xl text-secondary max-w-2xl mb-10 leading-relaxed">
            Analyze your skills, code, projects and career readiness in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/register">
              <Button variant="primary" size="lg" className="h-11 px-8 rounded-full ">
                Get Started
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="h-11 px-8 rounded-full border-border/50 bg-surface/50 backdrop-blur-sm">
                Explore Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div id="how-it-works" className="relative max-w-5xl mx-auto ">
          <Card className="bg-background/80 backdrop-blur-xl border-border/50  shadow-accent/5">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Activity size={18} className="text-accent" />
                    Developer Readiness
                  </h3>
                  <p className="text-sm text-secondary">Based on your recent activity across platforms</p>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold tracking-tighter">84</span>
                  <span className="text-secondary pb-1">/ 100</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FeaturePreview title="GitHub" value="82%" icon={GithubBrandIcon} />
                <FeaturePreview title="DSA" value="76%" icon={Code2} />
                <FeaturePreview title="Projects" value="91%" icon={Briefcase} />
                <FeaturePreview title="Resume" value="79%" icon={FileText} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Sections */}
        <div id="features" className="mt-32 space-y-8">
          <Section 
            title="GitHub Intelligence" 
            description="Deep analysis of your commit history, PR quality, and code review involvement. We highlight your real engineering impact beyond just green squares."
            icon={GithubBrandIcon}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded bg-surface/30 border border-border/50">
                <div className="flex gap-3 items-center text-sm">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Consistent commit frequency</span>
                </div>
                <Badge variant="success">Strong</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-surface/30 border border-border/50">
                <div className="flex gap-3 items-center text-sm">
                  <CheckCircle2 size={16} className="text-warning" />
                  <span>Code review participation</span>
                </div>
                <Badge variant="warning">Average</Badge>
              </div>
            </div>
          </Section>

          <Section 
            title="DSA Intelligence" 
            description="Track your problem-solving patterns. Identify weak spots in dynamic programming or graphs before your next technical interview."
            icon={Code2}
            reverse
          >
            <div className="space-y-5">
              <ProgressBar value={85} colorClass="bg-accent" showLabel />
              <div className="flex justify-between text-xs text-secondary mt-1">
                <span>Arrays & Hashing</span>
                <span>85% completion</span>
              </div>
              <div className="h-px bg-border/50 w-full my-4"></div>
              <ProgressBar value={40} colorClass="bg-warning" showLabel />
              <div className="flex justify-between text-xs text-secondary mt-1">
                <span>Dynamic Programming</span>
                <span>40% completion</span>
              </div>
            </div>
          </Section>

          <Section 
            title="Resume Intelligence" 
            description="Our ATS-aware parser evaluates your resume formatting, bullet point strength, and keyword optimization against top tech companies."
            icon={FileText}
          >
             <div className="p-4 rounded border border-border/50 bg-surface/30 text-sm space-y-3">
               <p className="text-secondary">Extracted Action Verbs</p>
               <div className="flex flex-wrap gap-2">
                 <Badge>Architected</Badge>
                 <Badge>Implemented</Badge>
                 <Badge>Optimized</Badge>
                 <Badge variant="danger">Helped</Badge>
               </div>
               <p className="text-xs text-secondary mt-2">Suggestion: Replace weak verb "Helped" with stronger action word.</p>
             </div>
          </Section>

          <Section 
            title="Job Match" 
            description="Compare your current profile against actual job descriptions. Instantly see which skills you are missing for that Senior Frontend Engineer role."
            icon={Briefcase}
            reverse
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">Senior Frontend Engineer</h4>
                  <p className="text-xs text-secondary">Stripe • Remote</p>
                </div>
                <span className="text-2xl font-semibold tracking-tight text-accent">88%</span>
              </div>
              <div className="space-y-2 mt-4">
                <div className="text-xs text-secondary mb-2">Missing Skills:</div>
                <div className="flex gap-2">
                  <Badge variant="default">GraphQL</Badge>
                  <Badge variant="default">WebRTC</Badge>
                </div>
              </div>
            </div>
          </Section>

          <Section 
            title="Personalized Roadmap" 
            description="Based on your gaps, we generate a week-by-week actionable roadmap to get you interview-ready for your target roles."
            icon={Map}
          >
            <div className="border-l border-border/50 ml-3 space-y-6">
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-accent"></div>
                <h4 className="text-sm font-medium">Week 1: System Design Basics</h4>
                <p className="text-xs text-secondary mt-1">Focus on caching strategies and load balancing.</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-border"></div>
                <h4 className="text-sm font-medium text-secondary">Week 2: Advanced React Patterns</h4>
                <p className="text-xs text-secondary/50 mt-1">Render props, compound components.</p>
              </div>
            </div>
          </Section>
        </div>

        {/* Final CTA */}
        <div className="mt-32 mb-16 py-24 text-center border-y border-border/50 bg-surface/10">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-8">Build a stronger developer profile.</h2>
          <Link to="/register">
            <Button variant="primary" size="lg" className="h-12 px-8 rounded-full ">
              Get Started Now <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-semibold tracking-tight text-secondary">
            <Activity size={18} />
            DevSignal
          </div>
          <div className="flex gap-6 text-sm text-secondary">
            <Link to="#" className="hover:text-primary transition-colors">Product</Link>
            <Link to="#" className="hover:text-primary transition-colors">Features</Link>
            <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-primary transition-colors">GitHub</Link>
            <Link to="#" className="hover:text-primary transition-colors">GitHub repository</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
