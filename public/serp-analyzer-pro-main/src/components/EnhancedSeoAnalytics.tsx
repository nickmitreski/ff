import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Smartphone, 
  Code, 
  Shield, 
  Book,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Globe,
  Image,
  Link,
  Hash
} from "lucide-react";
import { 
  MetaTagsData, 
  MobileFriendlinessData, 
  SchemaData, 
  SecurityData, 
  ContentAnalysisData 
} from "@/services/enhancedSeoServices";

interface EnhancedSeoAnalyticsProps {
  url: string;
  metaTags?: MetaTagsData;
  mobileFriendliness?: MobileFriendlinessData;
  schemaMarkup?: SchemaData;
  security?: SecurityData;
  content?: ContentAnalysisData;
  isLoading: boolean;
}

export const EnhancedSeoAnalytics = ({
  url,
  metaTags,
  mobileFriendliness,
  schemaMarkup,
  security,
  content,
  isLoading
}: EnhancedSeoAnalyticsProps) => {
  const getStatusIcon = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'destructive';
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Enhanced SEO Analysis</h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Enhanced SEO Analysis</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>{url}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Meta Tags Analysis */}
          {metaTags && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Meta Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Title Tag</span>
                    {getStatusIcon(metaTags.title.status)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metaTags.title.length} characters
                  </div>
                  <Progress value={Math.min(100, (metaTags.title.length / 60) * 100)} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Meta Description</span>
                    {getStatusIcon(metaTags.description.status)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metaTags.description.length} characters
                  </div>
                  <Progress value={Math.min(100, (metaTags.description.length / 160) * 100)} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Open Graph</span>
                    {getStatusIcon(metaTags.openGraph.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Twitter Card</span>
                    {getStatusIcon(metaTags.twitterCard.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mobile Friendliness */}
          {mobileFriendliness && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Mobile Friendliness
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">
                    {mobileFriendliness.score}
                  </div>
                  <Badge variant="success" className="mt-2">
                    Mobile Friendly
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Viewport Config</span>
                    {mobileFriendliness.viewport.configured ? 
                      <CheckCircle className="h-4 w-4 text-success" /> :
                      <XCircle className="h-4 w-4 text-destructive" />
                    }
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Touch Targets</span>
                    {mobileFriendliness.touchTargets.adequate ? 
                      <CheckCircle className="h-4 w-4 text-success" /> :
                      <XCircle className="h-4 w-4 text-destructive" />
                    }
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Text Readability</span>
                    {mobileFriendliness.textReadability.adequate ? 
                      <CheckCircle className="h-4 w-4 text-success" /> :
                      <XCircle className="h-4 w-4 text-destructive" />
                    }
                  </div>
                </div>
                
                {mobileFriendliness.issues.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Issues Found:</h4>
                    {mobileFriendliness.issues.map((issue, index) => (
                      <div key={index} className="text-xs text-muted-foreground">
                        {issue.description}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Security Analysis */}
          {security && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">
                    {security.score}
                  </div>
                  <Badge variant={security.score > 70 ? 'success' : 'warning'} className="mt-2">
                    {security.score > 70 ? 'Secure' : 'Needs Improvement'}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SSL Certificate</span>
                    {security.ssl.enabled ? 
                      <CheckCircle className="h-4 w-4 text-success" /> :
                      <XCircle className="h-4 w-4 text-destructive" />
                    }
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mixed Content</span>
                    {security.mixedContent.issues === 0 ? 
                      <CheckCircle className="h-4 w-4 text-success" /> :
                      <XCircle className="h-4 w-4 text-destructive" />
                    }
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Security Headers</span>
                    {security.securityHeaders.contentSecurityPolicy ? 
                      <CheckCircle className="h-4 w-4 text-success" /> :
                      <XCircle className="h-4 w-4 text-destructive" />
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Schema Markup */}
          {schemaMarkup && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Schema Markup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {schemaMarkup.coverage}%
                  </div>
                  <Badge variant="outline" className="mt-2">
                    Coverage
                  </Badge>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Schema Types Found:</h4>
                  <div className="flex flex-wrap gap-1">
                    {schemaMarkup.types.map((type, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {schemaMarkup.errors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Issues:</h4>
                    {schemaMarkup.errors.slice(0, 2).map((error, index) => (
                      <div key={index} className="text-xs text-muted-foreground mb-1">
                        {error.message}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Content Analysis */}
          {content && (
            <Card className="shadow-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-primary" />
                  Content Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {content.wordCount}
                    </div>
                    <div className="text-sm text-muted-foreground">Words</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {content.readabilityScore}
                    </div>
                    <div className="text-sm text-muted-foreground">Readability</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {content.images.withAltText}/{content.images.total}
                    </div>
                    <div className="text-sm text-muted-foreground">Images with Alt</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {content.internalLinks}
                    </div>
                    <div className="text-sm text-muted-foreground">Internal Links</div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      Heading Structure
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>H1 Tags:</span>
                        <span className={content.headingStructure.h1Count === 1 ? 'text-success' : 'text-warning'}>
                          {content.headingStructure.h1Count}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>H2 Tags:</span>
                        <span>{content.headingStructure.h2Count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>H3 Tags:</span>
                        <span>{content.headingStructure.h3Count}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Image className="h-4 w-4" />
                      Image Optimization
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Images:</span>
                        <span>{content.images.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Missing Alt Text:</span>
                        <span className={content.images.missingAlt > 0 ? 'text-warning' : 'text-success'}>
                          {content.images.missingAlt}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Oversized:</span>
                        <span className={content.images.oversized > 0 ? 'text-warning' : 'text-success'}>
                          {content.images.oversized}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};