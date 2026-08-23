'use client';

import { createClientSupabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export default function AdminServices() {
  const supabase = createClientSupabase();
  const [services, setServices] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [icon, setIcon] = useState('');
  const [features, setFeatures] = useState('[]');
  const [pricingInfo, setPricingInfo] = useState('{}');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('sort_order');
    setServices(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: existing } = await supabase
        .from('services')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existing) {
        await supabase
          .from('services')
          .update({
            title,
            slug,
            short_description: shortDescription,
            full_content: fullContent,
            icon,
            features: JSON.parse(features),
            pricing_info: JSON.parse(pricingInfo),
            active,
            featured,
            sort_order: Number(sortOrder),
            seo_title: seoTitle,
            seo_description: seoDescription,
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('services').insert({
          title,
          slug,
          short_description: shortDescription,
          full_content: fullContent,
          icon,
          features: JSON.parse(features),
          pricing_info: JSON.parse(pricingInfo),
          active,
          featured,
          sort_order: Number(sortOrder),
          seo_title: seoTitle,
          seo_description: seoDescription,
        });
      }

      // Reset form
      setTitle('');
      setSlug('');
      setShortDescription('');
      setFullContent('');
      setIcon('');
      setFeatures('[]');
      setPricingInfo('{}');
      setActive(true);
      setFeatured(false);
      setSortOrder(0);
      setSeoTitle('');
      setSeoDescription('');
      
      await load();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setLoading(true);
      await supabase.from('services').delete().eq('id', id);
      await load();
      setLoading(false);
    }
  };

  const handleEdit = (service: any) => {
    setTitle(service.title);
    setSlug(service.slug);
    setShortDescription(service.short_description || '');
    setFullContent(service.full_content || '');
    setIcon(service.icon || '');
    setFeatures(JSON.stringify(service.features || []));
    setPricingInfo(JSON.stringify(service.pricing_info || {}));
    setActive(service.active ?? true);
    setFeatured(service.featured ?? false);
    setSortOrder(service.sort_order ?? 0);
    setSeoTitle(service.seo_title || '');
    setSeoDescription(service.seo_description || '');
  };

  return (
    <div className="space-y-6">
      <div className="border-border bg-bgCard rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Add/Edit Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Full Content</label>
            <textarea
              value={fullContent}
              onChange={(e) => setFullContent(e.target.value)}
              className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
              rows={6}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Icon (CSS class or URL)</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Features (JSON array)</label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                rows={3}
                placeholder='["Feature 1", "Feature 2"]'
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pricing Info (JSON object)</label>
              <textarea
                value={pricingInfo}
                onChange={(e) => setPricingInfo(e.target.value)}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                rows={3}
                placeholder='{"regular": 99, "discounted": 79}'
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SEO Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SEO Description</label>
              <input
                type="text"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <label className="block text-sm font-medium mb-1 mr-2">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4"
                />
                Active
              </label>
              <label className="block text-sm font-medium mb-1 ml-4">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4"
                />
                Featured
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`bg-primary text-textMain px-4 py-2 rounded ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primaryDark/80'
              }`}
            >
              {loading ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="border-border bg-bgCard rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Services List</h2>
        {loading ? (
          <p className="text-center py-8">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-center py-8 text-textMuted">No services found. Add a service above.</p>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border-border bg-bgCard rounded-lg p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="text-sm text-textMuted">{service.slug}</p>
                  {service.short_description && (
                    <p className="text-sm text-textMuted mt-1">{service.short_description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="bg-primary text-textMain px-3 py-1 rounded text-sm hover:bg-primaryDark/80"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
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