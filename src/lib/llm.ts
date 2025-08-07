import { createClient } from '@supabase/supabase-js';
import { debugAPI, APIConfig } from './apiDebugger';
import { trackAPICall } from './analytics-new';
import { config } from './config';

// Get Supabase configuration
const getSupabaseConfig = () => {
  return {
    url: config.supabase.url,
    anonKey: config.supabase.anonKey
  };
};

// Create a mock client if environment variables are not set
let supabase: ReturnType<typeof createClient>;

const initializeSupabase = () => {
  const config = getSupabaseConfig();
  
  if (!config.url || !config.anonKey || config.url === 'https://your-project-id.supabase.co' || config.anonKey === 'your-anon-key-here') {
    console.warn('Supabase environment variables not configured. Using mock client.');
    // Create a mock supabase client for development
    supabase = ({
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () => ({
                limit: () => ({
                  maybeSingle: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
                })
              })
            })
          })
        })
      })
    }) as any;
  } else {
    supabase = createClient(config.url, config.anonKey);
  }
};

// Initialize on first access
let isInitialized = false;
const getSupabase = () => {
  if (!isInitialized) {
    initializeSupabase();
    isInitialized = true;
  }
  return supabase;
};

export interface APIKeyInfo {
  key: string;
  source: 'environment' | 'supabase' | 'fallback' | 'none';
  isValid: boolean;
  issues: string[];
  suggestions: string[];
}

export async function getLLMApiKey(provider: string): Promise<APIKeyInfo> {
  const startTime = Date.now();
  const requestId = debugAPI.log({
    provider: 'supabase',
    endpoint: 'api_keys',
    environment: (import.meta.env.DEV || false) ? 'development' : 'production',
    userAgent: navigator.userAgent,
    apiKeySource: 'supabase'
  });

  try {
    const supabaseClient = getSupabase();
    const { data, error } = await supabaseClient
      .from('api_keys')
      .select('api_key')
      .eq('provider', provider)
      .eq('is_active', true)
      .order('usage_count', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !data?.api_key || typeof data.api_key !== 'string') {
      throw new Error('No active API key found for ' + provider);
    }

    const validation = debugAPI.validateKey(data.api_key, provider);
    const responseTime = Date.now() - startTime;
    
    debugAPI.success(requestId, responseTime);

    return {
      key: data.api_key,
      source: 'supabase',
      ...validation
    };
  } catch (error) {
    debugAPI.error(requestId, error);
    throw error;
  }
}

export async function getAPIKeyWithFallback(provider: string): Promise<APIKeyInfo> {
  // First try environment variable
  let apiKey = '';
  let source: 'environment' | 'supabase' | 'fallback' | 'none' = 'none';

  // Check environment variables first
  if (provider === 'openai') {
    if (import.meta.env.VITE_OPENAI_API_KEY || '') {
      apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
      source = 'environment';
    } else if (import.meta.env.OPENAI_API_KEY || '') {
      apiKey = import.meta.env.OPENAI_API_KEY || '';
      source = 'environment';
    }
  } else if (provider === 'mistral') {
    if (import.meta.env.VITE_MISTRAL_API_KEY || '') {
      apiKey = import.meta.env.VITE_MISTRAL_API_KEY || '';
      source = 'environment';
    }
  }

  // If no environment variable, try Supabase
  if (!apiKey) {
    try {
      const supabaseKey = await getLLMApiKey(provider);
      apiKey = supabaseKey.key;
      source = 'supabase';
    } catch (error) {
      console.warn(`No API key found for ${provider} in environment or Supabase`);
    }
  }

  // Final fallback for development
  if (!apiKey && (import.meta.env.DEV || false)) {
    if (provider === 'openai') {
      apiKey = "sk-proj-demo-key-placeholder";
      source = 'fallback';
    }
  }

  const validation = debugAPI.validateKey(apiKey, provider);

  return {
    key: apiKey,
    source,
    ...validation
  };
}

// Consolidated function to call OpenAI (replaces Gemini, DeepSeek, Grok)
export async function callOpenAI(prompt: string, history: { role: string; content: string }[] = []): Promise<string> {
  const startTime = Date.now();
  const requestId = debugAPI.log({
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    environment: (import.meta.env.DEV || false) ? 'development' : 'production',
    userAgent: navigator.userAgent,
    apiKeySource: 'environment'
  });

  // Track API call start
  trackAPICall('openai', 'POST', 0, 0, { 
    prompt_length: prompt.length,
    history_length: history.length,
    model: 'gpt-3.5-turbo'
  });

  try {
    const apiKeyInfo = await getAPIKeyWithFallback('openai');
    
    // Update debug info with actual source
    debugAPI.log({
      provider: 'openai',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      environment: (import.meta.env.DEV || false) ? 'development' : 'production',
      userAgent: navigator.userAgent,
      apiKeySource: apiKeyInfo.source,
      apiKeyPrefix: apiKeyInfo.key.substring(0, 10) + '...'
    });

    if (!apiKeyInfo.isValid) {
      console.warn('OpenAI API key validation issues:', apiKeyInfo.issues);
      console.warn('Suggestions:', apiKeyInfo.suggestions);
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const messages = [...history, { role: 'user', content: prompt }];
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKeyInfo.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      debugAPI.error(requestId, error, { response: errorData, status: response.status });
      throw error;
    }
    
    const data = await response.json();
    const responseTime = Date.now() - startTime;
    debugAPI.success(requestId, responseTime);
    
    // Track successful API call
    trackAPICall('openai', 'POST', response.status, responseTime, {
      prompt_length: prompt.length,
      history_length: history.length,
      model: 'gpt-3.5-turbo',
      response_length: data.choices[0].message.content.length,
      tokens_used: data.usage?.total_tokens || 0
    });
    
    return data.choices[0].message.content;
  } catch (error) {
    debugAPI.error(requestId, error);
    
    // Track failed API call
    trackAPICall('openai', 'POST', 500, Date.now() - startTime, {
      prompt_length: prompt.length,
      history_length: history.length,
      model: 'gpt-3.5-turbo',
      error_message: error instanceof Error ? error.message : String(error)
    });
    
    throw error;
  }
}

// Legacy function names that now use OpenAI (for backward compatibility)
export async function callGemini(prompt: string): Promise<string> {
  console.log('Gemini call redirected to OpenAI');
  return callOpenAI(prompt);
}

export async function callDeepseek(prompt: string, history: { role: string; content: string }[] = []): Promise<string> {
  console.log('DeepSeek call redirected to OpenAI');
  return callOpenAI(prompt, history);
}

export async function callGrok(prompt: string, history: { role: string; content: string }[] = []): Promise<string> {
  console.log('Grok call redirected to OpenAI');
  return callOpenAI(prompt, history);
}

// Enhanced test functions for API key validation
export async function testOpenAIApiKey(apiKey: string): Promise<boolean> {
  const requestId = debugAPI.log({
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1/models',
    environment: (import.meta.env.DEV || false) ? 'development' : 'production',
    userAgent: navigator.userAgent,
    apiKeySource: 'environment'
  });

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    
    const isValid = response.ok;
    const responseTime = Date.now();
    
    if (isValid) {
      debugAPI.success(requestId, responseTime);
    } else {
      debugAPI.error(requestId, new Error(`HTTP ${response.status}: ${response.statusText}`));
    }
    
    return isValid;
  } catch (error) {
    debugAPI.error(requestId, error);
    return false;
  }
}

export async function testGeminiApiKey(apiKey: string): Promise<boolean> {
  // Redirect to OpenAI test since we're consolidating
  return testOpenAIApiKey(apiKey);
}

export async function testGrokApiKey(apiKey: string): Promise<boolean> {
  // Redirect to OpenAI test since we're consolidating
  return testOpenAIApiKey(apiKey);
}

export async function testDeepseekApiKey(apiKey: string): Promise<boolean> {
  // Redirect to OpenAI test since we're consolidating
  return testOpenAIApiKey(apiKey);
}

// Utility function to test all API endpoints
export async function testAllAPIEndpoints(): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  
  // Test OpenAI
  const openaiConfig: APIConfig = {
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1/models',
    headers: { 'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}` },
    timeout: 10000,
    retries: 3,
    fallbackEnabled: true
  };
  
  results.openai = await debugAPI.testEndpoint(openaiConfig);
  
  // Test Mistral
  const mistralConfig: APIConfig = {
    provider: 'mistral',
    baseUrl: 'https://api.mistral.ai/v1/models',
    headers: { 'Authorization': `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY || ''}` },
    timeout: 10000,
    retries: 3,
    fallbackEnabled: true
  };
  
  results.mistral = await debugAPI.testEndpoint(mistralConfig);
  
  // Test Supabase
  const supabaseConfig: APIConfig = {
    provider: 'supabase',
    baseUrl: `${import.meta.env.VITE_SUPABASE_URL || ''}/rest/v1/`,
    headers: { 
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    },
    timeout: 10000,
    retries: 3,
    fallbackEnabled: true
  };
  
  results.supabase = await debugAPI.testEndpoint(supabaseConfig);
  
  return results;
}

// Export debug utilities for use in components
export { debugAPI };