import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Clock, MousePointer, Eye, Calendar, ArrowUpRight, Users, TrendingUp, Activity, Zap, Smartphone, Monitor, Globe, MessageSquare, Gamepad2, Settings } from 'lucide-react';

// PostHog API configuration - will be accessed within functions
const getPostHogConfig = () => ({
  apiKey: import.meta.env.VITE_PUBLIC_POSTHOG_KEY || '',
  host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
});

interface PostHogEvent {
  id: string;
  event: string;
  properties: Record<string, any>;
  timestamp: string;
  person?: {
    id: string;
    properties: Record<string, any>;
  };
}

interface PostHogInsight {
  result: any[];
  next?: string;
}

interface AnalyticsData {
  events: PostHogEvent[];
  pageViews: any[];
  featureUsage: any[];
  apiCalls: any[];
  userJourney: any[];
  deviceInfo: any[];
  performance: any[];
  errors: any[];
}

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'all'>('week');
  const [data, setData] = useState<AnalyticsData>({
    events: [],
    pageViews: [],
    featureUsage: [],
    apiCalls: [],
    userJourney: [],
    deviceInfo: [],
    performance: [],
    errors: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for now since PostHog API requires special permissions
  const mockAnalyticsData = {
    totalUsers: 1250,
    activeUsers: 847,
    pageViews: 3420,
    sessionDuration: 245,
    bounceRate: 23.5,
    topPages: [
      { page: '/', views: 1200 },
      { page: '/admin', views: 450 },
      { page: '/games', views: 320 },
      { page: '/ai-tools', views: 280 }
    ],
    topFeatures: [
      { feature: 'AI Image Generator', usage: 156 },
      { feature: 'Chatbot', usage: 89 },
      { feature: 'Games', usage: 234 },
      { feature: 'Analytics', usage: 67 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', percentage: 65 },
      { device: 'Mobile', percentage: 30 },
      { device: 'Tablet', percentage: 5 }
    ],
    recentEvents: [
      { event: 'page_view', count: 45, timestamp: '2025-01-20T10:30:00Z' },
      { event: 'feature_used', count: 23, timestamp: '2025-01-20T10:25:00Z' },
      { event: 'api_call', count: 12, timestamp: '2025-01-20T10:20:00Z' },
      { event: 'error_occurred', count: 2, timestamp: '2025-01-20T10:15:00Z' }
    ]
  };

  // Fetch data from PostHog API
  const fetchPostHogData = async () => {
    setLoading(true);
    setError(null);

    try {
      // For now, use mock data since PostHog API requires special permissions
      // In the future, you can replace this with actual PostHog API calls
      setTimeout(() => {
        setData({
          events: mockAnalyticsData.recentEvents.map((event, index) => ({
            id: `event-${index}`,
            event: event.event,
            properties: { count: event.count },
            timestamp: event.timestamp
          })),
          pageViews: mockAnalyticsData.topPages,
          featureUsage: mockAnalyticsData.topFeatures,
          apiCalls: mockAnalyticsData.recentEvents.filter(e => e.event === 'api_call'),
          userJourney: [],
          deviceInfo: mockAnalyticsData.deviceBreakdown,
          performance: [],
          errors: mockAnalyticsData.recentEvents.filter(e => e.event === 'error_occurred')
        });
        setLoading(false);
      }, 1000); // Simulate loading time
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
      setLoading(false);
    }
  };

  const getDateFromTimeRange = (range: string): string => {
    const now = new Date();
    switch (range) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(0).toISOString();
    }
  };

  // PostHog API calls
  const fetchEvents = async (dateFrom: string): Promise<PostHogEvent[]> => {
    const config = getPostHogConfig();
    const response = await fetch(`${config.host}/api/projects/@current/events/?date_from=${dateFrom}&limit=100`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('PostHog API Error:', response.status, response.statusText);
      throw new Error(`Failed to fetch events: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
  };

  const fetchPageViews = async (dateFrom: string): Promise<any[]> => {
    const config = getPostHogConfig();
    const response = await fetch(`${config.host}/api/projects/@current/insights/trend/?events=[{"id":"page_viewed","type":"events"}]&date_from=${dateFrom}&interval=day`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch page views');
    const data = await response.json();
    return data.result || [];
  };

  const fetchFeatureUsage = async (dateFrom: string): Promise<any[]> => {
    const config = getPostHogConfig();
    const response = await fetch(`${config.host}/api/projects/@current/insights/trend/?events=[{"id":"feature_used","type":"events"}]&date_from=${dateFrom}&interval=day`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch feature usage');
    const data = await response.json();
    return data.result || [];
  };

  const fetchAPICalls = async (dateFrom: string): Promise<any[]> => {
    const config = getPostHogConfig();
    const response = await fetch(`${config.host}/api/projects/@current/insights/trend/?events=[{"id":"api_call","type":"events"}]&date_from=${dateFrom}&interval=day`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch API calls');
    const data = await response.json();
    return data.result || [];
  };

  const fetchUserJourney = async (dateFrom: string): Promise<any[]> => {
    const config = getPostHogConfig();
    const response = await fetch(`${config.host}/api/projects/@current/insights/trend/?events=[{"id":"user_journey","type":"events"}]&date_from=${dateFrom}&interval=day`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch user journey');
    const data = await response.json();
    return data.result || [];
  };

  const fetchDeviceInfo = async (dateFrom: string): Promise<any[]> => {
    const config = getPostHogConfig();
    const response = await fetch(`${config.host}/api/projects/@current/insights/trend/?events=[{"id":"device_info","type":"events"}]&date_from=${dateFrom}&interval=day`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch device info');
    const data = await response.json();
    return data.result || [];
  };

  const fetchPerformance = async (dateFrom: string): Promise<any[]> => {
    const config = getPostHogConfig();
    const response = await fetch(`${config.host}/api/projects/@current/insights/trend/?events=[{"id":"page_performance","type":"events"}]&date_from=${dateFrom}&interval=day`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch performance data');
    const data = await response.json();
    return data.result || [];
  };

  const fetchErrors = async (dateFrom: string): Promise<any[]> => {
    const config = getPostHogConfig();
    const response = await fetch(`${config.host}/api/projects/@current/insights/trend/?events=[{"id":"error_occurred","type":"events"}]&date_from=${dateFrom}&interval=day`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch error data');
    const data = await response.json();
    return data.result || [];
  };

  useEffect(() => {
    fetchPostHogData();
  }, [timeRange]);

  // Calculate metrics
  const calculateMetrics = () => {
    const totalEvents = data.events.length;
    const uniqueUsers = new Set(data.events.map(e => e.person?.id).filter(Boolean)).size;
    const totalPageViews = data.pageViews.reduce((sum, item) => sum + (item.count || 0), 0);
    const totalFeatureUsage = data.featureUsage.reduce((sum, item) => sum + (item.count || 0), 0);
    const totalAPICalls = data.apiCalls.reduce((sum, item) => sum + (item.count || 0), 0);
    const totalErrors = data.errors.reduce((sum, item) => sum + (item.count || 0), 0);

    return {
      totalEvents,
      uniqueUsers,
      totalPageViews,
      totalFeatureUsage,
      totalAPICalls,
      totalErrors,
      errorRate: totalAPICalls > 0 ? (totalErrors / totalAPICalls * 100) : 0
    };
  };

  const metrics = calculateMetrics();

  // Process data for charts
  const processFeatureUsageData = () => {
    const featureCounts: Record<string, number> = {};
    data.events
      .filter(e => e.event === 'feature_used')
      .forEach(e => {
        const feature = e.properties.feature || 'Unknown';
        featureCounts[feature] = (featureCounts[feature] || 0) + 1;
      });

    return Object.entries(featureCounts)
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const processDeviceData = () => {
    const deviceCounts: Record<string, number> = {};
    data.events
      .filter(e => e.event === 'device_info')
      .forEach(e => {
        const deviceType = e.properties.device_type || 'Unknown';
        deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
      });

    return Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count);
  };

  const processAPIPerformanceData = () => {
    const apiCounts: Record<string, { calls: number; errors: number; avgDuration: number }> = {};
    
    data.events
      .filter(e => e.event === 'api_call')
      .forEach(e => {
        const api = e.properties.api || 'Unknown';
        if (!apiCounts[api]) {
          apiCounts[api] = { calls: 0, errors: 0, avgDuration: 0 };
        }
        apiCounts[api].calls++;
        if (e.properties.status >= 400) {
          apiCounts[api].errors++;
        }
        apiCounts[api].avgDuration += e.properties.duration || 0;
      });

    return Object.entries(apiCounts)
      .map(([api, data]) => ({
        api,
        calls: data.calls,
        errors: data.errors,
        avgDuration: Math.round(data.avgDuration / data.calls),
        errorRate: (data.errors / data.calls * 100)
      }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 10);
  };

  const processTimeSeriesData = () => {
    const timeData: Record<string, { date: string; pageViews: number; features: number; apiCalls: number; errors: number }> = {};
    
    // Process page views
    data.pageViews.forEach(item => {
      const date = item.date || item.day || 'Unknown';
      if (!timeData[date]) {
        timeData[date] = { date, pageViews: 0, features: 0, apiCalls: 0, errors: 0 };
      }
      timeData[date].pageViews += item.count || 0;
    });

    // Process feature usage
    data.featureUsage.forEach(item => {
      const date = item.date || item.day || 'Unknown';
      if (!timeData[date]) {
        timeData[date] = { date, pageViews: 0, features: 0, apiCalls: 0, errors: 0 };
      }
      timeData[date].features += item.count || 0;
    });

    // Process API calls
    data.apiCalls.forEach(item => {
      const date = item.date || item.day || 'Unknown';
      if (!timeData[date]) {
        timeData[date] = { date, pageViews: 0, features: 0, apiCalls: 0, errors: 0 };
      }
      timeData[date].apiCalls += item.count || 0;
    });

    // Process errors
    data.errors.forEach(item => {
      const date = item.date || item.day || 'Unknown';
      if (!timeData[date]) {
        timeData[date] = { date, pageViews: 0, features: 0, apiCalls: 0, errors: 0 };
      }
      timeData[date].errors += item.count || 0;
    });

    return Object.values(timeData).sort((a, b) => a.date.localeCompare(b.date));
  };

  const featureUsageData = processFeatureUsageData();
  const deviceData = processDeviceData();
  const apiPerformanceData = processAPIPerformanceData();
  const timeSeriesData = processTimeSeriesData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0CF2A0] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading PostHog analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Analytics Error</h3>
        <p>{error}</p>
        {error.includes('PostHog API key not configured') && (
          <div className="mt-4 p-4 bg-gray-800 rounded text-sm">
            <p className="text-gray-300 mb-2">To configure PostHog analytics:</p>
            <ol className="list-decimal list-inside text-gray-400 space-y-1">
              <li>Add <code className="bg-gray-700 px-1 rounded">VITE_PUBLIC_POSTHOG_KEY</code> to your environment variables</li>
              <li>Add <code className="bg-gray-700 px-1 rounded">VITE_PUBLIC_POSTHOG_HOST</code> to your environment variables</li>
              <li>Redeploy your application</li>
            </ol>
          </div>
        )}
        <button 
          onClick={fetchPostHogData}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light tracking-tight">PostHog Analytics Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Real-time analytics powered by PostHog</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 'day' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            24h
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 'week' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            7d
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 'month' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            30d
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === 'all' 
                ? 'bg-[#0CF2A0] text-black' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-blue-500/20">
              <Eye className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-300">Total Events</h3>
              <p className="text-3xl font-light text-white">{metrics.totalEvents.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <ArrowUpRight size={14} className="mr-1" />
            <span>{metrics.uniqueUsers} unique users</span>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-green-500/20">
              <Users className="text-green-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-300">Page Views</h3>
              <p className="text-3xl font-light text-white">{metrics.totalPageViews.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <ArrowUpRight size={14} className="mr-1" />
            <span>{metrics.totalFeatureUsage} feature interactions</span>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-yellow-500/20">
              <Zap className="text-yellow-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-300">API Calls</h3>
              <p className="text-3xl font-light text-white">{metrics.totalAPICalls.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <ArrowUpRight size={14} className="mr-1" />
            <span>{metrics.errorRate.toFixed(1)}% error rate</span>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-purple-500/20">
              <Activity className="text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-300">Errors</h3>
              <p className="text-3xl font-light text-white">{metrics.totalErrors.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-sm text-gray-400 flex items-center">
            <ArrowUpRight size={14} className="mr-1" />
            <span>Last {timeRange}</span>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-light mb-4 tracking-tight">Activity Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timeSeriesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="pageViews" stackId="1" stroke="#0CF2A0" fill="#0CF2A0" fillOpacity={0.3} />
                <Area type="monotone" dataKey="features" stackId="1" stroke="#FF1493" fill="#FF1493" fillOpacity={0.3} />
                <Area type="monotone" dataKey="apiCalls" stackId="1" stroke="#FFCC00" fill="#FFCC00" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Feature Usage */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-light mb-4 tracking-tight">Top Features Used</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={featureUsageData}
                layout="horizontal"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="feature" type="category" width={120} stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#0CF2A0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Device Distribution */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-light mb-4 tracking-tight">Device Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ device, percent }) => `${device} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* API Performance */}
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-light mb-4 tracking-tight">API Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={apiPerformanceData}
                layout="horizontal"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="api" type="category" width={100} stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="calls" fill="#FF1493" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Events */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
        <h3 className="text-lg font-light mb-4 tracking-tight">Recent Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 font-normal text-gray-400">Event</th>
                <th className="text-left py-3 px-4 font-normal text-gray-400">User</th>
                <th className="text-left py-3 px-4 font-normal text-gray-400">Properties</th>
                <th className="text-left py-3 px-4 font-normal text-gray-400">Time</th>
              </tr>
            </thead>
            <tbody>
              {data.events.slice(0, 10).map((event) => (
                <tr key={event.id} className="border-b border-gray-800">
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                      event.event === 'page_viewed' ? 'bg-blue-500/20 text-blue-400' :
                      event.event === 'feature_used' ? 'bg-green-500/20 text-green-400' :
                      event.event === 'api_call' ? 'bg-yellow-500/20 text-yellow-400' :
                      event.event === 'error_occurred' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {event.event}
                      </span>
                    </td>
                  <td className="py-3 px-4 text-gray-300">
                    {event.person?.id ? event.person.id.substring(0, 8) + '...' : 'Anonymous'}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {Object.entries(event.properties)
                      .slice(0, 3)
                      .map(([key, value]) => `${key}: ${String(value).substring(0, 20)}`)
                      .join(', ')}
                  </td>
                    <td className="py-3 px-4 text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;