import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }

  // Get secrets from environment variables
  const GOOGLE_PAGESPEED_API_KEY = Deno.env.get("GOOGLE_PAGESPEED_API_KEY");
  const SERPAPI_API_KEY = Deno.env.get("SERPAPI_API_KEY");
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  // Import Supabase client dynamically
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  try {
    const { website_url, keywords } = await req.json();
    if (!website_url) {
      return new Response(JSON.stringify({
        error: "website_url is required"
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    // 1. Call Google PageSpeed Insights
    const psiRes = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(website_url)}&key=${GOOGLE_PAGESPEED_API_KEY}&category=PERFORMANCE&category=SEO`);
    const psiData = await psiRes.json();
    // Extract performance score and SEO issues
    const performance_score = Math.round((psiData.lighthouseResult?.categories?.performance?.score ?? 0) * 100);
    const seo_issues = psiData.lighthouseResult?.audits ? Object.values(psiData.lighthouseResult.audits).filter((audit)=>audit.score !== 1 && audit.scoreDisplayMode !== "informative").map((audit)=>({
        id: audit.id,
        title: audit.title,
        description: audit.description,
        details: audit.details
      })) : [];
    // 2. Call SerpApi for keyword rankings (if keywords provided)
    let keyword_rankings = [];
    if (Array.isArray(keywords) && keywords.length > 0) {
      for (const keyword of keywords){
        const serpRes = await fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(keyword)}&api_key=${SERPAPI_API_KEY}&num=10`);
        const serpData = await serpRes.json();
        // Find the website in the organic results
        const ranking = serpData.organic_results?.findIndex((result)=>result.link && result.link.includes(website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")));
        keyword_rankings.push({
          keyword,
          position: ranking >= 0 ? ranking + 1 : null
        });
      }
    }
    // 3. Store the results in Supabase
    const { data: audit, error } = await supabase.from("seo_audits").insert([
      {
        website_url,
        performance_score,
        seo_issues,
        keyword_rankings: keyword_rankings.length > 0 ? keyword_rankings : null
      }
    ]).select().single();
    if (error) {
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
    // 4. Generate recommendations with OpenAI GPT-4o
    const prompt = `You are an expert SEO consultant. Given the following audit data, provide clear, actionable recommendations to improve the website's SEO and performance.\n\nWebsite: ${website_url}\nPerformance Score: ${performance_score}\nSEO Issues: ${JSON.stringify(seo_issues, null, 2)}\nKeyword Rankings: ${JSON.stringify(keyword_rankings, null, 2)}\n\nRecommendations:`;
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 400
      })
    });
    const openaiData = await openaiRes.json();
    const recommendations = openaiData.choices?.[0]?.message?.content || "";
    // 5. Update the row with recommendations
    const { data: updatedAudit, error: updateError } = await supabase.from("seo_audits").update({
      recommendations
    }).eq("id", audit.id).select().single();
    if (updateError) {
      return new Response(JSON.stringify({
        error: updateError.message
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
    // 6. Return the updated row (including keyword rankings)
    return new Response(JSON.stringify({ ...updatedAudit, keyword_rankings }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}); 