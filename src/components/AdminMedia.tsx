'use client';
import { createClientSupabase } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { Card, EmptyRow, Notice, Panel } from '@/components/admin/ui';

interface MediaRow {
  id: number;
  path: string;
  url: string;
  type: string;
  size: number | null;
  alt: string | null;
  title: string | null;
}

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm'];

export default function AdminMedia() {
  const supabase = createClientSupabase();
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<MediaRow[]>([]);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string }>({ kind: 'ok', message: '' });

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('media').select('*').order('id', { ascending: false });
    if (error) setNotice({ kind: 'error', message: `Load failed: ${error.message}` });
    setFiles(((data ?? []) as unknown as MediaRow[]).map((f) => ({ ...f, alt: f.alt ?? '', title: f.title ?? '' })));
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (file: File) => {
    setNotice({ kind: 'ok', message: '' });

    if (!ALLOWED.includes(file.type)) {
      setNotice({ kind: 'error', message: 'Unsupported file type. Use JPG, PNG, WebP, AVIF, GIF, SVG, MP4 or WebM.' });
      return;
    }
    if (file.size > MAX_BYTES) {
      setNotice({ kind: 'error', message: 'File is larger than 10 MB.' });
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const path = `media/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(path, file, { contentType: file.type });
    if (error) {
      setNotice({ kind: 'error', message: `Upload failed: ${error.message}` });
    } else {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;
      const { error: insertError } = await supabase.from('media').insert({
        path,
        url,
        type: file.type.startsWith('video') ? 'video' : 'image',
        size: file.size,
      });
      if (insertError) setNotice({ kind: 'error', message: `Upload stored but cataloguing failed: ${insertError.message}` });
      else setNotice({ kind: 'ok', message: 'Upload complete.' });
      await load();
    }
    setUploading(false);
  };

  const remove = async (row: MediaRow) => {
    if (!window.confirm(`Delete ${row.path}? Any page using this file will lose the image.`)) return;
    const { error: storageError } = await supabase.storage.from('media').remove([row.path]);
    const { error } = await supabase.from('media').delete().eq('id', row.id);
    setNotice(
      storageError || error
        ? { kind: 'error', message: `Delete failed: ${storageError?.message ?? error?.message}` }
        : { kind: 'ok', message: 'File deleted.' }
    );
    await load();
  };

  const updateMeta = async (row: MediaRow, patch: { alt?: string; title?: string }) => {
    const { error } = await supabase.from('media').update(patch).eq('id', row.id);
    setNotice(
      error
        ? { kind: 'error', message: `Update failed: ${error.message}` }
        : { kind: 'ok', message: 'Saved.' }
    );
    await load();
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setNotice({ kind: 'ok', message: 'URL copied.' });
    } catch {
      setNotice({ kind: 'error', message: 'Could not copy — select the URL manually.' });
    }
  };

  return (
    <Panel>
      <Notice {...notice} />
      <Card title="Media library">
        <label className="inline-block cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-textMain transition-colors hover:bg-primaryDark">
          {uploading ? 'Uploading…' : 'Upload file'}
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,video/mp4,video/webm"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            disabled={uploading}
          />
        </label>
        <p className="mt-3 text-xs text-textMuted">
          JPG, PNG, WebP, AVIF, GIF, SVG, MP4 or WebM up to 10 MB. Add alt text so images stay accessible.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {files.map((f) => (
            <li key={f.id} className="rounded-xl border border-border bg-bgDark p-4">
              <div className="flex items-start gap-3">
                {f.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.url} alt={f.alt || ''} className="h-16 w-24 shrink-0 rounded-lg border border-border object-cover" loading="lazy" />
                ) : (
                  <span aria-hidden="true" className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-border text-xs text-textMuted">
                    Video
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-textMain">{f.title || f.path}</p>
                  <a href={f.url} target="_blank" rel="noreferrer" className="block truncate text-xs text-primary underline-offset-4 hover:underline">
                    {f.url}
                  </a>
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => copyUrl(f.url)} className="rounded bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/25">
                      Copy URL
                    </button>
                    <button type="button" onClick={() => remove(f)} className="rounded bg-red-600/15 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-600/25">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  defaultValue={f.alt ?? ''}
                  placeholder="Alt text"
                  aria-label={`Alt text for ${f.path}`}
                  onBlur={(e) => e.target.value !== f.alt && updateMeta(f, { alt: e.target.value })}
                  className="w-full rounded border border-border bg-bgCard px-2.5 py-1.5 text-xs text-textMain placeholder:text-textMuted/50 focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  defaultValue={f.title ?? ''}
                  placeholder="Title"
                  aria-label={`Title for ${f.path}`}
                  onBlur={(e) => e.target.value !== f.title && updateMeta(f, { title: e.target.value })}
                  className="w-full rounded border border-border bg-bgCard px-2.5 py-1.5 text-xs text-textMain placeholder:text-textMuted/50 focus:border-primary focus:outline-none"
                />
              </div>
            </li>
          ))}
        </ul>
        {!uploading && files.length === 0 && <EmptyRow>No media uploaded yet.</EmptyRow>}
      </Card>
    </Panel>
  );
}
