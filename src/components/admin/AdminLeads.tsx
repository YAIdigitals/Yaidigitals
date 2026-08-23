'use client';

import { createClientSupabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_type: string | null;
  budget_range: string | null;
  required_service: string | null;
  project_description: string | null;
  preferred_contact_method: string | null;
  status: string;
  internal_notes: string | null;
  created_at: string;
};

export default function AdminLeads() {
  const supabase = createClientSupabase();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Form state for editing leads
  const [editLeadId, setEditLeadId] = useState<number | null>(null);
  const [leadForm, setLeadForm] = useState({
    id: null as number | null,
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    budget_range: '',
    required_service: '',
    project_description: '',
    preferred_contact_method: '',
    status: 'new' as 'new' | 'contacted' | 'qualified' | 'in_progress' | 'won' | 'lost',
    internal_notes: '',
    loading: false
  });

  const loadLeads = async () => {
    setLoading(true);
    try {
      let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
      
      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Apply search term
      if (searchTerm.trim()) {
        const search = `%${searchTerm.trim()}%`;
        query = query.or(`name.ilike.${search},email.ilike.${search},company.ilike.${search},project_description.ilike.${search}`);
      }
      
      const { data } = await query;
      setLeads(data ?? []);
    } catch (error) {
      console.error('Error loading leads:', error);
      alert('Error loading leads. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [statusFilter, searchTerm]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadForm(prev => ({ ...prev, loading: true }));
    
    try {
      const leadData = {
        name: leadForm.name,
        email: leadForm.email,
        phone: leadForm.phone,
        company: leadForm.company,
        project_type: leadForm.project_type,
        budget_range: leadForm.budget_range,
        required_service: leadForm.required_service,
        project_description: leadForm.project_description,
        preferred_contact_method: leadForm.preferred_contact_method,
        status: leadForm.status,
        internal_notes: leadForm.internal_notes
      };

      if (leadForm.id) {
        await supabase.from('leads').update(leadData).eq('id', leadForm.id);
      } else {
        await supabase.from('leads').insert(leadData);
      }
      
      // Reset form
      setLeadForm(prev => ({
        ...prev,
        id: null,
        name: '',
        email: '',
        phone: '',
        company: '',
        project_type: '',
        budget_range: '',
        required_service: '',
        project_description: '',
        preferred_contact_method: '',
        status: 'new',
        internal_notes: '',
        loading: false
      }));
      
      setEditLeadId(null);
      await loadLeads();
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Error saving lead. Please check the console for details.');
      setLeadForm(prev => ({ ...prev, loading: false }));
    }
  };

  const handleLeadDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setLoading(true);
      await supabase.from('leads').delete().eq('id', id);
      await loadLeads();
      setLoading(false);
    }
  };

  const handleLeadEdit = (lead: Lead) => {
    setLeadForm({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      company: lead.company || '',
      project_type: lead.project_type || '',
      budget_range: lead.budget_range || '',
      required_service: lead.required_service || '',
      project_description: lead.project_description || '',
      preferred_contact_method: lead.preferred_contact_method || '',
      status: lead.status as 'new' | 'contacted' | 'qualified' | 'in_progress' | 'won' | 'lost',
      internal_notes: lead.internal_notes || '',
      loading: false
    });
    
    setEditLeadId(lead.id);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Lead Management</h2>
        
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full md:w-auto">
            <label className="block text-sm font-medium mb-1 md:mb-0">Status Filter</label>
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="border rounded px-3 py-2 w-full md:w-32"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="in_progress">In Progress</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 w-full md:w-auto">
            <label className="block text-sm font-medium mb-1 md:mb-0">Search Leads</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name, email, company, or description"
              className="border rounded px-3 py-2 w-full md:w-48"
            />
          </div>
        </div>
        
        {/* Lead Form */}
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">
            {editLeadId ? 'Edit Lead' : 'Add New Lead'}
          </h3>
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={leadForm.company}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Type</label>
                <input
                  type="text"
                  value={leadForm.project_type}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, project_type: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Budget Range</label>
                <input
                  type="text"
                  value={leadForm.budget_range}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, budget_range: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Required Service</label>
                <input
                  type="text"
                  value={leadForm.required_service}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, required_service: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Contact Method</label>
                <input
                  type="text"
                  value={leadForm.preferred_contact_method}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, preferred_contact_method: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Project Description</label>
              <textarea
                value={leadForm.project_description}
                onChange={(e) => setLeadForm(prev => ({ ...prev, project_description: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={leadForm.status}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, status: e.target.value as 'new' | 'contacted' | 'qualified' | 'in_progress' | 'won' | 'lost' }))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="in_progress">In Progress</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Internal Notes</label>
                <textarea
                  value={leadForm.internal_notes}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, internal_notes: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={leadForm.loading}
                className={`bg-black text-white px-4 py-2 rounded ${
                  leadForm.loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                }`}
              >
                {leadForm.loading ? 'Saving...' : 'Save Lead'}
              </button>
              {editLeadId && (
                <button
                  type="button"
                  onClick={() => {
                    setLeadForm(prev => ({
                      ...prev,
                      id: null,
                      name: '',
                      email: '',
                      phone: '',
                      company: '',
                      project_type: '',
                      budget_range: '',
                      required_service: '',
                      project_description: '',
                      preferred_contact_method: '',
                      status: 'new',
                      internal_notes: '',
                      loading: false
                    }));
                    setEditLeadId(null);
                  }}
                  className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {/* Leads List */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Leads List ({leads.length})</h2>
        {loading ? (
          <p className="text-center py-8">Loading leads...</p>
        ) : leads.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No leads found matching the filters.</p>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{lead.name}</h3>
                  <p className="text-sm text-gray-600">{lead.email}</p>
                  {lead.company && (
                    <p className="text-sm text-gray-500 mt-1">{lead.company}</p>
                  )}
                  {lead.project_type && (
                    <p className="text-sm text-gray-500 mt-1">{lead.project_type}</p>
                  )}
                  {lead.budget_range && (
                    <p className="text-sm text-gray-500 mt-1">{lead.budget_range}</p>
                  )}
                  {lead.required_service && (
                    <p className="text-sm text-gray-500 mt-1">{lead.required_service}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    <span className={`px-2 py-1 rounded-text-sm 
                      ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'qualified' ? 'bg-purple-100 text-purple-800' :
                        lead.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                        lead.status === 'won' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'}
                    `}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLeadEdit(lead)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleLeadDelete(lead.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}