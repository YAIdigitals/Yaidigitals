/**
 * Content seed for the YAIdigitals brand upgrade.
 * Idempotent — safe to run repeatedly. Uses the service-role key (server-side only).
 *
 *   npx tsx scripts/seed-content.ts
 */
import { createServerAdminSupabase } from '@/lib/supabase/server';

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

const SERVICES = [
  {
    slug: 'website-development',
    title: 'Website Development',
    short_description:
      'Fast, responsive and search-friendly websites designed to turn visitors into customers.',
    full_content: [
      'YAIdigitals develops websites that communicate clearly, load fast and give visitors an obvious next step — whether that is contacting your team, booking a service or exploring your catalogue.',
      '## What we build',
      'We build corporate websites, service-business websites, landing pages for campaigns, e-commerce stores, dynamic websites backed by a content system and custom web experiences when a template will not do.',
      '## Problems this solves',
      'Most business websites fail in predictable ways: slow loading on mobile, unclear messaging, no obvious call to action, and content the owner cannot update. We design against those failures from the start — performance budgets, clear structure and a CMS so routine edits never require a developer.',
      '## How we work',
      'Discovery first: we map your services, customers and goals. Then design, build, test and launch — with search-friendly structure, analytics and a handover so your team can manage content confidently.',
    ].join('\n\n'),
    features: [
      'Mobile-first responsive design',
      'Performance and Core Web Vitals budgets',
      'Search-friendly structure and metadata',
      'Content management so you can edit without a developer',
      'Contact and lead-capture forms',
      'Analytics and conversion tracking setup',
      'Hosting and deployment handled end-to-end',
      'Ongoing support and improvement options',
    ],
    process: [
      { step: 'Discover', body: 'We map your services, customers, competitors and goals.' },
      { step: 'Plan', body: 'Site structure, page content and conversion paths are defined before design starts.' },
      { step: 'Design', body: 'A clean, brand-consistent interface focused on clarity and usability.' },
      { step: 'Build', body: 'Fast, responsive implementation tested across devices and browsers.' },
      { step: 'Launch', body: 'Deployment, analytics, search indexing and handover documentation.' },
    ],
    faqs: [
      {
        q: 'How much does a business website cost?',
        a: 'It depends on the number of pages, custom functionality and content requirements. After a short discovery conversation you receive a scoped proposal with a fixed price before any work begins.',
      },
      {
        q: 'How long does a website take to build?',
        a: 'A focused business website typically takes a few weeks from kickoff to launch, depending on how quickly content and feedback are available. You get a clear timeline in the proposal.',
      },
      {
        q: 'Can I update the website myself?',
        a: 'Yes. We build websites with a content management layer so your team can edit text, images, products or posts without touching code — and we provide a handover walkthrough.',
      },
      {
        q: 'Will my website show up on Google?',
        a: 'We build every site with search-friendly structure: proper headings, metadata, sitemaps, fast loading and mobile usability. Ranking also depends on competition and content, which we can help you plan for.',
      },
    ],
    related_project_slugs: ['sparkx-car-care'],
  },
  {
    slug: 'web-application-development',
    title: 'Web Application Development',
    short_description:
      'Custom web applications engineered for performance, usability and scalable business workflows.',
    full_content: [
      'When a business outgrows spreadsheets and disconnected tools, a web application can put customers, operations and data into one system built around the way the business actually works.',
      '## What we build',
      'Customer portals, booking systems, dashboards, vendor and merchant platforms, order management systems, marketplaces and internal tools — each engineered around real workflows with authentication, role-based access and reliable data modelling.',
      '## Problems this solves',
      'Manual processes that do not scale, data scattered across tools, operational work that depends on one person remembering the steps, and generic software that forces the business to adapt to it instead of the other way around.',
      '## How we work',
      'We start with the workflow, not the screen: understand the process, design the data model, then build iteratively with previews so stakeholders can steer the product while it is being developed.',
    ].join('\n\n'),
    features: [
      'Authentication and role-based access',
      'Dashboards and reporting views',
      'Order, booking and workflow systems',
      'Third-party API and payment integrations',
      'Scalable database architecture',
      'Responsive interfaces for desktop and mobile',
      'Performance-focused delivery',
      'Post-launch support and iteration',
    ],
    process: [
      { step: 'Discover', body: 'Workflows, users, data and constraints are mapped in detail.' },
      { step: 'Plan', body: 'Data model, feature scope and architecture are defined before development.' },
      { step: 'Build', body: 'Iterative development with preview builds at every milestone.' },
      { step: 'Test', body: 'Critical workflows, permissions and edge cases are tested before release.' },
      { step: 'Launch', body: 'Production deployment, monitoring setup and ongoing improvement options.' },
    ],
    faqs: [
      {
        q: 'Website or web application — what do we need?',
        a: 'A website primarily presents information; a web application lets users do things — order, book, manage, track. If your core requirement is processing work or transactions, you need an application.',
      },
      {
        q: 'Can you take over or improve an existing application?',
        a: 'Often, yes. We start with a technical review of the current system, identify what should be kept and what should change, and propose a staged improvement plan instead of a risky rewrite.',
      },
      {
        q: 'How do you handle data security?',
        a: 'Row-level database security, server-side authorisation on every sensitive operation, validated inputs and secret management through environment variables — security is part of the architecture, not an afterthought.',
      },
    ],
    related_project_slugs: ['localgo'],
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    short_description:
      'Build intuitive, reliable mobile experiences designed around your customers and business operations.',
    hero_title: 'Mobile App Development Built Around Your Business',
    full_content: [
      'Turn your idea, service or business workflow into a modern mobile experience. YAIdigitals helps businesses plan, design, develop and launch mobile applications focused on usability, performance and long-term growth.',
      '## What we build',
      'Customer applications, marketplace and delivery applications, booking applications, e-commerce apps, business applications and internal operational tools — for Android and iOS from a shared codebase, plus installable web apps where a store presence is not required.',
      '## Development process',
      'Discovery, product planning, UI/UX design, development, integration, testing, deployment and support. You see working previews throughout — not a big reveal at the end.',
      '## Platforms and delivery',
      'We develop cross-platform applications with React Native and Expo, which keeps one product team across Android, iOS and web while still delivering native install experiences through the app stores when needed.',
    ].join('\n\n'),
    features: [
      'Android and iOS from a single codebase',
      'Customer, marketplace, delivery and booking apps',
      'Push notifications and offline-friendly UX',
      'Backend, database and admin panel included',
      'App store submission handled end-to-end',
      'Installable web apps (PWA) where appropriate',
      'Analytics and crash monitoring setup',
      'Post-launch support and feature iteration',
    ],
    process: [
      { step: 'Discovery', body: 'Users, journeys, platforms and constraints are mapped.' },
      { step: 'Product planning', body: 'Feature scope, screens and technical architecture are defined.' },
      { step: 'UI/UX', body: 'Interfaces designed for clarity, speed and platform conventions.' },
      { step: 'Development', body: 'Iterative builds with previews at every milestone.' },
      { step: 'Integration', body: 'Payments, notifications, maps and third-party APIs connected.' },
      { step: 'Testing', body: 'Device testing across Android and iOS before release.' },
      { step: 'Deployment', body: 'Store submission or enterprise distribution handled for you.' },
      { step: 'Support', body: 'Monitoring, maintenance and a roadmap for future versions.' },
    ],
    faqs: [
      {
        q: 'How much does mobile app development cost?',
        a: 'Cost depends on scope: the number of screens, backend complexity and integrations. We scope every project in a written proposal with a fixed price, so you know the investment before development starts.',
      },
      {
        q: 'How long does it take to build a mobile application?',
        a: 'A focused app typically takes weeks to a few months depending on scope. You receive a milestone plan in the proposal, and working previews long before launch.',
      },
      {
        q: 'Can you build both Android and iOS applications?',
        a: 'Yes. We use cross-platform technology (React Native with Expo) so one codebase ships to both stores — faster to build, easier to maintain, consistent on every device.',
      },
      {
        q: 'Can you develop the backend as well?',
        a: 'Yes. Authentication, databases, APIs, admin panels and hosting are part of our app projects — the whole product, not just the screen.',
      },
      {
        q: 'Can an existing application be improved?',
        a: 'Usually. We review the current codebase, stabilise what works, fix what does not, and plan improvements in stages so your users are never disrupted by a risky rewrite.',
      },
    ],
    related_project_slugs: ['localgo', 'sparkx-car-care'],
  },
  {
    slug: 'custom-software',
    title: 'Custom Software',
    short_description:
      'Purpose-built software for businesses that have outgrown spreadsheets, disconnected tools or generic solutions.',
    hero_title: 'Software Designed Around the Way Your Business Works',
    full_content: [
      'When generic software does not fit your workflows, custom software can connect processes, automate repetitive work and give your business the tools it actually needs.',
      '## What we build',
      'Admin dashboards, customer portals, vendor portals, order systems, booking systems, business automation, internal tools, reporting systems, API integrations and marketplace systems.',
      '## Is custom software right for you?',
      'Custom software makes sense when your workflow is genuinely different, when manual work is growing with the business, or when you are paying for several generic tools that still do not talk to each other. We will tell you honestly if an off-the-shelf product is the better answer.',
      '## How we work',
      'We document the workflow first, agree the scope in writing, then build in stages — each stage delivering usable software you can react to, rather than a single big-bang delivery.',
    ].join('\n\n'),
    features: [
      'Workflow analysis and requirements documentation',
      'Admin dashboards and internal tools',
      'Customer and vendor portals',
      'Order, booking and inventory systems',
      'Business automation and integrations',
      'Reporting and data export',
      'Role-based access and audit trails',
      'Deployment, training and ongoing support',
    ],
    process: [
      { step: 'Understand', body: 'We study the existing workflow, tools and pain points.' },
      { step: 'Specify', body: 'A written scope defines features, users and success criteria.' },
      { step: 'Build', body: 'Staged development — usable software from the first milestone.' },
      { step: 'Deploy', body: 'Rollout, data migration and team training.' },
      { step: 'Support', body: 'Ongoing maintenance and iteration as the business grows.' },
    ],
    faqs: [
      {
        q: 'How much does custom software cost?',
        a: 'It depends entirely on scope. Small internal tools cost far less than multi-portal platforms. After understanding your workflow we provide a fixed-price proposal — and we will say so if simpler tooling would serve you better.',
      },
      {
        q: 'Who owns the software you build?',
        a: 'You do. Code, database and infrastructure are yours — no lock-in to continue with us, though most clients stay for support and iteration.',
      },
      {
        q: 'Can you integrate with the tools we already use?',
        a: 'Where a tool exposes an API, yes — payments, communication platforms, accounting exports and more. Integrations are scoped explicitly in the proposal.',
      },
    ],
    related_project_slugs: ['localgo'],
  },
  {
    slug: 'ai-calling-agents',
    title: 'AI Calling Agents',
    short_description:
      'AI-powered voice agents designed to answer calls, qualify leads, handle common enquiries and automate repetitive conversations.',
    hero_title: 'AI That Can Actually Talk to Your Customers.',
    full_content: [
      'YAIdigitals builds AI voice agents that can handle common business conversations, respond to enquiries, qualify leads, support bookings and route customers when human assistance is required.',
      '## Capabilities',
      'Around-the-clock call handling, lead qualification, appointment workflows, answers to common customer enquiries, call summaries delivered to your team, human escalation when a conversation needs a person, and integration with your CRM or workflow tools where supported.',
      '## Where this helps',
      'Missed calls are missed business. An AI calling agent answers every call — after hours, during rush periods, or when your team is busy — captures the details, and hands over only the conversations that genuinely need a human.',
      '## Built responsibly',
      'We design agents that introduce themselves as AI assistants, escalate gracefully, and log summaries so you always know what was promised to whom. A public demonstration can be enabled for your business when the agent is ready — we do not ship half-working demos.',
    ].join('\n\n'),
    features: [
      '24/7 call handling',
      'Lead qualification',
      'Appointment and booking workflows',
      'Answers to common customer enquiries',
      'Call summaries and transcripts',
      'Human escalation paths',
      'CRM and workflow integration where supported',
      'Configuration and testing before go-live',
    ],
    process: [
      { step: 'Map conversations', body: 'We catalogue the calls your business receives and the outcomes you need.' },
      { step: 'Design the agent', body: 'Persona, script flows, escalation rules and integrations are defined.' },
      { step: 'Build and integrate', body: 'The agent is built, connected to your tools and tested with real scenarios.' },
      { step: 'Pilot', body: 'A supervised rollout validates quality before full deployment.' },
      { step: 'Improve', body: 'Call summaries and feedback drive continuous tuning.' },
    ],
    faqs: [
      {
        q: 'Will customers know they are talking to an AI?',
        a: 'Our agents introduce themselves as AI assistants. Honest disclosure builds trust and avoids the frustration of customers believing they are speaking with a person.',
      },
      {
        q: 'What happens when the AI cannot help?',
        a: 'The agent recognises the limits of its scope and escalates — taking a message, transferring the call or booking a follow-up, according to the rules you define.',
      },
      {
        q: 'Can it work with our CRM or calendar?',
        a: 'Where a platform exposes an integration point, yes. We scope integrations explicitly before build so you know exactly what will connect.',
      },
      {
        q: 'Is there a demonstration available?',
        a: 'We can enable a live demonstration for your business once an agent is configured for your use case. Contact us and we will walk you through what is possible.',
      },
    ],
    related_project_slugs: [],
  },
  {
    slug: 'ai-automation',
    title: 'AI & Business Automation',
    short_description:
      'Connect systems, automate repetitive processes and reduce manual operational work with intelligent workflows.',
    full_content: [
      'YAIdigitals connects the systems your business already uses, automates repetitive processes and adds intelligence where it genuinely saves time — not as a gimmick.',
      '## What we automate',
      'Lead capture and follow-up, data entry between systems, report generation, customer communication, order and inventory updates, content workflows and internal approvals.',
      '## Our approach',
      'We start by measuring where manual work actually accumulates. Then we automate the highest-cost, lowest-judgement tasks first — delivering value quickly instead of promising a fully autonomous business on day one.',
      '## Beyond scripts',
      'Automation that fails silently is worse than manual work. We build monitoring, error handling and human review points into every workflow, so failures are visible and recoverable.',
    ].join('\n\n'),
    features: [
      'Workflow analysis and automation roadmap',
      'Lead capture and follow-up automation',
      'Data synchronisation between systems',
      'Document and report generation',
      'Customer communication automation',
      'Monitoring, error handling and alerting',
      'Human review points where judgement matters',
      'Documentation and team handover',
    ],
    process: [
      { step: 'Audit', body: 'We identify the manual work that costs the most time.' },
      { step: 'Prioritise', body: 'Quick wins first — highest cost, lowest risk automations.' },
      { step: 'Build', body: 'Workflows implemented with monitoring and error handling.' },
      { step: 'Validate', body: 'Each automation is verified against real data before handover.' },
      { step: 'Expand', body: 'The roadmap grows as the team trusts the system.' },
    ],
    faqs: [
      {
        q: 'Which processes should be automated first?',
        a: 'The ones that are repetitive, rule-based and frequent — data entry, follow-ups, report generation. Processes requiring judgement get human review points rather than full automation.',
      },
      {
        q: 'Do you use AI in automation?',
        a: 'Where it adds real value — classifying messages, drafting responses, extracting data from documents. We do not add AI for its own sake; reliability comes first.',
      },
      {
        q: 'What if an automation fails?',
        a: 'Every workflow we ship has monitoring and alerts. Failures are visible to your team, and critical flows include retry logic and manual fallback paths.',
      },
    ],
    related_project_slugs: [],
  },
  {
    slug: 'ecommerce',
    title: 'E-commerce & Marketplaces',
    short_description:
      'Commerce platforms designed around products, customers, vendors, payments and operational workflows.',
    full_content: [
      'Selling online is more than a product grid. Orders, payments, inventory, vendors, delivery and customer communication form one operational system — we build commerce platforms with that system in mind.',
      '## What we build',
      'Single-brand online stores, multi-vendor marketplace platforms, hyperlocal commerce platforms, subscription offerings and custom commerce experiences when standard platforms constrain the business model.',
      '## Platform choice',
      'Sometimes the right answer is an established platform configured well. Other times the business model needs a custom build. We assess requirements honestly and recommend the approach that fits — not the one that bills the most.',
      '## Operations included',
      'Order management, payment integration, vendor onboarding flows, delivery workflows and the admin tooling your team needs to run daily operations without developer support.',
    ].join('\n\n'),
    features: [
      'Product catalogue and inventory management',
      'Cart, checkout and payment integration',
      'Order management workflows',
      'Multi-vendor and marketplace capability',
      'Delivery and fulfilment workflows',
      'Admin dashboards for daily operations',
      'Search-friendly product pages',
      'Analytics and sales reporting',
    ],
    process: [
      { step: 'Model', body: 'Products, vendors, orders and operations are mapped into one data model.' },
      { step: 'Design', body: 'Customer journey from discovery to checkout, plus admin workflows.' },
      { step: 'Build', body: 'Storefront and operations tooling developed together.' },
      { step: 'Integrate', body: 'Payments, delivery and communication platforms connected.' },
      { step: 'Launch', body: 'Go-live support, staff training and performance monitoring.' },
    ],
    faqs: [
      {
        q: 'Should we use Shopify or build custom?',
        a: 'If standard features fit your model, a configured platform launches faster and costs less. Custom builds make sense for marketplaces, hyperlocal operations or unique business rules. We recommend honestly after understanding the model.',
      },
      {
        q: 'Can you build a multi-vendor marketplace?',
        a: 'Yes — vendor onboarding, product management, order splitting, payouts and admin controls are all part of our marketplace work.',
      },
      {
        q: 'Which payment gateways do you support?',
        a: 'We integrate the gateways that fit your market and business registration — scoped explicitly in the proposal before development begins.',
      },
    ],
    related_project_slugs: ['localgo'],
  },
];

/* ------------------------------------------------------------------ */
/* Projects — verified facts only                                      */
/* ------------------------------------------------------------------ */

const LOCALGO_CHALLENGE =
  'Local businesses increasingly need a digital way to reach nearby customers, manage products and receive orders without depending entirely on large national marketplaces. LocalGo was developed as a platform focused on bringing customers, local merchants and delivery operations into a unified digital ecosystem.';

const LOCALGO_SOLUTION =
  'YAIdigitals designed and developed LocalGo as a scalable hyperlocal commerce platform where customers can discover nearby businesses, browse products and services, place orders and interact with a locally focused delivery ecosystem. The platform combines customer-facing experiences with merchant management, administrative controls and the infrastructure required to support order and delivery workflows.';

const SPARKX_CHALLENGE =
  'Automotive service businesses need more than a basic online listing. Customers need to quickly understand available services, trust the business and find a simple path toward contacting or engaging with the company. SparkX Car Care required a modern digital presence capable of communicating its services professionally while creating a stronger foundation for online customer acquisition.';

const SPARKX_SOLUTION =
  'YAIdigitals created a responsive digital experience for SparkX Car Care focused on service discovery, professional presentation, usability and customer conversion. Customers can explore car and bike care services — washing, detailing and routine servicing — and book them at their doorstep, with a location-aware experience built for both desktop and mobile visitors.';

const PROJECTS = [
  {
    slug: 'localgo',
    title: 'LocalGo',
    status: 'published',
    featured: true,
    sort_order: 1,
    client_business: 'LocalGo',
    website_url: 'https://localgo.co.in/',
    category: 'Web Application · Marketplace · Delivery Platform',
    industry: 'Local Commerce & On-Demand Delivery',
    short_description:
      'A multi-service local commerce platform designed to connect customers, local businesses and delivery operations through one digital ecosystem.',
    description:
      'A multi-service local commerce platform designed to connect customers, local businesses and delivery operations through one digital ecosystem.',
    problem: LOCALGO_CHALLENGE,
    business_requirement: LOCALGO_CHALLENGE,
    solution: LOCALGO_SOLUTION,
    key_features: [
      'Customer-facing commerce experience',
      'Local business discovery',
      'Restaurant and store listings',
      'Product and menu management',
      'Shopping cart and ordering',
      'Merchant/vendor workflows',
      'Administrative management',
      'Order management',
      'Delivery-oriented workflows',
      'Location-aware experiences',
      'Authentication',
      'Database-backed application architecture',
      'Performance-focused delivery',
      'Responsive web application',
      'Scalable infrastructure approach',
    ],
    services_provided: ['Web Application Development', 'E-commerce & Marketplaces', 'Custom Software'],
    technologies: ['React Native', 'Expo', 'React Native Web', 'TypeScript'],
    architecture_overview:
      'LocalGo is built as a single cross-platform React Native (Expo) codebase delivering the web experience through React Native Web, backed by a database-driven application architecture with customer, merchant and administrative surfaces.',
    development_approach:
      'The platform was developed around its core workflows first — discovery, ordering and delivery — with the customer experience, merchant tooling and administration built as connected parts of one product rather than separate apps.',
    outcome:
      'LocalGo is live and serving customers across its active service areas, bringing food, grocery, medicine, print and parcel delivery from nearby local stores into a single platform.',
    completion_date: null,
    cta_text: 'Visit LocalGo',
    cta_url: 'https://localgo.co.in/',
    seo_title: 'LocalGo Case Study — Hyperlocal Commerce & Delivery Platform | YAIdigitals',
    seo_description:
      'How YAIdigitals designed and developed LocalGo, a hyperlocal commerce platform connecting customers, local businesses and delivery operations.',
    og_title: 'LocalGo — Building a Hyperlocal Commerce & Delivery Platform',
    og_description:
      'A YAIdigitals case study: the engineering behind a multi-service local commerce and delivery ecosystem.',
    og_image: null,
    screenshots: [],
    app_urls: [],
  },
  {
    slug: 'sparkx-car-care',
    title: 'SparkX Car Care',
    status: 'published',
    featured: true,
    sort_order: 2,
    client_business: 'SparkX Car Care',
    website_url: 'https://sparkxcarcare.in/',
    category: 'Web Application · Business Platform',
    industry: 'Automotive / Car Care',
    short_description:
      "A modern digital platform created to strengthen SparkX Car Care's online presence and make its automotive-care services easier for customers to discover and book.",
    description:
      "A modern digital platform created to strengthen SparkX Car Care's online presence and make its automotive-care services easier for customers to discover and book.",
    problem: SPARKX_CHALLENGE,
    business_requirement: SPARKX_CHALLENGE,
    solution: SPARKX_SOLUTION,
    key_features: [
      'Professional automotive brand presentation',
      'Mobile-responsive experience',
      'Clear service discovery for wash, detailing and servicing',
      'Doorstep booking workflows',
      'Location-aware experience with interactive maps',
      'Customer-focused navigation',
      'Conversion-oriented calls to action',
      'Search-friendly page structure',
      'Performance-conscious frontend',
      'Scalable content structure',
    ],
    services_provided: ['Web Application Development', 'Business Websites'],
    technologies: ['React Native', 'Expo', 'React Native Web', 'MapLibre GL', 'TypeScript'],
    architecture_overview:
      'SparkX Car Care runs on a cross-platform React Native (Expo) codebase delivered to the web through React Native Web, with MapLibre GL providing the location-aware experience that supports doorstep service booking.',
    development_approach:
      'The experience was built around a simple customer path — understand the services, trust the brand, book at the doorstep — with a structured, responsive interface designed to perform on mobile devices first.',
    outcome:
      'SparkX Car Care now presents its automotive-care services through a modern digital platform where customers can discover and book car and bike care at their doorstep.',
    completion_date: null,
    cta_text: 'Visit SparkX Car Care',
    cta_url: 'https://sparkxcarcare.in/',
    seo_title: 'SparkX Car Care Case Study — Doorstep Automotive Care Platform | YAIdigitals',
    seo_description:
      'How YAIdigitals built the SparkX Car Care digital platform for doorstep car and bike service discovery and booking.',
    og_title: 'SparkX Car Care — Building a Modern Digital Presence for Automotive Care',
    og_description:
      'A YAIdigitals case study: a modern digital platform for doorstep car and bike care services.',
    og_image: null,
    screenshots: [],
    app_urls: [],
  },
];

/* ------------------------------------------------------------------ */
/* Industries                                                          */
/* ------------------------------------------------------------------ */

const INDUSTRIES = [
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    short_description: 'Online stores and commerce platforms built around products, payments and operations.',
    long_description:
      'Retail is operational: catalogues, orders, payments, delivery and customer questions all need to work together. We build e-commerce systems where the storefront and the back office are designed as one platform, so daily operations stay manageable as sales grow.',
    services: ['E-commerce & Marketplaces', 'Web Application Development', 'Website Development'],
    featured: true,
    sort_order: 1,
  },
  {
    slug: 'local-commerce',
    name: 'Local Commerce',
    short_description: 'Hyperlocal platforms connecting neighbourhood businesses with nearby customers.',
    long_description:
      'Local businesses win on proximity — if customers can find them and order from them easily. We build hyperlocal commerce and delivery platforms that connect nearby stores, restaurants and service providers with the customers around them, including merchant tooling and delivery workflows.',
    services: ['E-commerce & Marketplaces', 'Web Application Development', 'Mobile App Development'],
    featured: true,
    sort_order: 2,
  },
  {
    slug: 'automotive',
    name: 'Automotive',
    short_description: 'Digital platforms for car care, service booking and vehicle businesses.',
    long_description:
      'Automotive service businesses live on bookings and trust. We build digital experiences that present services clearly, make doorstep or in-shop booking simple, and keep the operations behind those bookings organised — from service menus to customer follow-up.',
    services: ['Web Application Development', 'Website Development', 'AI Calling Agents'],
    featured: true,
    sort_order: 3,
  },
  {
    slug: 'restaurants',
    name: 'Restaurants & Food',
    short_description: 'Menus, ordering and delivery experiences for food businesses.',
    long_description:
      'For restaurants, digital ordering has to be fast, mobile-friendly and reliable during rush hours. We build menu-driven ordering experiences, delivery workflows and the admin tooling that keeps orders, items and availability under control.',
    services: ['E-commerce & Marketplaces', 'Mobile App Development', 'Website Development'],
    featured: false,
    sort_order: 4,
  },
  {
    slug: 'startups',
    name: 'Startups',
    short_description: 'From idea to first production release with a scope you can afford.',
    long_description:
      'Startups need to validate fast without building a monument. We help founders turn an idea into a scoped MVP — the smallest real product that can be tested with users — and then grow it in stages based on evidence, not guesses.',
    services: ['Web Application Development', 'Mobile App Development', 'Custom Software'],
    featured: false,
    sort_order: 5,
  },
  {
    slug: 'professional-services',
    name: 'Professional Services',
    short_description: 'Websites and systems for consultants, agencies and service firms.',
    long_description:
      'Professional services businesses sell expertise and trust. We build credible websites with clear service presentation and lead capture, plus the operational tools — booking, client portals, follow-up automation — that turn enquiries into engaged clients.',
    services: ['Website Development', 'AI Calling Agents', 'AI & Business Automation'],
    featured: false,
    sort_order: 6,
  },
  {
    slug: 'education',
    name: 'Education',
    short_description: 'Course platforms, learning experiences and education business tooling.',
    long_description:
      'Education products succeed on structure: content that is easy to follow, progress that is easy to track, and enrolment that is easy to complete. We build course platforms and learning experiences with those principles — and we run our own course platform, so we build from experience.',
    services: ['Web Application Development', 'Website Development', 'Custom Software'],
    featured: false,
    sort_order: 7,
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    short_description: 'Property listing platforms and lead-generation systems.',
    long_description:
      'Real estate moves on enquiries. We build listing platforms with search and filters that actually help buyers, plus lead capture and response automation so no enquiry goes cold while agents are in the field.',
    services: ['Web Application Development', 'Website Development', 'AI Calling Agents'],
    featured: false,
    sort_order: 8,
  },
];

/* ------------------------------------------------------------------ */
/* Technologies — only what this codebase and its projects verifiably  */
/* use (see package.json and the LocalGo / SparkX Expo builds)         */
/* ------------------------------------------------------------------ */

const TECHNOLOGIES = [
  { name: 'Next.js', category: 'Frontend', website_url: 'https://nextjs.org', sort_order: 1 },
  { name: 'React', category: 'Frontend', website_url: 'https://react.dev', sort_order: 2 },
  { name: 'React Native', category: 'Mobile', website_url: 'https://reactnative.dev', sort_order: 3 },
  { name: 'Expo', category: 'Mobile', website_url: 'https://expo.dev', sort_order: 4 },
  { name: 'TypeScript', category: 'Frontend', website_url: 'https://typescriptlang.org', sort_order: 5 },
  { name: 'Tailwind CSS', category: 'Frontend', website_url: 'https://tailwindcss.com', sort_order: 6 },
  { name: 'Node.js', category: 'Backend', website_url: 'https://nodejs.org', sort_order: 7 },
  { name: 'Supabase', category: 'Database', website_url: 'https://supabase.com', sort_order: 8 },
  { name: 'PostgreSQL', category: 'Database', website_url: 'https://postgresql.org', sort_order: 9 },
  { name: 'MapLibre GL', category: 'Frontend', website_url: 'https://maplibre.org', sort_order: 10 },
  { name: 'Vercel', category: 'Cloud & Infrastructure', website_url: 'https://vercel.com', sort_order: 11 },
];

/* ------------------------------------------------------------------ */
/* Homepage + site settings                                            */
/* ------------------------------------------------------------------ */

const HOMEPAGE = {
  hero: {
    badge: 'Technology • Software • AI',
    heading: 'We Build Digital Products That Move Businesses Forward.',
    highlighted: 'Apps. Software. Websites. AI. Built Around Your Business.',
    description:
      'YAIdigitals designs and develops powerful digital products for ambitious businesses—from high-performance websites and custom applications to scalable platforms and AI-powered automation.',
    primary_cta_text: 'Start Your Project',
    primary_cta_url: '/contact',
    secondary_cta_text: 'Explore Our Work',
    secondary_cta_url: '/work',
    below_cta: 'Strategy • Design • Development • Deployment • Support',
  },
  sections: [
    { key: 'work', enabled: true, sort_order: 1, eyebrow: 'SELECTED WORK', title: 'Real Products. Real Businesses. Real Engineering.', description: "We don't just design screens. We build digital systems designed to solve real business problems." },
    { key: 'services', enabled: true, sort_order: 2, eyebrow: 'WHAT WE BUILD', title: 'Technology Built Around Your Business', description: 'From an initial idea to production deployment, YAIdigitals helps businesses design, build and scale digital products.' },
    { key: 'industries', enabled: true, sort_order: 3, eyebrow: 'INDUSTRIES', title: 'Technology for Businesses That Want to Grow', description: 'Every industry has different workflows, customers and challenges. We build technology around those differences.' },
    { key: 'ai-calling', enabled: true, sort_order: 4, eyebrow: 'AI CALLING AGENTS', title: 'AI That Can Actually Talk to Your Customers.', description: 'YAIdigitals builds AI voice agents that can handle common business conversations, respond to enquiries, qualify leads, support bookings and route customers when human assistance is required.' },
    { key: 'technology', enabled: true, sort_order: 5, eyebrow: 'TECHNOLOGY', title: 'Modern Technology. Practical Engineering.', description: "We select technology based on the product's requirements—not simply because a framework is popular." },
    { key: 'process', enabled: true, sort_order: 6, eyebrow: 'HOW WE WORK', title: 'From Idea to Production', description: 'A structured development process keeps technology aligned with real business requirements.' },
    { key: 'why', enabled: true, sort_order: 7, eyebrow: 'WHY YAIDIGITALS', title: 'More Than a Development Vendor', description: '' },
    { key: 'testimonials', enabled: true, sort_order: 8, eyebrow: 'TESTIMONIALS', title: 'What Clients Say', description: '' },
    { key: 'insights', enabled: true, sort_order: 9, eyebrow: 'INSIGHTS', title: 'Thinking That Helps You Build Better', description: 'Practical writing on software, apps and AI for growing businesses.' },
    { key: 'faq', enabled: true, sort_order: 10, eyebrow: 'FAQ', title: 'Frequently Asked Questions', description: '' },
  ],
};

const SITE_SETTINGS = {
  company_name: 'YAIdigitals',
  contact_email: 'info@yaidigitals.com',
  contact_phone: '',
  whatsapp: '',
  address: '',
  business_hours: '',
  social: {
    instagram: 'https://instagram.com/yaidigitals_',
    facebook: 'https://facebook.com/yaidigitals',
    twitter: 'https://twitter.com/yaidigitals',
  },
  footer_description: 'Technology built around your business.',
  default_cta_text: 'Start a Project',
  default_cta_url: '/contact',
};

const SEO_SETTINGS = {
  site_name: 'YAIdigitals',
  title_template: '%s | YAIdigitals',
  default_title: 'YAIdigitals | Apps, Software, Websites & AI Solutions',
  default_description:
    'YAIdigitals designs and develops mobile apps, web applications, business websites, custom software and AI-powered solutions for growing businesses.',
  canonical_domain: 'https://www.yaidigitals.co.in',
  og_image: '',
  twitter_handle: '',
  google_site_verification: '',
  organization: {
    name: 'YAIdigitals',
    type: 'Organization',
    email: 'info@yaidigitals.com',
  },
};

/* ------------------------------------------------------------------ */

async function main() {
  const supabase = createServerAdminSupabase();
  let failures = 0;

  const step = async (label: string, fn: () => Promise<{ error: { message: string } | null }>) => {
    const { error } = await fn();
    if (error) {
      failures += 1;
      console.error(`✗ ${label}: ${error.message}`);
    } else {
      console.log(`✓ ${label}`);
    }
  };

  for (const s of SERVICES) {
    await step(`service: ${s.slug}`, () => supabase.from('services').upsert(s, { onConflict: 'slug' }));
  }

  for (const p of PROJECTS) {
    await step(`project: ${p.slug}`, () => supabase.from('projects').upsert(p, { onConflict: 'slug' }));
  }

  // Legacy product-store "projects" predate the company repositioning. Draft
  // them (data preserved, reversible) so /work stays focused on case studies.
  await step('legacy projects → draft', async () => {
    const { error } = await supabase
      .from('projects')
      .update({ status: 'draft', featured: false })
      .in('slug', ['viral-reels-store-platform', 'course-platform', 'viral-reels-product-line']);
    return { error };
  });

  for (const i of INDUSTRIES) {
    await step(`industry: ${i.slug}`, () => supabase.from('industries').upsert(i, { onConflict: 'slug' }));
  }

  await step('technologies', () => supabase.from('technologies').upsert(TECHNOLOGIES, { onConflict: 'name' }));

  await step('settings: homepage', () =>
    supabase.from('settings').upsert({ key: 'homepage', value: JSON.stringify(HOMEPAGE) }, { onConflict: 'key' })
  );
  await step('settings: site', () =>
    supabase.from('settings').upsert({ key: 'site', value: JSON.stringify(SITE_SETTINGS) }, { onConflict: 'key' })
  );
  await step('settings: seo', () =>
    supabase.from('settings').upsert({ key: 'seo', value: JSON.stringify(SEO_SETTINGS) }, { onConflict: 'key' })
  );

  if (failures > 0) {
    console.error(`\n${failures} step(s) failed — check that migration 202608300001_brand_cms.sql has been applied.`);
    process.exit(1);
  }
  console.log('\nContent seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
