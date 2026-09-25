import { BASE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

const content = `# YAIdigitals

> YAIdigitals designs and develops websites, mobile applications, custom software, e-commerce products, AI automation and AI calling agents for startups and growing businesses.

## Canonical website

- ${BASE_URL}/

## Company

- [About YAIdigitals](${BASE_URL}/about)
- [Contact YAIdigitals](${BASE_URL}/contact)

## Services

- [All development services](${BASE_URL}/services)
- [Website development](${BASE_URL}/services/website-development)
- [Web application development](${BASE_URL}/services/web-application-development)
- [Mobile app development](${BASE_URL}/services/mobile-app-development)
- [Custom software development](${BASE_URL}/services/custom-software)
- [AI automation](${BASE_URL}/services/ai-automation)
- [AI calling agents](${BASE_URL}/services/ai-calling-agents)
- [E-commerce development](${BASE_URL}/services/ecommerce)

## Evidence and writing

- [Case studies](${BASE_URL}/work)
- [Insights](${BASE_URL}/insights)
`;

export function GET() {
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
