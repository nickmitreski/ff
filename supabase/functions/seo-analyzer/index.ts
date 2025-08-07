import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

// API Keys - These should be set in Vercel environment variables
const SERPAPI_KEY = Deno.env.get("SERPAPI_KEY") || "29aed9b57f5e32c78ba90384d57642ad6644c606f06a79a58046d5834335017b";
const PAGESPEED_API_KEY = Deno.env.get("PAGESPEED_API_KEY") || "AIzaSyAlh1RwnhNPyS-9nFdyO9Aieabd_EQgcP8";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "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";

interface PageSpeedMetrics {
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

interface SerpResult {
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

interface MetaTagsData {
  title: {
    content: string;
    length: number;
    status: 'good' | 'warning' | 'error';
    recommendations: string[];
  };
  description: {
    content: string;
    length: number;
    status: 'good' | 'warning' | 'error';
    recommendations: string[];
  };
  openGraph: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    status: 'good' | 'warning' | 'error';
  };
  twitterCard: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
    status: 'good' | 'warning' | 'error';
  };
  robots: {
    content: string;
    status: 'good' | 'warning' | 'error';
  };
}

interface MobileFriendlinessData {
  score: number;
  status: 'good' | 'warning' | 'error';
  issues: Array<{
    type: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  viewport: {
    configured: boolean;
    content?: string;
  };
  touchTargets: {
    adequate: boolean;
    issues: number;
  };
  textReadability: {
    adequate: boolean;
    tooSmallText: number;
  };
}

interface SecurityData {
  ssl: {
    enabled: boolean;
    validCertificate: boolean;
    expiryDate?: string;
    issuer?: string;
  };
  mixedContent: {
    issues: number;
    details: string[];
  };
  securityHeaders: {
    contentSecurityPolicy: boolean;
    strictTransportSecurity: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
  };
  score: number;
}

interface ContentAnalysisData {
  wordCount: number;
  readabilityScore: number;
  headingStructure: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    missingH1: boolean;
    multipleH1: boolean;
  };
  images: {
    total: number;
    withAltText: number;
    oversized: number;
  };
  internalLinks: number;
  externalLinks: number;
  keywordDensity: Array<{
    keyword: string;
    count: number;
    density: number;
  }>;
}

const fetchPageSpeedData = async (url: string): Promise<PageSpeedMetrics> => {
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

const fetchSerpData = async (domain: string): Promise<SerpResult[]> => {
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
      competitors: []
    }));
  } catch (error) {
    console.error('SERP API error:', error);
    return [];
  }
};

const analyzeMetaTags = async (url: string): Promise<MetaTagsData> => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Basic meta tag analysis
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
    
    const title = titleMatch ? titleMatch[1] : '';
    const description = descriptionMatch ? descriptionMatch[1] : '';
    const ogTitle = ogTitleMatch ? ogTitleMatch[1] : '';
    const ogDesc = ogDescMatch ? ogDescMatch[1] : '';
    const robots = robotsMatch ? robotsMatch[1] : '';

    return {
      title: {
        content: title,
        length: title.length,
        status: title.length > 0 && title.length <= 60 ? 'good' : title.length === 0 ? 'error' : 'warning',
        recommendations: title.length === 0 ? ['Add a title tag'] : 
                       title.length > 60 ? ['Title is too long'] : []
      },
      description: {
        content: description,
        length: description.length,
        status: description.length > 0 && description.length <= 160 ? 'good' : description.length === 0 ? 'error' : 'warning',
        recommendations: description.length === 0 ? ['Add a meta description'] : 
                        description.length > 160 ? ['Description is too long'] : []
      },
      openGraph: {
        title: ogTitle,
        description: ogDesc,
        status: ogTitle && ogDesc ? 'good' : 'warning'
      },
      twitterCard: {
        status: 'good'
      },
      robots: {
        content: robots,
        status: robots ? 'good' : 'warning'
      }
    };
  } catch (error) {
    console.error('Meta tags analysis error:', error);
    throw error;
  }
};

const analyzeMobileFriendliness = async (url: string): Promise<MobileFriendlinessData> => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Basic mobile analysis
    const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']+)["']/i);
    const hasViewport = !!viewportMatch;
    
    // Simple scoring based on viewport
    const score = hasViewport ? 80 : 40;
    
    return {
      score,
      status: score >= 80 ? 'good' : score >= 60 ? 'warning' : 'error',
      issues: hasViewport ? [] : [{
        type: 'Missing Viewport',
        description: 'No viewport meta tag found',
        severity: 'high'
      }],
      viewport: {
        configured: hasViewport,
        content: viewportMatch ? viewportMatch[1] : undefined
      },
      touchTargets: {
        adequate: true,
        issues: 0
      },
      textReadability: {
        adequate: true,
        tooSmallText: 0
      }
    };
  } catch (error) {
    console.error('Mobile analysis error:', error);
    throw error;
  }
};

const analyzeSecurityFeatures = async (url: string): Promise<SecurityData> => {
  try {
    const response = await fetch(url);
    const headers = response.headers;
    
    const ssl = {
      enabled: url.startsWith('https://'),
      validCertificate: url.startsWith('https://')
    };
    
    const securityHeaders = {
      contentSecurityPolicy: !!headers.get('content-security-policy'),
      strictTransportSecurity: !!headers.get('strict-transport-security'),
      xFrameOptions: !!headers.get('x-frame-options'),
      xContentTypeOptions: !!headers.get('x-content-type-options')
    };
    
    const score = Object.values(securityHeaders).filter(Boolean).length * 25;
    
    return {
      ssl,
      mixedContent: {
        issues: 0,
        details: []
      },
      securityHeaders,
      score: Math.min(score, 100)
    };
  } catch (error) {
    console.error('Security analysis error:', error);
    throw error;
  }
};

const analyzeContent = async (url: string): Promise<ContentAnalysisData> => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Basic content analysis
    const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(' ').length;
    
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
    const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
    const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;
    
    const imgCount = (html.match(/<img[^>]*>/gi) || []).length;
    const imgWithAlt = (html.match(/<img[^>]*alt=["'][^"']+["'][^>]*>/gi) || []).length;
    
    return {
      wordCount,
      readabilityScore: Math.min(wordCount / 10, 100),
      headingStructure: {
        h1Count,
        h2Count,
        h3Count,
        missingH1: h1Count === 0,
        multipleH1: h1Count > 1
      },
      images: {
        total: imgCount,
        withAltText: imgWithAlt,
        oversized: 0
      },
      internalLinks: (html.match(/href=["'][^"']*["']/gi) || []).length,
      externalLinks: (html.match(/href=["']https?:\/\/[^"']*["']/gi) || []).length,
      keywordDensity: []
    };
  } catch (error) {
    console.error('Content analysis error:', error);
    throw error;
  }
};

const generateAIRecommendations = async (
  url: string, 
  pageSpeedData: PageSpeedMetrics, 
  serpData: SerpResult[]
): Promise<string[]> => {
  try {
    const prompt = `
Analyze this website's SEO performance and provide 5 actionable recommendations:

URL: ${url}
PageSpeed Score: ${pageSpeedData.score}/100
SERP Results: ${serpData.length} organic results

Provide 5 specific, actionable recommendations to improve SEO performance.
Format each recommendation as a clear, actionable statement.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate AI recommendations');
    }

    const recommendations = data.choices[0]?.message?.content
      ?.split('\n')
      ?.filter((line: string) => line.trim().length > 0)
      ?.slice(0, 5) || [];

    return recommendations;
  } catch (error) {
    console.error('AI recommendations error:', error);
    return [
      'Optimize page loading speed',
      'Improve meta descriptions',
      'Add structured data markup',
      'Enhance mobile user experience',
      'Create high-quality, relevant content'
    ];
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()

    if (!url) {
      throw new Error('URL is required')
    }

    // Run all analyses in parallel
    const [
      pageSpeedData,
      serpData,
      metaTags,
      mobileFriendliness,
      security,
      content
    ] = await Promise.all([
      fetchPageSpeedData(url),
      fetchSerpData(url),
      analyzeMetaTags(url),
      analyzeMobileFriendliness(url),
      analyzeSecurityFeatures(url),
      analyzeContent(url)
    ]);

    // Generate AI recommendations
    const aiRecommendations = await generateAIRecommendations(url, pageSpeedData, serpData);

    return new Response(
      JSON.stringify({
        pageSpeedData,
        serpData,
        metaTags,
        mobileFriendliness,
        security,
        content,
        aiRecommendations
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 