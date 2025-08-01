-- Create SEO Tools table
CREATE TABLE IF NOT EXISTS seo_tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the SEO tools data
INSERT INTO seo_tools (title, url, description, category) VALUES
('Free SEO Audit Tool', 'https://seomator.com/free-seo-audit-tool', 'Comprehensive website SEO audit with detailed recommendations', 'Audit'),
('Google SERP Rank Checker', 'https://seomator.com/google-serp-rank-checker', 'Check your website ranking positions in Google search results', 'Ranking'),
('Free Keyword Research Tool', 'https://seomator.com/free-keyword-research-tool', 'Find relevant keywords for your content strategy', 'Keywords'),
('Free Backlink Checker Tool', 'https://seomator.com/free-backlink-checker-tool', 'Analyze your website backlink profile and quality', 'Backlinks'),
('Bing SERP Rank Checker', 'https://seomator.com/bing-serp-rank-checker', 'Check your website ranking positions in Bing search results', 'Ranking'),
('Website Crawl Test', 'https://seomator.com/website-crawl-test', 'Test how search engines crawl and index your website', 'Technical'),
('Mobile Friendly Test', 'https://seomator.com/mobile-friendly-test', 'Check if your website is mobile-friendly for search engines', 'Mobile'),
('HTTPS Header Checker', 'https://seomator.com/https-header-checker', 'Verify your website security headers and SSL configuration', 'Security'),
('Keyword Density Checker', 'https://seomator.com/keyword-density-checker', 'Analyze keyword usage and density in your content', 'Content'),
('Internal Link Checker', 'https://seomator.com/internal-link-checker', 'Review and optimize your internal linking structure', 'Links'),
('Free Website Speed Test', 'https://seomator.com/free-website-speed-test', 'Test your website loading speed and performance', 'Performance'),
('Meta Tags Checker', 'https://seomator.com/meta-tags-checker', 'Analyze and optimize your meta tags for better SEO', 'Meta Tags'),
('Sitemap Finder', 'https://seomator.com/sitemap-finder', 'Discover and analyze website sitemaps', 'Technical'),
('Website Technology Checker', 'https://seomator.com/website-technology-checker', 'Identify technologies used on any website', 'Technical'),
('Organic Traffic Checker Free', 'https://seomator.com/organic-traffic-checker-free', 'Estimate organic search traffic for any website', 'Analytics'),
('Free Email Verification Tool', 'https://seomator.com/free-email-verification-tool', 'Verify email addresses for marketing campaigns', 'Marketing'),
('Free Domain Authority Checker', 'https://seomator.com/free-domain-authority-checker', 'Check domain authority and page authority scores', 'Authority'),
('Anchor Text Link Extractor Tool', 'https://seomator.com/anchor-text-link-extractor-tool', 'Extract and analyze anchor text from backlinks', 'Backlinks'),
('Google Cache Date Checker Tool', 'https://seomator.com/google-cache-date-checker-tool', 'Check when Google last cached your pages', 'Technical'),
('URL Redirect Checker', 'https://seomator.com/url-redirect-checker', 'Analyze redirect chains and status codes', 'Technical'),
('Company Logo API', 'https://seomator.com/company-logo-api', 'API for retrieving company logos and branding', 'API'),
('YouTube Rank Checker', 'https://seomator.com/youtube-rank-checker', 'Check YouTube video rankings in search results', 'Video'),
('Competitor Keyword Research Tool', 'https://seomator.com/competitor-keyword-research-tool', 'Research keywords your competitors are ranking for', 'Competitive'),
('Google AI Overview Keywords Checker', 'https://seomator.com/google-ai-overview-keywords-checker', 'Check keywords that trigger AI overviews in Google', 'AI'),
('Free LLMs TXT Generator', 'https://seomator.com/free-llms-txt-generator', 'Generate content using AI language models', 'AI'),
('Free SEO Keyword Research SERP Analyzer GPT', 'https://chatgpt.com/g/g-Iz6TghxNT-free-seo-keyword-research-serp-analyzer-gpt', 'AI-powered SEO keyword research and SERP analysis', 'AI')
ON CONFLICT (url) DO NOTHING;

-- Create RLS policies
ALTER TABLE seo_tools ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read SEO tools
CREATE POLICY "Allow authenticated users to read seo tools" ON seo_tools
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert SEO tools
CREATE POLICY "Allow authenticated users to insert seo tools" ON seo_tools
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update SEO tools
CREATE POLICY "Allow authenticated users to update seo tools" ON seo_tools
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete SEO tools
CREATE POLICY "Allow authenticated users to delete seo tools" ON seo_tools
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_seo_tools_category ON seo_tools(category);
CREATE INDEX IF NOT EXISTS idx_seo_tools_active ON seo_tools(is_active); 