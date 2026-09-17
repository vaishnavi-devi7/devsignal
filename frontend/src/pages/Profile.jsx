import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { User, Mail, Link as LinkIcon, MapPin, Building, Calendar, Edit2 } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">Public Profile</h1>
          <p className="text-secondary">This is how other developers and recruiters see you.</p>
        </div>
        <Button variant="secondary" icon={<Edit2 size={16} />}>
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Identity */}
        <div className="md:col-span-1 space-y-6">
          <Card className="flex flex-col items-center text-center p-6">
            <div className="w-24 h-24 rounded-full bg-surfaceHover border border-border flex items-center justify-center text-secondary mb-4 relative overflow-hidden group cursor-pointer">
              <User size={40} className="group-hover:opacity-50 transition-opacity" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-medium text-white">Upload</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-primary">Alex Developer</h2>
            <p className="text-sm text-secondary mt-1">Full Stack Engineer</p>
            
            <div className="w-full flex flex-col gap-3 mt-6 text-sm text-secondary">
              <div className="flex items-center gap-3">
                <MapPin size={16} /> San Francisco, CA
              </div>
              <div className="flex items-center gap-3">
                <Building size={16} /> Open to work
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} /> Joined Sept 2026
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Bio & Links */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-secondary leading-relaxed">
                Passionate software engineer specializing in modern web architecture. Experienced with React, Node.js, and cloud deployments. I love solving complex distributed system problems and contributing to open-source developer tools.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-md border border-border bg-surface/50">
                <div className="p-2 bg-surface rounded text-primary">
                  <LinkIcon size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Portfolio</p>
                  <p className="text-xs text-secondary">alex.dev</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-md border border-border bg-surface/50">
                <div className="p-2 bg-surface rounded text-primary">
                  <Mail size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-secondary">alex@example.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Profile;
