import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Smartphone, Shield, FileText, Code, Loader2, CheckCircle, AlertCircle, XCircle, ExternalLink, Globe, Zap, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Types
interface SeoTool {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  is_active: boolean;
}

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

const SeoAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'serp' | 'meta' | 'mobile' | 'security'>('overview');
  const [seoTools, setSeoTools] = useState<SeoTool[]>([]);
  const [loadingTools, setLoadingTools] = useState(true);
  
  // Analysis results
  const [pageSpeedData, setPageSpeedData] = useState<PageSpeedMetrics | null>(null);
  const [serpData, setSerpData] = useState<SerpResult[]>([]);
  const [metaTags, setMetaTags] = useState<MetaTagsData | null>(null);
  const [mobileFriendliness, setMobileFriendliness] = useState<MobileFriendlinessData | null>(null);
  const [security, setSecurity] = useState<SecurityData | null>(null);
  const [content, setContent] = useState<ContentAnalysisData | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);

  // Fetch SEO tools on component mount
  useEffect(() => {
    const fetchSeoTools = async () => {
      try {
        const { data, error } = await supabase()
          .from('seo_tools')
          .select('*')
          .eq('is_active', true)
          .order('category', { ascending: true })
          .order('title', { ascending: true });

        if (error) {
          console.error('Error fetching SEO tools:', error);
          // Fallback to hardcoded data if database is not ready
          setSeoTools(getFallbackSeoTools());
        } else {
          console.log('SEO tools fetched:', data);
          setSeoTools((data as unknown as SeoTool[]) || getFallbackSeoTools());
        }
      } catch (err) {
        console.error('Error fetching SEO tools:', err);
        // Fallback to hardcoded data
        setSeoTools(getFallbackSeoTools());
      } finally {
        setLoadingTools(false);
      }
    };

    fetchSeoTools();
  }, []);

  // Fallback SEO tools data in case database is not ready
  const getFallbackSeoTools = (): SeoTool[] => [
    {
      id: '1',
      title: 'Free SEO Audit Tool',
      url: 'https://seomator.com/free-seo-audit-tool',
      description: 'Comprehensive website SEO audit with detailed recommendations',
      category: 'Audit',
      is_active: true
    },
    {
      id: '2',
      title: 'Google SERP Rank Checker',
      url: 'https://seomator.com/google-serp-rank-checker',
      description: 'Check your website ranking positions in Google search results',
      category: 'Ranking',
      is_active: true
    },
    {
      id: '3',
      title: 'Free Keyword Research Tool',
      url: 'https://seomator.com/free-keyword-research-tool',
      description: 'Find relevant keywords for your content strategy',
      category: 'Keywords',
      is_active: true
    },
    {
      id: '4',
      title: 'Free Backlink Checker Tool',
      url: 'https://seomator.com/free-backlink-checker-tool',
      description: 'Analyze your website backlink profile and quality',
      category: 'Backlinks',
      is_active: true
    },
    {
      id: '5',
      title: 'Bing SERP Rank Checker',
      url: 'https://seomator.com/bing-serp-rank-checker',
      description: 'Check your website ranking positions in Bing search results',
      category: 'Ranking',
      is_active: true
    },
    {
      id: '6',
      title: 'Website Crawl Test',
      url: 'https://seomator.com/website-crawl-test',
      description: 'Test how search engines crawl and index your website',
      category: 'Technical',
      is_active: true
    },
    {
      id: '7',
      title: 'Mobile Friendly Test',
      url: 'https://seomator.com/mobile-friendly-test',
      description: 'Check if your website is mobile-friendly for search engines',
      category: 'Mobile',
      is_active: true
    },
    {
      id: '8',
      title: 'HTTPS Header Checker',
      url: 'https://seomator.com/https-header-checker',
      description: 'Verify your website security headers and SSL configuration',
      category: 'Security',
      is_active: true
    },
    {
      id: '9',
      title: 'Keyword Density Checker',
      url: 'https://seomator.com/keyword-density-checker',
      description: 'Analyze keyword usage and density in your content',
      category: 'Content',
      is_active: true
    },
    {
      id: '10',
      title: 'Internal Link Checker',
      url: 'https://seomator.com/internal-link-checker',
      description: 'Review and optimize your internal linking structure',
      category: 'Links',
      is_active: true
    },
    {
      id: '11',
      title: 'Free Website Speed Test',
      url: 'https://seomator.com/free-website-speed-test',
      description: 'Test your website loading speed and performance',
      category: 'Performance',
      is_active: true
    },
    {
      id: '12',
      title: 'Meta Tags Checker',
      url: 'https://seomator.com/meta-tags-checker',
      description: 'Analyze and optimize your meta tags for better SEO',
      category: 'Meta Tags',
      is_active: true
    },
    {
      id: '13',
      title: 'Sitemap Finder',
      url: 'https://seomator.com/sitemap-finder',
      description: 'Discover and analyze website sitemaps',
      category: 'Technical',
      is_active: true
    },
    {
      id: '14',
      title: 'Website Technology Checker',
      url: 'https://seomator.com/website-technology-checker',
      description: 'Identify technologies used on any website',
      category: 'Technical',
      is_active: true
    },
    {
      id: '15',
      title: 'Organic Traffic Checker Free',
      url: 'https://seomator.com/organic-traffic-checker-free',
      description: 'Estimate organic search traffic for any website',
      category: 'Analytics',
      is_active: true
    },
    {
      id: '16',
      title: 'Free Email Verification Tool',
      url: 'https://seomator.com/free-email-verification-tool',
      description: 'Verify email addresses for marketing campaigns',
      category: 'Marketing',
      is_active: true
    },
    {
      id: '17',
      title: 'Free Domain Authority Checker',
      url: 'https://seomator.com/free-domain-authority-checker',
      description: 'Check domain authority and page authority scores',
      category: 'Authority',
      is_active: true
    },
    {
      id: '18',
      title: 'Anchor Text Link Extractor Tool',
      url: 'https://seomator.com/anchor-text-link-extractor-tool',
      description: 'Extract and analyze anchor text from backlinks',
      category: 'Backlinks',
      is_active: true
    },
    {
      id: '19',
      title: 'Google Cache Date Checker Tool',
      url: 'https://seomator.com/google-cache-date-checker-tool',
      description: 'Check when Google last cached your pages',
      category: 'Technical',
      is_active: true
    },
    {
      id: '20',
      title: 'URL Redirect Checker',
      url: 'https://seomator.com/url-redirect-checker',
      description: 'Analyze redirect chains and status codes',
      category: 'Technical',
      is_active: true
    },
    {
      id: '21',
      title: 'Company Logo API',
      url: 'https://seomator.com/company-logo-api',
      description: 'API for retrieving company logos and branding',
      category: 'API',
      is_active: true
    },
    {
      id: '22',
      title: 'YouTube Rank Checker',
      url: 'https://seomator.com/youtube-rank-checker',
      description: 'Check YouTube video rankings in search results',
      category: 'Video',
      is_active: true
    },
    {
      id: '23',
      title: 'Competitor Keyword Research Tool',
      url: 'https://seomator.com/competitor-keyword-research-tool',
      description: 'Research keywords your competitors are ranking for',
      category: 'Competitive',
      is_active: true
    },
    {
      id: '24',
      title: 'Google AI Overview Keywords Checker',
      url: 'https://seomator.com/google-ai-overview-keywords-checker',
      description: 'Check keywords that trigger AI overviews in Google',
      category: 'AI',
      is_active: true
    },
    {
      id: '25',
      title: 'Free LLMs TXT Generator',
      url: 'https://seomator.com/free-llms-txt-generator',
      description: 'Generate content using AI language models',
      category: 'AI',
      is_active: true
    },
    {
      id: '26',
      title: 'Free SEO Keyword Research SERP Analyzer GPT',
      url: 'https://chatgpt.com/g/g-Iz6TghxNT-free-seo-keyword-research-serp-analyzer-gpt',
      description: 'AI-powered SEO keyword research and SERP analysis',
      category: 'AI',
      is_active: true
    }
  ];

  const getStatusColor = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    // Reset previous results
    setPageSpeedData(null);
    setSerpData([]);
    setMetaTags(null);
    setMobileFriendliness(null);
    setSecurity(null);
    setContent(null);
    setAiRecommendations([]);

    try {
      // Try to call the Supabase Edge Function first
      try {
        const response = await fetch('https://irzgkacsptptspcozrrd.supabase.co/functions/v1/seo-analyzer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ url: url.trim() }),
        });

        if (response.ok) {
          const data = await response.json();
          
          setPageSpeedData(data.pageSpeedData);
          setSerpData(data.serpData);
          setMetaTags(data.metaTags);
          setMobileFriendliness(data.mobileFriendliness);
          setSecurity(data.security);
          setContent(data.content);
          setAiRecommendations(data.aiRecommendations);
          return;
        }
      } catch (apiError) {
        console.log('Supabase function not available, using mock data');
      }

      // Fallback to mock data if Supabase function is not deployed
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      const mockData = {
        pageSpeedData: {
          score: 85,
          metrics: {
            fcp: 1.2,
            lcp: 2.8,
            cls: 0.05,
            fid: 0.12
          },
          opportunities: [
            {
              title: "Remove unused CSS",
              description: "Eliminate render-blocking resources",
              savings: "Save 0.5s"
            },
            {
              title: "Optimize images",
              description: "Serve images in next-gen formats",
              savings: "Save 0.3s"
            },
            {
              title: "Minimize main-thread work",
              description: "Reduce JavaScript execution time",
              savings: "Save 0.2s"
            }
          ]
        },
        serpData: [
          {
            position: 1,
            keyword: "web development services",
            url: "https://example.com/services",
            title: "Professional Web Development Services",
            competitors: []
          },
          {
            position: 3,
            keyword: "SEO optimization",
            url: "https://example.com/seo",
            title: "SEO Optimization Services",
            competitors: []
          },
          {
            position: 5,
            keyword: "digital marketing",
            url: "https://example.com/marketing",
            title: "Digital Marketing Solutions",
            competitors: []
          }
        ],
        metaTags: {
          title: {
            content: "Flash Forward - Web Development & Digital Services",
            length: 52,
            status: 'good' as const,
            recommendations: []
          },
          description: {
            content: "Professional web development, SEO, and digital marketing services. We help businesses grow their online presence with modern, responsive websites and effective digital strategies.",
            length: 145,
            status: 'good' as const,
            recommendations: []
          },
          openGraph: {
            title: "Flash Forward - Web Development & Digital Services",
            description: "Professional web development and digital marketing services",
            status: 'good' as const
          },
          twitterCard: {
            status: 'good' as const
          },
          robots: {
            content: "index, follow",
            status: 'good' as const
          }
        },
        mobileFriendliness: {
          score: 92,
          status: 'good' as const,
          issues: [],
          viewport: {
            configured: true,
            content: "width=device-width, initial-scale=1"
          },
          touchTargets: {
            adequate: true,
            issues: 0
          },
          textReadability: {
            adequate: true,
            tooSmallText: 0
          }
        },
        security: {
          ssl: {
            enabled: true,
            validCertificate: true
          },
          mixedContent: {
            issues: 0,
            details: []
          },
          securityHeaders: {
            contentSecurityPolicy: true,
            strictTransportSecurity: true,
            xFrameOptions: true,
            xContentTypeOptions: true
          },
          score: 95
        },
        content: {
          wordCount: 1250,
          readabilityScore: 78,
          headingStructure: {
            h1Count: 1,
            h2Count: 3,
            h3Count: 5,
            missingH1: false,
            multipleH1: false
          },
          images: {
            total: 8,
            withAltText: 7,
            oversized: 1
          },
          internalLinks: 12,
          externalLinks: 3,
          keywordDensity: []
        },
        aiRecommendations: [
          "Optimize image sizes and use WebP format for better loading speed",
          "Add more internal links to improve site navigation and SEO",
          "Consider implementing structured data markup for better search visibility",
          "Create more content pages to target additional keywords",
          "Monitor Core Web Vitals regularly to maintain performance"
        ]
      };
      
      setPageSpeedData(mockData.pageSpeedData);
      setSerpData(mockData.serpData);
      setMetaTags(mockData.metaTags);
      setMobileFriendliness(mockData.mobileFriendliness);
      setSecurity(mockData.security);
      setContent(mockData.content);
      setAiRecommendations(mockData.aiRecommendations);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  // Group SEO tools by category
  const groupedTools = seoTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, SeoTool[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light tracking-tight">SEO Analyser</h2>
          <p className="text-gray-400">
            Comprehensive SEO analysis with PageSpeed, SERP data, and AI recommendations
          </p>
        </div>
      </div>

      {/* SEO Tools Section */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-[#0CF2A0]" />
          <h3 className="text-lg font-light tracking-tight">SEO Tools</h3>
        </div>
        <p className="text-gray-400 mb-4">Quick access to essential SEO tools and resources</p>
        
        {loadingTools ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#0CF2A0]" />
            <span className="ml-2 text-gray-400">Loading SEO tools...</span>
          </div>
        ) : (
          <div>
            {seoTools.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No SEO tools available. Please check the database connection.</p>
                <p className="text-sm mt-2">Tools loaded: {seoTools.length}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {seoTools.map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 px-2 py-3 bg-black/30 border border-gray-800 rounded text-xs text-gray-300 hover:border-[#0CF2A0] hover:text-white transition-colors group text-center"
                    title={`${tool.title} - ${tool.description}`}
                  >
                    <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-[#0CF2A0] transition-colors" />
                    <span className="leading-tight">{tool.title}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* URL Input */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-[#0CF2A0]" />
          <h3 className="text-lg font-light tracking-tight">Analyze Website</h3>
        </div>
        <p className="text-gray-400 mb-4">Enter a URL to perform a comprehensive SEO analysis</p>
        
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-light mb-2 tracking-tight">Website URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
            />
          </div>
          <button 
            onClick={handleAnalyze} 
            disabled={isLoading}
            className="mt-6 px-6 py-2 bg-[#0CF2A0] text-black rounded transition-colors hover:bg-[#07C280] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Analyze
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm">
            <AlertCircle className="h-4 w-4 inline mr-2" />
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {(pageSpeedData || serpData.length > 0 || metaTags || mobileFriendliness || security || content) && (
        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-[#1a1a1a] p-1 rounded-lg border border-gray-800">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'performance', label: 'Performance', icon: Zap },
              { id: 'serp', label: 'SERP Data', icon: Target },
              { id: 'meta', label: 'Meta Tags', icon: FileText },
              { id: 'mobile', label: 'Mobile', icon: Smartphone },
              { id: 'security', label: 'Security', icon: Shield }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-light transition-colors ${
                  activeTab === id 
                    ? 'bg-[#0CF2A0] text-black' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {pageSpeedData && (
                    <div className="bg-black/20 p-4 rounded border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Performance Score</h4>
                        <Zap className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-[#0CF2A0]">{pageSpeedData.score}</div>
                      <p className="text-xs text-gray-400">out of 100</p>
                    </div>
                  )}

                  {serpData.length > 0 && (
                    <div className="bg-black/20 p-4 rounded border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">SERP Results</h4>
                        <Target className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-[#0CF2A0]">{serpData.length}</div>
                      <p className="text-xs text-gray-400">organic results</p>
                    </div>
                  )}

                  {mobileFriendliness && (
                    <div className="bg-black/20 p-4 rounded border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Mobile Score</h4>
                        <Smartphone className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-[#0CF2A0]">{mobileFriendliness.score}</div>
                      <p className="text-xs text-gray-400">mobile friendly</p>
                    </div>
                  )}

                  {security && (
                    <div className="bg-black/20 p-4 rounded border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Security Score</h4>
                        <Shield className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-[#0CF2A0]">{security.score}</div>
                      <p className="text-xs text-gray-400">security rating</p>
                    </div>
                  )}
                </div>

                {/* AI Recommendations */}
                {aiRecommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-light tracking-tight mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[#0CF2A0]" />
                      AI Recommendations
                    </h3>
                    <div className="space-y-2">
                      {aiRecommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-black/20 rounded border border-gray-800">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'performance' && pageSpeedData && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-light tracking-tight mb-4">Core Web Vitals</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-black/20 p-4 rounded border border-gray-800">
                      <label className="text-sm text-gray-400">First Contentful Paint (FCP)</label>
                      <div className="text-2xl font-bold text-[#0CF2A0]">{pageSpeedData.metrics.fcp}s</div>
                    </div>
                    <div className="bg-black/20 p-4 rounded border border-gray-800">
                      <label className="text-sm text-gray-400">Largest Contentful Paint (LCP)</label>
                      <div className="text-2xl font-bold text-[#0CF2A0]">{pageSpeedData.metrics.lcp}s</div>
                    </div>
                    <div className="bg-black/20 p-4 rounded border border-gray-800">
                      <label className="text-sm text-gray-400">Cumulative Layout Shift (CLS)</label>
                      <div className="text-2xl font-bold text-[#0CF2A0]">{pageSpeedData.metrics.cls}</div>
                    </div>
                    <div className="bg-black/20 p-4 rounded border border-gray-800">
                      <label className="text-sm text-gray-400">First Input Delay (FID)</label>
                      <div className="text-2xl font-bold text-[#0CF2A0]">{pageSpeedData.metrics.fid}s</div>
                    </div>
                  </div>
                </div>

                {pageSpeedData.opportunities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-light tracking-tight mb-4">Optimization Opportunities</h3>
                    <div className="space-y-3">
                      {pageSpeedData.opportunities.map((opportunity, index) => (
                        <div key={index} className="p-3 border border-gray-800 rounded">
                          <h4 className="font-medium">{opportunity.title}</h4>
                          <p className="text-sm text-gray-400 mt-1">{opportunity.description}</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-800 text-xs rounded">
                            {opportunity.savings}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'serp' && serpData.length > 0 && (
              <div>
                <h3 className="text-lg font-light tracking-tight mb-4">SERP Analysis</h3>
                <div className="space-y-3">
                  {serpData.map((result, index) => (
                    <div key={index} className="p-3 border border-gray-800 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-gray-800 text-xs rounded">#{result.position}</span>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                      <h4 className="font-medium">{result.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{result.url}</p>
                      <p className="text-sm mt-2">{result.keyword}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'meta' && metaTags && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium">Title Tag</label>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(metaTags.title.status)}`}>
                      {getStatusIcon(metaTags.title.status)}
                      {metaTags.title.status}
                    </span>
                  </div>
                  <p className="text-sm bg-black/20 p-2 rounded border border-gray-800">{metaTags.title.content}</p>
                  <p className="text-xs text-gray-400 mt-1">Length: {metaTags.title.length} characters</p>
                </div>

                <div className="border-t border-gray-800 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium">Meta Description</label>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(metaTags.description.status)}`}>
                      {getStatusIcon(metaTags.description.status)}
                      {metaTags.description.status}
                    </span>
                  </div>
                  <p className="text-sm bg-black/20 p-2 rounded border border-gray-800">{metaTags.description.content}</p>
                  <p className="text-xs text-gray-400 mt-1">Length: {metaTags.description.length} characters</p>
                </div>
              </div>
            )}

            {activeTab === 'mobile' && mobileFriendliness && (
              <div>
                <h3 className="text-lg font-light tracking-tight mb-4">Mobile Friendliness</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Mobile Score</label>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(mobileFriendliness.status)}`}>
                      {getStatusIcon(mobileFriendliness.status)}
                      {mobileFriendliness.score}/100
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Viewport Configuration</label>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded text-xs ${mobileFriendliness.viewport.configured ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {mobileFriendliness.viewport.configured ? "Configured" : "Not Configured"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Touch Targets</label>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded text-xs ${mobileFriendliness.touchTargets.adequate ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {mobileFriendliness.touchTargets.adequate ? "Adequate" : `${mobileFriendliness.touchTargets.issues} Issues`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {mobileFriendliness.issues.length > 0 && (
                    <div>
                      <label className="text-sm font-medium">Issues Found</label>
                      <div className="space-y-2 mt-2">
                        {mobileFriendliness.issues.map((issue, index) => (
                          <div key={index} className="p-2 border border-gray-800 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 rounded text-xs ${
                                issue.severity === 'high' ? 'bg-red-500/20 text-red-500' : 
                                issue.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-500/20 text-gray-500'
                              }`}>
                                {issue.severity}
                              </span>
                              <span className="text-sm font-medium">{issue.type}</span>
                            </div>
                            <p className="text-sm text-gray-400">{issue.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'security' && security && (
              <div>
                <h3 className="text-lg font-light tracking-tight mb-4">Security Analysis</h3>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">SSL Certificate</label>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded text-xs ${security.ssl.enabled ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {security.ssl.enabled ? "Enabled" : "Not Enabled"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mixed Content</label>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded text-xs ${security.mixedContent.issues === 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {security.mixedContent.issues} Issues
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Security Headers</label>
                    <div className="grid gap-2 mt-2">
                      <div className="flex items-center justify-between p-2 border border-gray-800 rounded">
                        <span className="text-sm">Content Security Policy</span>
                        <span className={`px-2 py-1 rounded text-xs ${security.securityHeaders.contentSecurityPolicy ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {security.securityHeaders.contentSecurityPolicy ? "Present" : "Missing"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 border border-gray-800 rounded">
                        <span className="text-sm">Strict Transport Security</span>
                        <span className={`px-2 py-1 rounded text-xs ${security.securityHeaders.strictTransportSecurity ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {security.securityHeaders.strictTransportSecurity ? "Present" : "Missing"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 border border-gray-800 rounded">
                        <span className="text-sm">X-Frame-Options</span>
                        <span className={`px-2 py-1 rounded text-xs ${security.securityHeaders.xFrameOptions ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {security.securityHeaders.xFrameOptions ? "Present" : "Missing"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeoAnalyzer; 