import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Mail, Link as LinkIcon, MapPin, Building, Calendar, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        setFormData({
          bio: data.bio || '',
          location: data.location || '',
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/profile', formData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile Settings</h1>
        <p className="text-sm text-secondary mt-1">Manage your account details and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-border/50">
            <div className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center text-secondary text-2xl">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-medium">{user?.name}</h3>
              <p className="text-sm text-secondary">{user?.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" value={user?.name || ''} readOnly />
            <Input label="Email Address" value={user?.email || ''} readOnly />
            <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
            <Input label="Bio" name="bio" value={formData.bio} onChange={handleChange} />
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="primary" onClick={handleSave} isLoading={saving}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
