// API Configuration
const SERPAPI_KEY = "29aed9b57f5e32c78ba90384d57642ad6644c606f06a79a58046d5834335017b";
const PAGESPEED_API_KEY = "AIzaSyAlh1RwnhNPyS-9nFdyO9Aieabd_EQgcP8";
const OPENAI_API_KEY = "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";

export interface PageSpeedMetrics {
  score: number;
  metrics: {
    fcp: number;
    lcp: number;
    cls: number;
    fid: number;
  };
  opportunities: Array<{
    title: string;
    description: string;
    savings: string;
  }>;
}

export interface SerpResult {
  position: number;
  keyword: string;
  url: string;
  title: string;
  competitors: Array<{
    position: number;
    domain: string;
    title: string;
  }>;
}

export const fetchPageSpeedData = async (url: string): Promise<PageSpeedMetrics> => {
  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${PAGESPEED_API_KEY}&strategy=desktop`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch PageSpeed data');
    }

    const lighthouseResult = data.lighthouseResult;
    const audits = lighthouseResult.audits;
    
    // Extract core metrics
    const score = Math.round(lighthouseResult.categories.performance.score * 100);
    
    const metrics = {
      fcp: parseFloat(audits['first-contentful-paint']?.displayValue?.replace('s', '') || '0'),
      lcp: parseFloat(audits['largest-contentful-paint']?.displayValue?.replace('s', '') || '0'),
      cls: parseFloat(audits['cumulative-layout-shift']?.displayValue || '0'),
      fid: parseFloat(audits['max-potential-fid']?.displayValue?.replace('ms', '') || '0') / 1000,
    };

    // Extract opportunities
    const opportunities = Object.entries(audits)
      .filter(([key, audit]: [string, any]) => 
        audit.details?.type === 'opportunity' && audit.numericValue > 0
      )
      .map(([key, audit]: [string, any]) => ({
        title: audit.title,
        description: audit.description,
        savings: audit.displayValue || 'Potential improvement',
      }))
      .slice(0, 10);

    return {
      score,
      metrics,
      opportunities,
    };
  } catch (error) {
    console.error('PageSpeed API error:', error);
    throw error;
  }
};

export const fetchSerpData = async (domain: string): Promise<SerpResult[]> => {
  try {
    // Extract domain from URL
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    const apiUrl = `https://serpapi.com/search.json?engine=google&q=site:${cleanDomain}&api_key=${SERPAPI_KEY}&num=10`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch SERP data');
    }

    const organicResults = data.organic_results || [];
    
    return organicResults.map((result: any, index: number) => ({
      position: result.position || index + 1,
      keyword: result.snippet || 'N/A',
      url: result.link,
      title: result.title,
      competitors: [], // Would need additional API calls for competitor analysis
    }));
  } catch (error) {
    console.error('SERP API error:', error);
    throw error;
  }
};

export const generateAIRecommendations = async (
  url: string, 
  pageSpeedData: PageSpeedMetrics, 
  serpData: SerpResult[]
): Promise<string[]> => {
  try {
    const prompt = `Analyze this website's SEO performance and provide 5 specific, actionable recommendations:

URL: ${url}
PageSpeed Score: ${pageSpeedData.score}/100
Core Web Vitals:
- First Contentful Paint: ${pageSpeedData.metrics.fcp}s
- Largest Contentful Paint: ${pageSpeedData.metrics.lcp}s
- Cumulative Layout Shift: ${pageSpeedData.metrics.cls}

Top Performance Issues:
${pageSpeedData.opportunities.slice(0, 3).map(opp => `- ${opp.title}: ${opp.description}`).join('\n')}

Search Results Found: ${serpData.length} pages indexed

Please provide 5 specific, actionable SEO recommendations focusing on technical SEO, performance optimization, and search visibility. Each recommendation should be one sentence and focus on immediate actions the website owner can take.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert SEO consultant. Provide specific, actionable recommendations in a numbered list format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate AI recommendations');
    }

    const recommendations = data.choices[0].message.content
      .split('\n')
      .filter((line: string) => line.trim() && /^\d+\./.test(line.trim()))
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim());

    return recommendations.slice(0, 5);
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Return fallback recommendations
    return [
      "Optimize images by compressing them and using next-gen formats like WebP",
      "Implement lazy loading for images and non-critical resources",
      "Minify and compress CSS, JavaScript, and HTML files",
      "Enable browser caching with appropriate cache headers",
      "Improve server response time by optimizing database queries and using a CDN"
    ];
  }
};

export const performFullSeoAudit = async (url: string) => {
  const results = {
    pageSpeedData: null as PageSpeedMetrics | null,
    serpData: [] as SerpResult[],
    aiRecommendations: [] as string[],
    errors: [] as string[],
  };

  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error('Please enter a valid URL (e.g., https://example.com)');
  }

  // Fetch PageSpeed data
  try {
    results.pageSpeedData = await fetchPageSpeedData(url);
  } catch (error) {
    results.errors.push(`PageSpeed analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Fetch SERP data
  try {
    results.serpData = await fetchSerpData(url);
  } catch (error) {
    results.errors.push(`SERP analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Generate AI recommendations
  if (results.pageSpeedData) {
    try {
      results.aiRecommendations = await generateAIRecommendations(
        url, 
        results.pageSpeedData, 
        results.serpData
      );
    } catch (error) {
      results.errors.push(`AI recommendations failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return results;
};