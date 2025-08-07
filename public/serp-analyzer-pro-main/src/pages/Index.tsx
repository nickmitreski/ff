import { useState } from "react";
import { SeoHero } from "@/components/SeoHero";
import { SeoAnalytics } from "@/components/SeoAnalytics";
import { EnhancedSeoAnalytics } from "@/components/EnhancedSeoAnalytics";
import { performFullSeoAudit, PageSpeedMetrics, SerpResult } from "@/services/seoServices";
import { 
  performEnhancedSeoAudit, 
  MetaTagsData, 
  MobileFriendlinessData, 
  SchemaData, 
  SecurityData, 
  ContentAnalysisData 
} from "@/services/enhancedSeoServices";
import { toast } from "sonner";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [pageSpeedData, setPageSpeedData] = useState<PageSpeedMetrics | null>(null);
  const [serpData, setSerpData] = useState<SerpResult[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  
  // Enhanced analysis state
  const [metaTags, setMetaTags] = useState<MetaTagsData | null>(null);
  const [mobileFriendliness, setMobileFriendliness] = useState<MobileFriendlinessData | null>(null);
  const [schemaMarkup, setSchemaMarkup] = useState<SchemaData | null>(null);
  const [security, setSecurity] = useState<SecurityData | null>(null);
  const [content, setContent] = useState<ContentAnalysisData | null>(null);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setCurrentUrl(url);
    
    // Reset previous results
    setPageSpeedData(null);
    setSerpData([]);
    setAiRecommendations([]);
    setMetaTags(null);
    setMobileFriendliness(null);
    setSchemaMarkup(null);
    setSecurity(null);
    setContent(null);

    try {
      // Run both basic and enhanced audits in parallel
      const [basicResults, enhancedResults] = await Promise.all([
        performFullSeoAudit(url),
        performEnhancedSeoAudit(url)
      ]);
      
      // Set basic results
      setPageSpeedData(basicResults.pageSpeedData);
      setSerpData(basicResults.serpData);
      setAiRecommendations(basicResults.aiRecommendations);
      
      // Set enhanced results
      setMetaTags(enhancedResults.metaTags);
      setMobileFriendliness(enhancedResults.mobileFriendliness);
      setSchemaMarkup(enhancedResults.schemaMarkup);
      setSecurity(enhancedResults.security);
      setContent(enhancedResults.content);

      // Show errors as warnings if any
      const allErrors = [...basicResults.errors, ...enhancedResults.errors];
      if (allErrors.length > 0) {
        allErrors.forEach(error => {
          toast.error(error);
        });
      }

      if (basicResults.pageSpeedData || basicResults.serpData.length > 0 || enhancedResults.metaTags) {
        toast.success("Comprehensive SEO audit completed successfully!");
      } else {
        toast.error("Unable to complete SEO audit. Please check the URL and try again.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred during analysis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SeoHero onAnalyze={handleAnalyze} isLoading={isLoading} />
      
      {(currentUrl && (isLoading || pageSpeedData || serpData.length > 0)) && (
        <SeoAnalytics
          url={currentUrl}
          pageSpeedData={pageSpeedData || undefined}
          serpData={serpData}
          aiRecommendations={aiRecommendations}
          isLoading={isLoading}
        />
      )}

      {(currentUrl && (isLoading || metaTags || mobileFriendliness || security)) && (
        <EnhancedSeoAnalytics
          url={currentUrl}
          metaTags={metaTags || undefined}
          mobileFriendliness={mobileFriendliness || undefined}
          schemaMarkup={schemaMarkup || undefined}
          security={security || undefined}
          content={content || undefined}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Index;