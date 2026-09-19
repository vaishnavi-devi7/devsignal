import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code2, 
  FileText, 
  Briefcase, 
  Map, 
  Settings,
  User,
  Activity,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import GithubBrandIcon from '../components/ui/GithubBrandIcon';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const topNavigation = [
    { name: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { name: 'GitHub', to: '/github', icon: GithubBrandIcon },
    { name: 'DSA', to: '/dsa', icon: Code2 },
    { name: 'Resume', to: '/resume', icon: FileText },
    { name: 'Job Match', to: '/jobs', icon: Briefcase },
    { name: 'Roadmap', to: '/roadmap', icon: Map },
    { name: 'Interview Prep', to: '/interview', icon: Code2 },
  ];

  const bottomNavigation = [
    { name: 'Settings', to: '/settings', icon: Settings },
    { name: 'Profile', to: '/profile', icon: User },
  ];

  const NavItem = ({ item, onClick }) => (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          isActive 
            ? 'bg-accent/10 text-accent' 
            : 'text-secondary hover:text-primary hover:bg-surfaceHover'
        }`
      }
    >
      <item.icon size={18} />
      {item.name}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-background selection:bg-accent selection:text-white overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/90 backdrop-blur-md z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-primary font-semibold text-lg tracking-tight">
          <Activity className="text-accent" size={20} />
          DevSignal
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-secondary hover:text-primary transition-colors focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-background md:bg-surface/30 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center px-6 border-b border-border shrink-0 mt-16 md:mt-0">
          <div className="hidden md:flex items-center gap-2 text-primary font-semibold text-lg tracking-tight">
            <Activity className="text-accent" size={20} />
            DevSignal
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {topNavigation.map((item) => (
            <NavItem key={item.name} item={item} onClick={() => setIsMobileMenuOpen(false)} />
          ))}
        </div>

        <div className="p-3 border-t border-border space-y-1 shrink-0">
          {bottomNavigation.map((item) => (
            <NavItem key={item.name} item={item} onClick={() => setIsMobileMenuOpen(false)} />
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-secondary hover:text-danger hover:bg-danger/10"
          >
            <LogOut size={18} />
            Sign out
          </button>
          
          {user && (
            <div className="mt-4 pt-4 border-t border-border/50 px-3 flex flex-col">
              <span className="text-sm font-medium truncate">{user.name}</span>
              <span className="text-xs text-secondary truncate">{user.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen">
        <main className="flex-1 overflow-y-auto pt-24 pb-12 px-4 md:pt-12 md:px-8">
          <div className="max-w-5xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
