import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BarChart3, Zap, Target } from "lucide-react";
import { useState } from "react";
import heroImage from "@/assets/seo-hero.jpg";

interface SeoHeroProps {
  onAnalyze: (url: string) => void;
  isLoading?: boolean;
}

export const SeoHero = ({ onAnalyze, isLoading }: SeoHeroProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Professional
            <span className="block bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">
              SEO Audit
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
            Analyze your website's performance, speed, and search rankings with AI-powered insights
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-16">
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                <Input
                  type="url"
                  placeholder="Enter your website URL (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-12 bg-transparent border-none text-white placeholder:text-white/60 focus:ring-0 text-lg h-14"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                disabled={!url.trim() || isLoading}
                className="h-14 px-8 text-lg font-semibold"
              >
                {isLoading ? "Analyzing..." : "Analyze Now"}
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Performance Analysis</h3>
              <p className="text-white/80">Get detailed PageSpeed insights and performance metrics</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">SERP Analysis</h3>
              <p className="text-white/80">Monitor search rankings and competitor analysis</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Recommendations</h3>
              <p className="text-white/80">Smart suggestions powered by OpenAI analysis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};