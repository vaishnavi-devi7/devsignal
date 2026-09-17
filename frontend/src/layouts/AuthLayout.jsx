import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';



const AuthLayout = () => {
  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-center items-center p-6 selection:bg-accent selection:text-white">
      <Link to="/" className="relative z-10 flex items-center gap-2 text-primary font-semibold text-xl tracking-tight mb-8 hover:opacity-80 transition-opacity">
        <Activity className="text-accent" size={24} />
        DevSignal
      </Link>
      
      <div className="relative z-10 w-full max-w-[400px]">
        <Outlet />
      </div>
      
      <div className="relative z-10 mt-12 text-center text-xs text-secondary/60">
        <p>&copy; {new Date().getFullYear()} DevSignal. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AuthLayout;
