import React, { useState, useEffect } from 'react';
import { debugAPI, testAllAPIEndpoints, getAPIKeyWithFallback } from '../../lib/llm';

interface APIDebuggerProps {
  isOpen: boolean;
  onClose: () => void;
}

const APIDebugger: React.FC<APIDebuggerProps> = ({ isOpen, onClose }) => {
  const [environmentStatus, setEnvironmentStatus] = useState<any>(null);
  const [apiTestResults, setApiTestResults] = useState<any>(null);
  const [debugLog, setDebugLog] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'tests' | 'logs' | 'keys'>('status');
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  console.log('APIDebugger component rendered, isOpen:', isOpen);
  console.log('APIDebugger props:', { isOpen, onClose: typeof onClose });

  useEffect(() => {
    console.log('APIDebugger useEffect triggered, isOpen:', isOpen);
    if (isOpen) {
      try {
        console.log('Setting environment status...');
        const status = debugAPI.getStatus();
        console.log('Environment status:', status);
        setEnvironmentStatus(status);
        
        console.log('Setting debug log...');
        const logs = debugAPI.getDebugLog();
        console.log('Debug logs:', logs);
        setDebugLog(logs);
        setError(null);
      } catch (error) {
        console.error('Error in APIDebugger useEffect:', error);
        setError(`Failed to initialize: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }, [isOpen]);

  const runAPITests = async () => {
    console.log('Running API tests...');
    setIsTesting(true);
    try {
      const results = await testAllAPIEndpoints();
      console.log('API test results:', results);
      setApiTestResults(results);
    } catch (error) {
      console.error('Error running API tests:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const refreshLogs = () => {
    console.log('Refreshing logs...');
    setDebugLog(debugAPI.getDebugLog());
  };

  const clearLogs = () => {
    console.log('Clearing logs...');
    debugAPI.clearLog();
    setDebugLog([]);
  };

  const exportLogs = () => {
    console.log('Exporting logs...');
    const logData = debugAPI.exportLog();
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-debug-log-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const validateAPIKey = async (provider: string) => {
    try {
      const keyInfo = await getAPIKeyWithFallback(provider);
      return keyInfo;
    } catch (error) {
      return {
        key: '',
        source: 'none' as const,
        isValid: false,
        issues: ['Failed to retrieve API key'],
        suggestions: ['Check environment variables and Supabase configuration']
      };
    }
  };

  console.log('APIDebugger render - isOpen:', isOpen, 'environmentStatus:', environmentStatus);

  if (!isOpen) {
    console.log('APIDebugger not open, returning null');
    return null;
  }

  // Fallback for production debugging
  if (typeof window !== 'undefined' && !debugAPI) {
    console.error('debugAPI not available');
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-6xl h-5/6 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">API Debugger Error</h2>
            <p className="text-red-600">debugAPI is not available. This might be a build issue.</p>
            <button 
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-6xl h-5/6 overflow-hidden">
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
            <strong>Error:</strong> {error}
          </div>
        )}
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">🔍 API Debugger & Manager</h2>
          <button
            onClick={() => {
              console.log('Close button clicked');
              onClose();
            }}
            className="text-white hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-gray-100 border-b">
          <div className="flex">
            {[
              { id: 'status', label: 'Environment Status', icon: '🌍' },
              { id: 'tests', label: 'API Tests', icon: '🧪' },
              { id: 'logs', label: 'Debug Logs', icon: '📋' },
              { id: 'keys', label: 'API Keys', icon: '🔑' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  console.log('Tab clicked:', tab.id);
                  setActiveTab(tab.id as any);
                }}
                className={`px-4 py-2 font-medium ${
                  activeTab === tab.id
                    ? 'bg-white border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full">
          {/* Environment Status Tab */}
          {activeTab === 'status' && environmentStatus && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">🌍 Environment Info</h3>
                  <div className="space-y-2 text-sm">
                    <div>Development: {environmentStatus.isDevelopment ? '✅ Yes' : '❌ No'}</div>
                    <div>Production: {environmentStatus.isProduction ? '✅ Yes' : '❌ No'}</div>
                    <div>Debug Mode: {environmentStatus.debugMode ? '✅ Enabled' : '❌ Disabled'}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">🔑 Environment Variables</h3>
                  <div className="space-y-2 text-sm">
                    {Object.entries(environmentStatus.environmentVariables).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span>{key}:</span>
                        <span className={value ? 'text-green-600' : 'text-red-600'}>
                          {value ? '✅ Present' : '❌ Missing'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">🔑 API Key Prefixes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(environmentStatus.apiKeyPrefixes).map(([provider, prefix]) => (
                    <div key={provider} className="bg-white p-3 rounded border">
                      <div className="font-medium capitalize">{provider}</div>
                      <div className="font-mono text-xs text-gray-600 mt-1">{String(prefix)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API Tests Tab */}
          {activeTab === 'tests' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">🧪 API Endpoint Tests</h3>
                <button
                  onClick={runAPITests}
                  disabled={isTesting}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isTesting ? 'Testing...' : 'Run Tests'}
                </button>
              </div>

              {apiTestResults && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(apiTestResults).map(([provider, result]: [string, any]) => (
                    <div key={provider} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold capitalize mb-2">{provider}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                            {result.success ? '✅ Success' : '❌ Failed'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Response Time:</span>
                          <span>{result.responseTime}ms</span>
                        </div>
                        {result.error && (
                          <div className="text-red-600 text-xs">
                            Error: {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Debug Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">📋 Debug Logs</h3>
                <div className="space-x-2">
                  <button
                    onClick={refreshLogs}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={clearLogs}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Clear
                  </button>
                  <button
                    onClick={exportLogs}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Export
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                {debugLog.length === 0 ? (
                  <div className="text-gray-500">No debug logs available</div>
                ) : (
                  debugLog.map((log, index) => (
                    <div key={index} className="mb-2">
                      <div className="text-yellow-400">
                        [{log.timestamp}] {log.provider} - {log.requestId}
                      </div>
                      <div className="ml-4">
                        <div>Endpoint: {log.endpoint}</div>
                        <div>Source: {log.apiKeySource}</div>
                        {log.success !== undefined && (
                          <div className={log.success ? 'text-green-400' : 'text-red-400'}>
                            Status: {log.success ? 'SUCCESS' : 'FAILED'}
                          </div>
                        )}
                        {log.responseTime && (
                          <div>Response Time: {log.responseTime}ms</div>
                        )}
                        {log.error && (
                          <div className="text-red-400">
                            Error: {log.error.message}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'keys' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">🔑 API Key Validation</h3>
              <APIKeyValidator />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// API Key Validator Component
const APIKeyValidator: React.FC = () => {
  const [keyResults, setKeyResults] = useState<Record<string, any>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateAllKeys = async () => {
    console.log('Validating all keys...');
    setIsValidating(true);
    const results: Record<string, any> = {};
    
    const providers = ['openai', 'mistral'];
    
    for (const provider of providers) {
      try {
        const keyInfo = await getAPIKeyWithFallback(provider);
        results[provider] = keyInfo;
      } catch (error) {
        results[provider] = {
          key: '',
          source: 'none',
          isValid: false,
          issues: ['Failed to retrieve key'],
          suggestions: ['Check configuration']
        };
      }
    }
    
    console.log('Key validation results:', results);
    setKeyResults(results);
    setIsValidating(false);
  };

  useEffect(() => {
    validateAllKeys();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span>API Key Status</span>
        <button
          onClick={validateAllKeys}
          disabled={isValidating}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {isValidating ? 'Validating...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(keyResults).map(([provider, result]) => (
          <div key={provider} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold capitalize mb-3">{provider}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={result.isValid ? 'text-green-600' : 'text-red-600'}>
                  {result.isValid ? '✅ Valid' : '❌ Invalid'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Source:</span>
                <span className="capitalize">{result.source}</span>
              </div>
              <div className="flex justify-between">
                <span>Key Prefix:</span>
                <span className="font-mono text-xs">
                  {result.key ? result.key.substring(0, 10) + '...' : 'None'}
                </span>
              </div>
              
              {result.issues && result.issues.length > 0 && (
                <div className="mt-3">
                  <div className="font-medium text-red-600 mb-1">Issues:</div>
                  <ul className="list-disc list-inside text-xs text-red-600">
                    {result.issues.map((issue: string, index: number) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.suggestions && result.suggestions.length > 0 && (
                <div className="mt-3">
                  <div className="font-medium text-blue-600 mb-1">Suggestions:</div>
                  <ul className="list-disc list-inside text-xs text-blue-600">
                    {result.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default APIDebugger; 