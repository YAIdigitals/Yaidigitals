'use client';

import { useState } from 'react';
import { createClientSupabase } from '@/lib/supabase/client';

export default function ContactForm() {
  const supabase = createClientSupabase();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    budget_range: '',
    required_service: '',
    project_description: '',
    preferred_contact_method: 'email'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const { error: supabaseError } = await supabase.from('leads').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        project_type: formData.project_type,
        budget_range: formData.budget_range,
        required_service: formData.required_service,
        project_description: formData.project_description,
        preferred_contact_method: formData.preferred_contact_method
      });
      
      if (supabaseError) throw supabaseError;
      
      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        project_type: '',
        budget_range: '',
        required_service: '',
        project_description: '',
        preferred_contact_method: 'email'
      });
    } catch (err: any) {
      console.error('Error submitting lead:', err);
      setError('Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-primary">Thank you!</h3>
          <p className="mt-2 text-sm text-textMuted">
            We've received your message and will get back to you soon.
          </p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          <h3 className="font-semibold text-red-400">Error</h3>
          <p className="mt-2 text-sm text-textMuted">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-textMuted">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border-border rounded px-3 py-2 focus:border-primary focus:ring-primary/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-textMuted">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full border-border rounded px-3 py-2 focus:border-primary focus:ring-primary/20"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-textMuted">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full border-border rounded px-3 py-2 focus:border-primary focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-textMuted">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full border-border rounded px-3 py-2 focus:border-primary focus:ring-primary/20"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-textMuted">Project Type</label>
            <select
              value={formData.project_type}
              onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value }))}
              className="w-full border-border rounded px-3 py-2 focus:border-primary focus:ring-primary/20"
            >
              <option value="">Select project type</option>
              <option value="website">Website</option>
              <option value="app">Mobile Application</option>
              <option value="ai-automation">AI Automation</option>
              <option value="custom-software">Custom Software</option>
              <option value="seo">SEO Optimization</option>
              <option value="maintenance">Maintenance & Support</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-textMuted">Budget Range</label>
            <select
              value={formData.budget_range}
              onChange={(e) => setFormData(prev => ({ ...prev, budget_range: e.target.value }))}
              className="w-full border-border rounded px-3 py-2 focus:border-primary focus:ring-primary/20"
            >
              <option value="">Select budget range</option>
              <option value="under-1000">Under $1,000</option>
              <option value="1000-5000">$1,000 - $5,000</option>
              <option value="5000-15000">$5,000 - $15,000</option>
              <option value="15000-50000">$15,000 - $50,000</option>
              <option value="over-50000">Over $50,000</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-textMuted">Required Service</label>
            <select
              value={formData.required_service}
              onChange={(e) => setFormData(prev => ({ ...prev, required_service: e.target.value }))}
              className="w-full border-border rounded px-3 py-2 focus:border-primary focus:ring-primary/20"
            >
              <option value="">Select required service</option>
              <option value="website-development">Website Development</option>
              <option value="app-development">App Development</option>
              <option value="ai-automation">AI Automation</option>
              <option value="custom-software">Custom Software Development</option>
              <option value="seo">SEO Optimization</option>
              <option value="maintenance">Maintenance & Support</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-textMuted">Preferred Contact Method</label>
            <select
              value={formData.preferred_contact_method}
              onChange={(e) => setFormData(prev => ({ ...prev, preferred_contact_method: e.target.value }))}
              className="w-full border-border rounded px-3 py-2 focus:border-primary focus:ring-primary/20"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="video-call">Video Call</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-textMuted">Project Description</label>
          <textarea
            value={formData.project_description}
            onChange={(e) => setFormData(prev => ({ ...prev, project_description: e.target.value }))}
            className="w-full border-border rounded px-3 py-2 focus:border-primary focus:ring-primary/20"
            rows={6}
            placeholder="Please describe your project, goals, timeline, and any specific requirements..."
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-primary text-textMain px-6 py-3 rounded-lg hover:bg-primaryDark/80 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </>
  );
}