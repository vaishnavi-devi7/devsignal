import React, { useState } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { 
  LogOut, 
  Smartphone, 
  Monitor, 
  Moon, 
  Sun,
  ShieldCheck
} from 'lucide-react';
import GithubBrandIcon from '../components/ui/GithubBrandIcon';

// Reusable Section Component
const SettingsSection = ({ title, description, children, isLast = false }) => (
  <div className={`flex flex-col md:flex-row gap-8 py-8 ${!isLast ? 'border-b border-border/50' : ''}`}>
    <div className="w-full md:w-1/3 shrink-0">
      <h3 className="text-base font-medium text-primary">{title}</h3>
      {description && <p className="text-sm text-secondary mt-1">{description}</p>}
    </div>
    <div className="w-full md:w-2/3 max-w-xl space-y-6">
      {children}
    </div>
  </div>
);

const Settings = () => {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-5xl mx-auto ">
      
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-secondary">Manage your account preferences and integrations.</p>
      </div>

      <div className="bg-surface/10 rounded-xl border border-border/30 px-6 sm:px-10">
        
        {/* Profile Section */}
        <SettingsSection 
          title="Profile" 
          description="Your personal information and email address."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" defaultValue="Alex Developer" />
            <Input label="Email Address" type="email" defaultValue="alex@example.com" />
          </div>
          <div className="flex justify-end">
            <Button variant="primary" className="h-9">Save Changes</Button>
          </div>
        </SettingsSection>

        {/* GitHub Connection */}
        <SettingsSection 
          title="GitHub Connection" 
          description="Link your GitHub account to sync repositories and activity data automatically."
        >
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <Input label="GitHub Username" defaultValue="alexdeveloper" disabled />
            </div>
            <Button variant="secondary" className="h-11 sm:h-auto" icon={<GithubBrandIcon size={16} />}>
              Disconnect
            </Button>
          </div>
          <p className="text-xs text-secondary">
            Your account is currently connected. We sync your public activity daily.
          </p>
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection 
          title="Preferences" 
          description="Customize the interface and notification behavior."
        >
          {/* Theme Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-primary">Theme</label>
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    theme === t.id 
                      ? 'bg-accent/10 border-accent/50 text-accent' 
                      : 'bg-surface/50 border-border hover:bg-surfaceHover text-secondary hover:text-primary'
                  }`}
                >
                  <t.icon size={16} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-surface/30">
            <div>
              <p className="text-sm font-medium text-primary">Email Notifications</p>
              <p className="text-xs text-secondary mt-0.5">Receive weekly progress reports and platform updates.</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background ${
                notifications ? 'bg-accent' : 'bg-surfaceHover border border-border'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-1.5' : '-translate-x-1.5'
                }`}
              />
            </button>
          </div>
        </SettingsSection>

        {/* Security */}
        <SettingsSection 
          title="Security" 
          description="Manage your password and active sessions."
          isLast={true}
        >
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-primary">Change Password</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••" />
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" className="h-9">Update Password</Button>
            </div>
          </div>

          <div className="pt-4 border-t border-border/30 space-y-4">
            <h4 className="text-sm font-medium text-primary">Active Sessions</h4>
            
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface/50">
              <div className="flex items-center gap-3">
                <Monitor className="text-secondary" size={20} />
                <div>
                  <p className="text-sm font-medium text-primary">Mac OS • Chrome</p>
                  <p className="text-xs text-secondary">San Francisco, USA • Current Session</p>
                </div>
              </div>
              <ShieldCheck size={18} className="text-green-500" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-surface/10">
              <div className="flex items-center gap-3">
                <Smartphone className="text-secondary" size={20} />
                <div>
                  <p className="text-sm font-medium text-primary">iOS • Safari</p>
                  <p className="text-xs text-secondary">San Francisco, USA • 2 days ago</p>
                </div>
              </div>
              <button className="text-xs font-medium text-danger hover:text-dangerHover transition-colors">
                Revoke
              </button>
            </div>
          </div>

          <div className="pt-6 mt-4">
            <Button variant="secondary" className="w-full sm:w-auto text-danger border-danger/20 hover:bg-danger/10 hover:border-danger/30" icon={<LogOut size={16} />}>
              Sign out of all devices
            </Button>
          </div>
        </SettingsSection>

      </div>
    </div>
  );
};

export default Settings;
