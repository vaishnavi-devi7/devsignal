import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import api from '../lib/api';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, User } from 'lucide-react';
import GithubBrandIcon from '../components/ui/GithubBrandIcon';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { exchangeAuthCode } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const exchangeAttempted = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      let errorMsg = 'GitHub signup failed';
      if (error === 'no_email') errorMsg = 'Your GitHub account must have a verified email.';
      setErrors({ email: errorMsg });
      searchParams.delete('error');
      setSearchParams(searchParams);
    }

    if (code && !exchangeAttempted.current) {
      exchangeAttempted.current = true;
      setIsLoading(true);
      exchangeAuthCode(code)
        .then((success) => {
          if (success) {
            // Remove code from URL using history API to prevent reload
            window.history.replaceState({}, document.title, window.location.pathname);
            navigate('/dashboard');
          } else {
            setErrors({ email: 'Failed to authenticate with GitHub. Please try again.' });
            setIsLoading(false);
            searchParams.delete('code');
            setSearchParams(searchParams);
          }
        })
        .catch(err => {
          setErrors({ email: 'Failed to authenticate with GitHub token' });
          setIsLoading(false);
          searchParams.delete('code');
          setSearchParams(searchParams);
        });
    }
  }, [searchParams, exchangeAuthCode, navigate, setSearchParams]);

  const handleGithubAuth = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/github/login');
      window.location.href = res.data.url;
    } catch (err) {
      setErrors({ email: 'Failed to initiate GitHub signup' });
      setIsLoading(false);
    }
  };


  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setIsLoading(true);
    
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ email: err.response?.data?.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Card className="bg-background/80 backdrop-blur-xl border-border/50  ">
      <CardHeader className="text-center pb-2 border-none">
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Create an account</h1>
        <p className="text-sm text-secondary mt-1">
          Join DevSignal to analyze your developer profile.
        </p>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Name" 
            type="text" 
            name="name"
            icon={User} 
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
          />

          <Input 
            label="Email" 
            type="email" 
            name="email"
            icon={Mail} 
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />
          
          <Input 
            label="Password" 
            type="password" 
            name="password"
            icon={Lock} 
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full mt-2 h-11"
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-secondary/70">Or</span>
          </div>
        </div>

        <Button 
          variant="secondary" 
          className="w-full h-11 bg-surface/50 border-border/50"
          icon={<GithubBrandIcon size={18} />}
          onClick={handleGithubAuth}
          disabled={isLoading}
        >
          Sign up with GitHub
        </Button>

        <p className="text-sm text-secondary text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accentHover font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default Register;
