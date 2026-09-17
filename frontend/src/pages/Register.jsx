import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, User } from 'lucide-react';
import GithubBrandIcon from '../components/ui/GithubBrandIcon';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    setIsLoading(true);
    
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
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
        <h1 className="text-2xl font-semibold tracking-tight mt-2">Create your developer profile</h1>
        <p className="text-sm text-secondary mt-1 px-4">
          Start understanding your strengths and skill gaps.
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
          
          <Input 
            label="Confirm Password" 
            type="password" 
            name="confirmPassword"
            icon={Lock} 
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full mt-4 h-11 "
            isLoading={isLoading}
          >
            Create account
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
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => navigate('/dashboard'), 1500);
          }}
          disabled={isLoading}
        >
          Continue with GitHub
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
