import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  Zap, 
  Smartphone, 
  Monitor, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from "lucide-react";

interface PageSpeedData {
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

interface SerpData {
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

interface SeoAnalyticsProps {
  url: string;
  pageSpeedData?: PageSpeedData;
  serpData?: SerpData[];
  aiRecommendations?: string[];
  isLoading: boolean;
}

export const SeoAnalytics = ({ 
  url, 
  pageSpeedData, 
  serpData, 
  aiRecommendations, 
  isLoading 
}: SeoAnalyticsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 50) return "warning";
    return "destructive";
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Analyzing {url}</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">SEO Analysis Results</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>{url}</span>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* PageSpeed Insights */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                PageSpeed Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pageSpeedData ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(pageSpeedData.score)}`}>
                      {pageSpeedData.score}
                    </div>
                    <Badge variant={getScoreBadge(pageSpeedData.score) as any} className="mt-2">
                      {pageSpeedData.score >= 90 ? "Good" : pageSpeedData.score >= 50 ? "Needs Improvement" : "Poor"}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">First Contentful Paint</span>
                        <span className="text-sm text-muted-foreground">{pageSpeedData.metrics.fcp}s</span>
                      </div>
                      <Progress value={Math.max(0, 100 - (pageSpeedData.metrics.fcp * 20))} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Largest Contentful Paint</span>
                        <span className="text-sm text-muted-foreground">{pageSpeedData.metrics.lcp}s</span>
                      </div>
                      <Progress value={Math.max(0, 100 - (pageSpeedData.metrics.lcp * 15))} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No PageSpeed data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* SERP Rankings */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Search Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {serpData && serpData.length > 0 ? (
                <div className="space-y-4">
                  {serpData.slice(0, 3).map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.keyword}</span>
                        <Badge variant="outline">#{item.position}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{item.title}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No ranking data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Opportunities */}
        {pageSpeedData?.opportunities && (
          <Card className="mb-12 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Optimization Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pageSpeedData.opportunities.slice(0, 5).map((opportunity, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{opportunity.title}</h4>
                        <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                      </div>
                      <Badge variant="outline" className="text-success border-success">
                        {opportunity.savings}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Recommendations */}
        {aiRecommendations && aiRecommendations.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                AI-Powered Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};