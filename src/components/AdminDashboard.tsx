'use client';
import { useState } from 'react';
import AdminProducts from '@/components/AdminProducts';
import AdminBundles from '@/components/AdminBundles';
import AdminBlog from '@/components/AdminBlog';
import AdminMedia from '@/components/AdminMedia';
import AdminSettings from '@/components/AdminSettings';
import AdminHomepage from '@/components/admin/AdminHomepage';
import AdminSiteSettings from '@/components/admin/AdminSiteSettings';
import AdminSEO from '@/components/admin/AdminSEO';
import AdminRedirects from '@/components/admin/AdminRedirects';
import AdminIndustries from '@/components/admin/AdminIndustries';
import AdminTechnologies from '@/components/admin/AdminTechnologies';
import AdminTestimonials from '@/components/admin/AdminTestimonials';
import AdminTeam from '@/components/admin/AdminTeam';
import AdminServices from '@/components/admin/AdminServices';
import AdminCourses from '@/components/admin/AdminCourses';
import AdminProjects from '@/components/admin/AdminProjects';
import AdminLeads from '@/components/admin/AdminLeads';
import AdminUsers from '@/components/admin/AdminUsers';

type Tab =
  | 'homepage' | 'settings-site' | 'seo' | 'redirects'
  | 'services' | 'industries' | 'technologies' | 'projects' | 'testimonials' | 'team' | 'blog'
  | 'leads' | 'products' | 'bundles' | 'courses'
  | 'media' | 'settings-legacy' | 'access';

const GROUPS: { label: string; tabs: { id: Tab; label: string }[] }[] = [
  {
    label: 'Website',
    tabs: [
      { id: 'homepage', label: 'Homepage' },
      { id: 'settings-site', label: 'Site Settings' },
      { id: 'seo', label: 'SEO Manager' },
      { id: 'redirects', label: 'Redirects' },
    ],
  },
  {
    label: 'Content',
    tabs: [
      { id: 'services', label: 'Services' },
      { id: 'industries', label: 'Industries' },
      { id: 'technologies', label: 'Technologies' },
      { id: 'projects', label: 'Projects' },
      { id: 'testimonials', label: 'Testimonials' },
      { id: 'team', label: 'Team' },
      { id: 'blog', label: 'Insights' },
    ],
  },
  {
    label: 'Business',
    tabs: [
      { id: 'leads', label: 'Leads' },
      { id: 'products', label: 'Products' },
      { id: 'bundles', label: 'Bundles' },
      { id: 'courses', label: 'Courses' },
    ],
  },
  {
    label: 'System',
    tabs: [
      { id: 'media', label: 'Media' },
      { id: 'settings-legacy', label: 'Key/Value Store' },
      { id: 'access', label: 'Access' },
    ],
  },
];

export default function AdminDashboard({ initialTab }: { initialTab: string }) {
  const allTabs = GROUPS.flatMap((g) => g.tabs);
  const [tab, setTab] = useState<Tab>(
    (allTabs.some((t) => t.id === initialTab) ? (initialTab as Tab) : null) || 'homepage'
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-xl font-bold text-textMain sm:text-2xl">Admin dashboard</h1>

      <nav aria-label="Admin sections" className="mt-4 -mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max gap-1 border-b border-border">
          {GROUPS.map((group) => (
            <div key={group.label} className="flex items-center">
              {group.tabs.map((t) => (
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
              <span aria-hidden="true" className="mx-2 h-5 w-px shrink-0 bg-border" />
            </div>
          ))}
        </div>
      </nav>

      <div className="mt-6">
        {tab === 'homepage' && <AdminHomepage />}
        {tab === 'settings-site' && <AdminSiteSettings />}
        {tab === 'seo' && <AdminSEO />}
        {tab === 'redirects' && <AdminRedirects />}
        {tab === 'services' && <AdminServices />}
        {tab === 'industries' && <AdminIndustries />}
        {tab === 'technologies' && <AdminTechnologies />}
        {tab === 'projects' && <AdminProjects />}
        {tab === 'testimonials' && <AdminTestimonials />}
        {tab === 'team' && <AdminTeam />}
        {tab === 'blog' && <AdminBlog />}
        {tab === 'leads' && <AdminLeads />}
        {tab === 'products' && <AdminProducts />}
        {tab === 'bundles' && <AdminBundles />}
        {tab === 'courses' && <AdminCourses />}
        {tab === 'media' && <AdminMedia />}
        {tab === 'settings-legacy' && <AdminSettings />}
        {tab === 'access' && <AdminUsers />}
      </div>
    </div>
  );
}
