'use client';
import { useState } from 'react';
import AdminProducts from '@/components/AdminProducts';
import AdminBundles from '@/components/AdminBundles';
import AdminBlog from '@/components/AdminBlog';
import AdminMedia from '@/components/AdminMedia';
import AdminSettings from '@/components/AdminSettings';
import AdminServices from '@/components/admin/AdminServices';
import AdminCourses from '@/components/admin/AdminCourses';
import AdminProjects from '@/components/admin/AdminProjects';
import AdminLeads from '@/components/admin/AdminLeads';

type Tab = 'products' | 'bundles' | 'blog' | 'media' | 'settings' | 'services' | 'courses' | 'projects' | 'leads';

export default function AdminDashboard({ initialTab }: { initialTab: string }) {
  const [tab, setTab] = useState<Tab>((initialTab as Tab) || 'products');
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>
      <nav className="mt-4 flex gap-4 border-b">
        {([
          'products',
          'bundles',
          'blog',
          'media',
          'settings',
          'services',
          'courses',
          'projects',
          'leads'
        ] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`pb-2 ${tab===t ? 'border-b-2 border-primary font-semibold' : 'text-textMuted'}`}>
            {t}
          </button>
        ))}
      </nav>
      <div className="mt-6">
        {tab === 'products' && <AdminProducts />}
        {tab === 'bundles' && <AdminBundles />}
        {tab === 'blog' && <AdminBlog />}
        {tab === 'media' && <AdminMedia />}
        {tab === 'settings' && <AdminSettings />}
        {tab === 'services' && <AdminServices />}
        {tab === 'courses' && <AdminCourses />}
        {tab === 'projects' && <AdminProjects />}
        {tab === 'leads' && <AdminLeads />}
      </div>
    </div>
  );
}
