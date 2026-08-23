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
import AdminUsers from '@/components/admin/AdminUsers';

type Tab = 'products' | 'bundles' | 'blog' | 'media' | 'settings' | 'services' | 'courses' | 'projects' | 'leads' | 'access';

const TABS: { id: Tab; label: string }[] = [
  { id: 'products', label: 'Products' },
  { id: 'bundles', label: 'Bundles' },
  { id: 'blog', label: 'Blog' },
  { id: 'media', label: 'Media' },
  { id: 'services', label: 'Services' },
  { id: 'courses', label: 'Courses' },
  { id: 'projects', label: 'Projects' },
  { id: 'leads', label: 'Leads' },
  { id: 'settings', label: 'Settings' },
  { id: 'access', label: 'Access' },
];

export default function AdminDashboard({ initialTab }: { initialTab: string }) {
  const [tab, setTab] = useState<Tab>(
    (TABS.some((t) => t.id === initialTab) ? (initialTab as Tab) : null) || 'products'
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-xl font-bold text-textMain sm:text-2xl">Admin dashboard</h1>
      <nav
        aria-label="Admin sections"
        className="mt-4 -mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex min-w-max gap-1 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition-colors ${
                tab === t.id
                  ? 'border-primary font-semibold text-textMain'
                  : 'border-transparent text-textMuted hover:text-textMain'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
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
        {tab === 'access' && <AdminUsers />}
      </div>
    </div>
  );
}
