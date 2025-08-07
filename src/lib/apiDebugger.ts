// API Debugger and Error Handler
// This module provides comprehensive debugging and error handling for all API calls

export interface APIDebugInfo {
  timestamp: string;
  provider: string;
  endpoint: string;
  requestId: string;
  environment: 'development' | 'production';
  userAgent: string;
  error?: {
    message: string;
    status?: number;
    statusText?: string;
    response?: any;
  };
  success?: boolean;
  responseTime?: number;
  apiKeySource: 'environment' | 'supabase' | 'fallback' | 'none';
  apiKeyPrefix?: string;
}

export interface APIConfig {
  provider: string;
  baseUrl: string;
  headers: Record<string, string>;
  timeout: number;
  retries: number;
  fallbackEnabled: boolean;
}

class APIDebugger {
  private debugLog: APIDebugInfo[] = [];
  private getDebugMode() {
    return (import.meta.env.DEV || false) || (import.meta.env.VITE_DEBUG_APIS === 'true');
  }

  constructor() {
    this.setupGlobalErrorHandling();
  }

  private setupGlobalErrorHandling() {
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        this.logError('Unhandled Promise Rejection', {
          message: event.reason?.message || 'Unknown error',
          stack: event.reason?.stack
        });
      });

      window.addEventListener('error', (event) => {
        this.logError('Global Error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      });
    }
  }

  public logAPICall(info: Omit<APIDebugInfo, 'timestamp' | 'requestId'>): string {
    const requestId = this.generateRequestId();
    const debugInfo: APIDebugInfo = {
      ...info,
      timestamp: new Date().toISOString(),
      requestId
    };

    this.debugLog.push(debugInfo);
    
    if (this.getDebugMode()) {
      console.group(`🔍 API Call [${requestId}] - ${info.provider}`);
      console.log('Debug Info:', debugInfo);
      console.groupEnd();
    }

    return requestId;
  }

  public logAPIError(requestId: string, error: any, context?: any) {
    const debugInfo = this.debugLog.find(log => log.requestId === requestId);
    if (debugInfo) {
      debugInfo.error = {
        message: error.message || 'Unknown error',
        status: error.status,
        statusText: error.statusText,
        response: error.response
      };
      debugInfo.success = false;

      if (this.getDebugMode()) {
        console.error(`❌ API Error [${requestId}]:`, {
          error: debugInfo.error,
          context,
          debugInfo
        });
      }
    }
  }

  public logAPISuccess(requestId: string, responseTime: number) {
    const debugInfo = this.debugLog.find(log => log.requestId === requestId);
    if (debugInfo) {
      debugInfo.success = true;
      debugInfo.responseTime = responseTime;

      if (this.getDebugMode()) {
        console.log(`✅ API Success [${requestId}] - ${responseTime}ms`);
      }
    }
  }

  private logError(type: string, error: any) {
    if (this.getDebugMode()) {
      console.error(`🚨 ${type}:`, error);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getDebugLog(): APIDebugInfo[] {
    return [...this.debugLog];
  }

  public clearDebugLog(): void {
    this.debugLog = [];
  }

  public exportDebugLog(): string {
    return JSON.stringify(this.debugLog, null, 2);
  }

  public getEnvironmentStatus(): Record<string, any> {
    const getEnvVars = () => {
      try {
        return {
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
          supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          openaiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
          mistralKey: import.meta.env.VITE_MISTRAL_API_KEY || '',
          googleMapsKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
          youtubeKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
          postHogKey: import.meta.env.VITE_POSTHOG_KEY || '',
        };
      } catch (error) {
        console.warn('Error accessing environment variables in apiDebugger:', error);
        return {
          supabaseUrl: '',
          supabaseKey: '',
          openaiKey: '',
          mistralKey: '',
          googleMapsKey: '',
          youtubeKey: '',
          postHogKey: '',
        };
      }
    };

    const envVars = getEnvVars();
    
    return {
      isDevelopment: import.meta.env.DEV || false,
      isProduction: import.meta.env.PROD || false,
      debugMode: this.getDebugMode(),
      environmentVariables: {
        hasSupabaseUrl: !!envVars.supabaseUrl,
        hasSupabaseKey: !!envVars.supabaseKey,
        hasOpenAIKey: !!envVars.openaiKey,
        hasMistralKey: !!envVars.mistralKey,
        hasGoogleMapsKey: !!envVars.googleMapsKey,
        hasYouTubeKey: !!envVars.youtubeKey,
        hasPostHogKey: !!envVars.postHogKey,
      },
      apiKeyPrefixes: {
        openai: envVars.openaiKey?.substring(0, 10) + '...',
        mistral: envVars.mistralKey?.substring(0, 10) + '...',
        supabase: envVars.supabaseKey?.substring(0, 10) + '...',
      }
    };
  }

  public validateAPIKey(apiKey: string, provider: string): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (!apiKey) {
      issues.push('API key is missing');
      suggestions.push('Check your environment variables');
      return { isValid: false, issues, suggestions };
    }

    if (apiKey.includes('your-') || apiKey.includes('placeholder')) {
      issues.push('API key appears to be a placeholder');
      suggestions.push('Replace with actual API key');
    }

    if (apiKey.length < 20) {
      issues.push('API key seems too short');
      suggestions.push('Verify the API key is complete');
    }

    // Provider-specific validation
    switch (provider.toLowerCase()) {
      case 'openai':
        if (!apiKey.startsWith('sk-')) {
          issues.push('OpenAI API key should start with "sk-"');
          suggestions.push('Verify this is a valid OpenAI API key');
        }
        break;
      case 'mistral':
        if (apiKey.length < 30) {
          issues.push('Mistral API key seems too short');
          suggestions.push('Verify the Mistral API key is complete');
        }
        break;
      case 'supabase':
        if (!apiKey.startsWith('eyJ')) {
          issues.push('Supabase key should be a JWT token starting with "eyJ"');
          suggestions.push('Verify this is a valid Supabase anon key');
        }
        break;
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }

  public async testAPIEndpoint(config: APIConfig): Promise<{
    success: boolean;
    responseTime: number;
    error?: string;
    details?: any;
  }> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(config.baseUrl, {
        method: 'GET',
        headers: config.headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.logAPISuccess(requestId, responseTime);
      return { success: true, responseTime };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logAPIError(requestId, error);
      
      return {
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
    }
  }
}

// Global instance
export const apiDebugger = new APIDebugger();

// Utility functions
export const debugAPI = {
  log: (info: Omit<APIDebugInfo, 'timestamp' | 'requestId'>) => apiDebugger.logAPICall(info),
  error: (requestId: string, error: any, context?: any) => apiDebugger.logAPIError(requestId, error, context),
  success: (requestId: string, responseTime: number) => apiDebugger.logAPISuccess(requestId, responseTime),
  getStatus: () => apiDebugger.getEnvironmentStatus(),
  getDebugLog: () => apiDebugger.getDebugLog(),
  validateKey: (apiKey: string, provider: string) => apiDebugger.validateAPIKey(apiKey, provider),
  testEndpoint: (config: APIConfig) => apiDebugger.testAPIEndpoint(config),
  exportLog: () => apiDebugger.exportDebugLog(),
  clearLog: () => apiDebugger.clearDebugLog()
};

// Expose for browser console debugging
if (typeof window !== 'undefined') {
  (window as any).apiDebugger = debugAPI;
} 