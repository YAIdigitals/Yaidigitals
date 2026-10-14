/**
 * Seed script: Creates the first "6 Documents Before Vibe Coding" resource as a draft.
 *
 * Run with: tsx scripts/seed-resource-hub.ts
 *
 * This script uses the Supabase service-role key to insert data.
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 *
 * Note: The Google Drive link and file details are NOT pre-filled because
 * no branded PDF was found in the workspace. Update the resource in the
 * admin dashboard to add the file before publishing.
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  console.log('🌱 Seeding Resource Hub...');

  // 1. Ensure category exists
  const { data: cat, error: catError } = await supabase
    .from('resource_categories')
    .upsert({ name: 'AI Development', slug: 'ai-development', description: 'Resources for building with AI tools', sort_order: 1 }, { onConflict: 'slug' })
    .select('id')
    .single();

  if (catError) {
    console.error('❌ Category upsert failed:', catError.message);
    process.exit(1);
  }

  console.log('✅ Category: AI Development (id:', cat.id, ')');

  // 2. Create the resource
  const article = `Before you start building with AI coding tools like Cursor, GitHub Copilot, or any vibe coding assistant, you need to have the right documents in place. Without them, AI models will generate code that doesn't match your vision, your architecture, or your business requirements.

These six documents are the foundation of every successful AI-assisted development project. They give the AI model the context it needs to produce relevant, accurate, production-quality code.

## 1. Product Requirements Document (PRD)

The PRD defines what you are building and why. It includes the problem statement, target users, core features, and success criteria. Without a PRD, the AI will make assumptions about your product goals that may be completely wrong.

## 2. Technical Requirements Document (TRD)

The TRD defines how you are building it. This includes your chosen tech stack, deployment environment, performance requirements, third-party integrations, and engineering constraints.

## 3. App Flow Document

The App Flow document maps out every user journey through your application — from landing to conversion. It ensures the AI generates logic that matches your intended user experience.

## 4. UI/UX Design Brief

Even without full wireframes, a UI/UX brief defines your design system, color palette, typography, component patterns, and the overall aesthetic. The AI uses this to generate frontend code that matches your brand.

## 5. Backend Schema

Your database schema is one of the most critical documents. It defines your tables, relationships, constraints, and data types. AI will structure your queries, APIs, and business logic around this schema.

## 6. Implementation Plan

The Implementation Plan breaks the project into phases, prioritizes features, and defines the order of development. This keeps the AI focused on the current phase instead of jumping ahead.

## Why These Documents Matter

AI coding tools are powerful but they work within the context you provide. The more precise and structured your context documents are, the more accurate, maintainable, and production-ready the generated code will be.

Developers who vibe code without documentation often end up with spaghetti architectures, mismatched components, and technical debt that is difficult to unwind.

Start with these six documents. Your AI assistant — and your future self — will thank you.`;

  const { data: resource, error: resError } = await supabase
    .from('resources')
    .upsert(
      {
        title: '6 Documents Before Vibe Coding',
        slug: '6-documents-before-vibe-coding',
        summary:
          'Six essential documents every developer should prepare before building an application with AI coding tools. Your AI assistant is only as good as the context you provide.',
        article,
        category_id: cat.id,
        tags: ['vibe-coding', 'ai-development', 'product-requirements', 'documentation', 'developer-tools'],
        file_type: 'pdf',
        file_name: '6-documents-before-vibe-coding.pdf',
        seo_title: '6 Documents Before Vibe Coding — Free PDF Guide | YAIdigitals',
        meta_description:
          'Download the free PDF guide: 6 essential documents every developer must prepare before building with AI coding tools. PRD, TRD, App Flow, Design Brief, Schema & Implementation Plan.',
        featured: true,
        ads_enabled: true,
        status: 'draft', // Keep as draft until the PDF is added and verified
        // google_drive_url: null, -- Set in admin when PDF is available
      },
      { onConflict: 'slug' }
    )
    .select('id, slug, status')
    .single();

  if (resError) {
    console.error('❌ Resource upsert failed:', resError.message);
    process.exit(1);
  }

  console.log('✅ Resource created (id:', resource.id, ')');
  console.log('   Slug:', resource.slug);
  console.log('   Status: DRAFT (add the PDF in the admin before publishing)');

  // 3. Create a campaign for it
  const { error: campError } = await supabase
    .from('resource_campaigns')
    .upsert(
      {
        name: '6 Documents Before Vibe Coding — Instagram',
        resource_id: resource.id,
        comment_keyword: 'DOC',
        utm_source: 'instagram',
        utm_medium: 'dm',
        utm_campaign: '6_documents',
        automation_provider: 'manychat',
        automation_status: 'manual',
        notes: 'Reel: "6 Documents Before Vibe Coding". Users comment DOC to receive the DM with the download link.',
      },
      { onConflict: 'name' }
    );

  if (campError) {
    console.warn('⚠️ Campaign upsert failed (may already exist):', campError.message);
  } else {
    console.log('✅ Campaign created: 6 Documents — Instagram (keyword: DOC)');
  }

  // 4. Ensure advertising settings exist
  const { data: existingAd } = await supabase
    .from('advertising_settings')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (!existingAd) {
    await supabase.from('advertising_settings').insert({
      provider: 'adsterra',
      global_enabled: false,
      native_enabled: true,
      banner_300x250_enabled: true,
      banner_320x50_enabled: true,
      banner_728x90_enabled: true,
      website_id: '6121931',
    });
    console.log('✅ Advertising settings initialized (global_enabled: false)');
  } else {
    console.log('ℹ️  Advertising settings already exist');
  }

  console.log('\n🎉 Resource Hub seed complete!');
  console.log('\nNext steps:');
  console.log('  1. Go to /admin → Resource Hub → Resources');
  console.log('  2. Edit "6 Documents Before Vibe Coding"');
  console.log('  3. Add the Google Drive URL for the PDF');
  console.log('  4. Publish the resource');
  console.log('  5. Go to Advertising and enable ads when ready');
  console.log('  6. Configure Manychat with the campaign tracking URL');
  console.log('\nPublic URL: https://www.yaidigitals.co.in/resources/6-documents-before-vibe-coding');
}

main().catch(console.error);
