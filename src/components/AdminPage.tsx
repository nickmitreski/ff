import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Activity, Mail, Database, LogOut, Key, FileText, Sticker as Sticky, BarChart2, Briefcase, CreditCard, DollarSign, Bell, LucideIcon, Search, Palette } from 'lucide-react';
import ApiKeyManager from './admin/ApiKeyManager';
import APIDebugger from './admin/APIDebugger';

import ContactSubmissionList from './admin/ContactSubmissionList';
import DesignRequestList from './admin/DesignRequestList';
import TodoList from './admin/TodoList';
import NotesList from './admin/NotesList';
import AnalyticsDashboard from './admin/AnalyticsDashboard';
import ClientsJobsManager from './admin/ClientsJobsManager';
import FinancialDashboard from './admin/FinancialDashboard';
import SubscriptionManager from './admin/SubscriptionManager';
import ComingSoonNotificationsManager from './admin/ComingSoonNotificationsManager';
import SeoAudits from './admin/SeoAudits';
import SeoAnalyzer from './admin/SeoAnalyzer';
import { testGeminiApiKey, testOpenAIApiKey, testGrokApiKey, testDeepseekApiKey } from '../lib/llm';
import posthog from 'posthog-js';

export interface PageView {
  id: string; // UUID
  page: string;
  timestamp: string;
  session_id?: string;
  user_agent?: string;
  referrer?: string;
  ip_address?: string;
}

export interface ClickEvent {
  id: string;
  element: string;
  page: string;
  timestamp: string;
  session_id?: string;
  element_type?: string;
  element_text?: string;
  element_class?: string;
  element_id?: string;
}

export interface VisitDuration {
  id: string;
  duration: number;
  page: string;
  timestamp: string;
  session_id?: string;
  is_bounce?: boolean;
}

export interface ContactSubmission {
  id: string; // UUID
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status?: string;
  responded_at?: string;
  response_by?: string;
  admin_notes?: string;
}

export interface DesignRequest {
  id: string; // UUID
  email: string;
  service_type: string;
  request_details?: string;
  timestamp: string;
  status?: string;
  responded_at?: string;
  response_by?: string;
  admin_notes?: string;
}

export interface Video {
  id: string; // UUID
  url: string;
  name: string;
  timestamp: string;
  description?: string;
  duration?: number;
  size?: number;
  format?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
}

export interface ApiKey {
  id: string;
  provider: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  last_used_at?: string;
  usage_count: number;
}

export interface Todo {
  id: string;
  user_id?: string;
  created_at: string;
  task: string;
  is_completed: boolean;
}

export interface Note {
  id: string;
  user_id?: string;
  created_at: string;
  title: string | null;
  content: string | null;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  created_at: string;
  status: 'active' | 'inactive' | 'lead';
  notes?: string;
}

export interface Job {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  created_at: string;
  due_date?: string;
  status: 'not_started' | 'in_progress' | 'review' | 'completed';
  progress: number; // 0-100
  assigned_to?: string[];
  budget?: number;
  invoiced_amount?: number;
  paid_amount?: number;
}

export interface Subscription {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  plan_name: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  status: 'active' | 'canceled' | 'past_due';
  start_date: string;
  end_date?: string;
  next_billing_date?: string;
  payment_method?: string;
}

export interface ApiCost {
  id: string;
  provider: string;
  service: string;
  cost: number;
  period: string;
  date: string;
  notes?: string;
}

export interface Revenue {
  id: string;
  source: string;
  amount: number;
  date: string;
  description?: string;
  category: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
  recurring: boolean;
}

export interface ComingSoonNotification {
  id: string;
  email: string;
  feature_name: string;
  created_at: string;
  notified: boolean;
  notified_at: string | null;
}

const AdminPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Data states
  const [activeTab, setActiveTab] = useState<'analytics' | 'contacts' | 'design-requests' | 'supabase-status' | 'api-keys' | 'todos' | 'notes' | 'clients-jobs' | 'subscriptions' | 'financials' | 'coming-soon' | 'seo-audits' | 'seo-analyzer'>('analytics');
  const [isAPIDebuggerOpen, setIsAPIDebuggerOpen] = useState(false);
  // Debug effect for API Debugger
  useEffect(() => {
    console.log('APIDebugger state changed:', isAPIDebuggerOpen);
  }, [isAPIDebuggerOpen]);

  // Additional debugging for production
  useEffect(() => {
    console.log('AdminPage mounted, isAuthenticated:', isAuthenticated);
    console.log('APIDebugger import check:', typeof APIDebugger);
  }, []);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [designRequests, setDesignRequests] = useState<DesignRequest[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [apiCosts, setApiCosts] = useState<ApiCost[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [comingSoonNotifications, setComingSoonNotifications] = useState<ComingSoonNotification[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // API Key management states
  const [newApiKey, setNewApiKey] = useState({ provider: '', api_key: '' });
  const [isAddingKey, setIsAddingKey] = useState(false);

  // Supabase Status states
  const [supabaseAuthStatus, setSupabaseAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated' | 'error'>('checking');
  const [supabaseAuthUser, setSupabaseAuthUser] = useState<string | null>(null);
  const [supabaseDbStatus, setSupabaseDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [supabaseStorageStatus, setSupabaseStorageStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [supabaseDetails, setSupabaseDetails] = useState<Record<string, unknown>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSupabaseAuthStatus('checking');
    setSupabaseError(null);

    try {
      const supabaseClient = supabase();
      if (!supabaseClient || !supabaseClient.auth) {
        throw new Error('Supabase client not properly initialized');
      }

      const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
      if (data?.user) {
        setIsAuthenticated(true);
        setCurrentUserId(data.user.id);
        setSupabaseAuthStatus('authenticated');
        setSupabaseAuthUser(data.user.email || null);
        
        // Track login with PostHog
        posthog.capture('admin_login_success', {
          email: data.user.email
        });
      } else {
         setSupabaseAuthStatus('unauthenticated');
         setSupabaseAuthUser(null);
         setCurrentUserId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSupabaseAuthStatus('error');
      setSupabaseError(err instanceof Error ? err.message : String(err));
      
      // Track login failure with PostHog
      posthog.capture('admin_login_failure', {
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setDataLoading(true);
    setSupabaseDbStatus('checking');
    setSupabaseStorageStatus('checking');
    setSupabaseError(null);
    const supabaseDetails: Record<string, any> = {};

    try {
      // Get PostHog data instead of Supabase analytics
      try {
        // This is a placeholder - in a real implementation, you would use PostHog's API
        // to fetch analytics data. For now, we'll use mock data.
        const mockPageViews = Array(20).fill(null).map((_, i) => ({
          id: `pv-${i}`,
          page: `/page-${i % 5}`,
          timestamp: new Date(Date.now() - i * 3600000).toISOString(),
          session_id: `session-${Math.floor(i / 3)}`,
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          referrer: i % 3 === 0 ? 'https://google.com' : null
        }));
        
        const mockClickEvents = Array(15).fill(null).map((_, i) => ({
          id: `click-${i}`,
          element: `button-${i % 4}`,
          page: `/page-${i % 5}`,
          timestamp: new Date(Date.now() - i * 2400000).toISOString(),
          session_id: `session-${Math.floor(i / 3)}`,
          element_type: 'button',
          element_text: `Click me ${i}`
        }));
        
        const mockVisitDurations = Array(10).fill(null).map((_, i) => ({
          id: `duration-${i}`,
          duration: Math.floor(Math.random() * 300) + 30,
          page: `/page-${i % 5}`,
          timestamp: new Date(Date.now() - i * 3600000).toISOString(),
          session_id: `session-${Math.floor(i / 2)}`,
          is_bounce: i % 4 === 0
        }));
        
        // Mock analytics data - removed unused state variables
        
        supabaseDetails.analytics = {
          pageViews: mockPageViews.length,
          clickEvents: mockClickEvents.length,
          visitDurations: mockVisitDurations.length
        };
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      }
      
      // Fetch contact submissions
      const supabaseClient = supabase();
      if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
      }
      const { data: contactsData, error: contactsError } = await supabaseClient
        .from('contact_submissions')
        .select('*')
        .order('timestamp', { ascending: false });

      if (contactsError) throw contactsError;
      if (contactsData) {
        setContactSubmissions(contactsData as unknown as ContactSubmission[]);
        supabaseDetails.contactSubmissions = {
          count: contactsData.length,
          lastUpdated: contactsData[0]?.timestamp || 'N/A'
        };
      }

      // Fetch design requests
      const { data: designRequestsData, error: designRequestsError } = await supabaseClient
        .from('design_requests')
        .select('*')
        .order('timestamp', { ascending: false });

      if (designRequestsError) throw designRequestsError;
      if (designRequestsData) {
        setDesignRequests(designRequestsData as unknown as DesignRequest[]);
        supabaseDetails.designRequests = {
          count: designRequestsData.length,
          lastUpdated: designRequestsData[0]?.timestamp || 'N/A'
        };
      }

      // Fetch API keys
      const { data: apiKeysData, error: apiKeysError } = await supabaseClient
        .from('api_keys')
        .select('*')
        .order('provider', { ascending: true });

      if (apiKeysError) throw apiKeysError;
      if (apiKeysData) {
        setApiKeys(apiKeysData as unknown as ApiKey[]);
        supabaseDetails.apiKeys = {
          count: apiKeysData.length,
          activeCount: apiKeysData.filter(key => key.is_active).length
        };
      }

      // Fetch todos
      const { data: todosData, error: todosError } = await supabaseClient
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (todosError) throw todosError;
      if (todosData) {
        setTodos(todosData as unknown as Todo[]);
        supabaseDetails.todos = {
          count: todosData.length,
          completedCount: todosData.filter(todo => todo.is_completed).length
        };
      }

      // Fetch notes
      const { data: notesData, error: notesError } = await supabaseClient
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (notesError) throw notesError;
      if (notesData) {
        setNotes(notesData as unknown as Note[]);
        supabaseDetails.notes = {
          count: notesData.length
        };
      }

      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabaseClient
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) {
        // If table doesn't exist, create it
        if (clientsError.code === '42P01') {
          const supabaseClient = supabase();
          if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
          }
          await supabaseClient.rpc('create_clients_table');
          const { data: newClientsData } = await supabaseClient
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });
          if (newClientsData) setClients(newClientsData as unknown as Client[]);
        } else {
          throw clientsError;
        }
      } else if (clientsData) {
        setClients(clientsData as unknown as Client[]);
        supabaseDetails.clients = {
          count: clientsData.length,
          activeCount: clientsData.filter(client => client.status === 'active').length
        };
      }

      // Fetch jobs
      const { data: jobsData, error: jobsError } = await supabaseClient
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (jobsError) {
        // If table doesn't exist, create it
        if (jobsError.code === '42P01') {
          const supabaseClient = supabase();
          if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
          }
          await supabaseClient.rpc('create_jobs_table');
          const { data: newJobsData } = await supabaseClient
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });
          if (newJobsData) setJobs(newJobsData as unknown as Job[]);
        } else {
          throw jobsError;
        }
      } else if (jobsData) {
        setJobs(jobsData as unknown as Job[]);
        supabaseDetails.jobs = {
          count: jobsData.length,
          completedCount: jobsData.filter(job => job.status === 'completed').length,
          inProgressCount: jobsData.filter(job => job.status === 'in_progress').length
        };
      }

      // Fetch subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabaseClient
        .from('subscriptions')
        .select('*')
        .order('start_date', { ascending: false });

      if (subscriptionsError) {
        // If table doesn't exist, create it
        if (subscriptionsError.code === '42P01') {
          const supabaseClient = supabase();
          if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
          }
          await supabaseClient.rpc('create_subscriptions_table');
          const { data: newSubscriptionsData } = await supabaseClient
            .from('subscriptions')
            .select('*')
            .order('start_date', { ascending: false });
          if (newSubscriptionsData) setSubscriptions(newSubscriptionsData as unknown as Subscription[]);
        } else {
          throw subscriptionsError;
        }
      } else if (subscriptionsData) {
        setSubscriptions(subscriptionsData as unknown as Subscription[]);
        supabaseDetails.subscriptions = {
          count: subscriptionsData.length,
          activeCount: subscriptionsData.filter(sub => sub.status === 'active').length,
          monthlyRevenue: subscriptionsData
            .filter(sub => sub.status === 'active' && sub.interval === 'month')
            .reduce((acc, curr) => acc + (typeof curr.amount === 'number' ? curr.amount : 0), 0),
          yearlyRevenue: subscriptionsData
            .filter(sub => sub.status === 'active' && sub.interval === 'year')
            .reduce((acc, curr) => acc + (typeof curr.amount === 'number' ? curr.amount : 0), 0) / 12 // Monthly equivalent
        };
      }

      // Fetch API costs
      const { data: apiCostsData, error: apiCostsError } = await supabaseClient
        .from('api_costs')
        .select('*')
        .order('date', { ascending: false });

      if (apiCostsError) {
        // If table doesn't exist, create it
        if (apiCostsError.code === '42P01') {
          const supabaseClient = supabase();
          if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
          }
          await supabaseClient.rpc('create_api_costs_table');
          const { data: newApiCostsData } = await supabaseClient
            .from('api_costs')
            .select('*')
            .order('date', { ascending: false });
          if (newApiCostsData) setApiCosts(newApiCostsData as unknown as ApiCost[]);
        } else {
          throw apiCostsError;
        }
      } else if (apiCostsData) {
        setApiCosts(apiCostsData as unknown as ApiCost[]);
        supabaseDetails.apiCosts = {
          count: apiCostsData.length,
          totalCost: apiCostsData.reduce((acc, curr) => acc + (curr.cost as number), 0)
        };
      }

      // Fetch revenues
      const { data: revenuesData, error: revenuesError } = await supabaseClient
        .from('revenues')
        .select('*')
        .order('date', { ascending: false });

      if (revenuesError) {
        // If table doesn't exist, create it
        if (revenuesError.code === '42P01') {
          const supabaseClient = supabase();
          if (!supabaseClient) {
            throw new Error('Supabase client not initialized');
          }
          await supabaseClient.rpc('create_revenues_table');
          const { data: newRevenuesData } = await supabaseClient
            .from('revenues')
            .select('*')
            .order('date', { ascending: false });
          if (newRevenuesData) setRevenues(newRevenuesData as unknown as Revenue[]);
        } else {
          throw revenuesError;
        }
              } else if (revenuesData) {
          setRevenues(revenuesData as unknown as Revenue[]);
          supabaseDetails.revenues = {
            count: revenuesData.length,
            totalRevenue: revenuesData.reduce((acc, curr) => acc + (curr.amount as number), 0)
          };
        }

      // Fetch coming soon notifications
      const { data: comingSoonData, error: comingSoonError } = await supabaseClient
        .from('coming_soon_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (comingSoonError) {
        console.warn('Coming soon notifications table might not exist yet:', comingSoonError);
      } else if (comingSoonData) {
        setComingSoonNotifications(comingSoonData as unknown as ComingSoonNotification[]);
      }

      // Set database status to connected
      setSupabaseDetails(supabaseDetails);
      setSupabaseDbStatus('connected');
      setSupabaseStorageStatus('error'); // Since we don't have storage buckets

    } catch (err) {
      console.error('Error fetching data:', err);
      setSupabaseError(err instanceof Error ? err.message : String(err));
      setSupabaseDbStatus('error');
      setSupabaseStorageStatus('error');
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiKey.provider || !newApiKey.api_key) return;
    
    setIsAddingKey(true);
    setError(null);

    try {
      // Test the API key if it's a supported provider
      if (['gemini', 'openai', 'grok', 'deepseek'].includes(newApiKey.provider)) {
        let isValid = false;
        
        switch (newApiKey.provider) {
          case 'gemini':
            isValid = await testGeminiApiKey(newApiKey.api_key);
            break;
          case 'openai':
            isValid = await testOpenAIApiKey(newApiKey.api_key);
            break;
          case 'grok':
            isValid = await testGrokApiKey(newApiKey.api_key);
            break;
          case 'deepseek':
            isValid = await testDeepseekApiKey(newApiKey.api_key);
            break;
        }
        
        if (!isValid) {
          throw new Error(`Invalid API key for ${newApiKey.provider}`);
        }
      }

      const supabaseClient = supabase();
      if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
      }
      const { data, error: insertError } = await supabaseClient
        .from('api_keys')
        .insert({
          provider: newApiKey.provider,
          api_key: newApiKey.api_key,
          is_active: true,
          created_by: supabaseAuthUser || 'admin'
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (data) {
        setApiKeys(prev => [...prev, data as unknown as ApiKey]);
        setNewApiKey({ provider: '', api_key: '' });
        
        // Track with PostHog
        posthog.capture('api_key_added', {
          provider: newApiKey.provider
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add API key');
      
      // Track error with PostHog
      posthog.capture('api_key_add_error', {
        error: err instanceof Error ? err.message : 'Unknown error',
        provider: newApiKey.provider
      });
    } finally {
      setIsAddingKey(false);
    }
  };

  const handleToggleApiKey = async (id: string, currentStatus: boolean) => {
    try {
      const supabaseClient = supabase();
      if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
      }
      const { error: updateError } = await supabaseClient
        .from('api_keys')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (updateError) throw updateError;
      
      setApiKeys(prev => prev.map(key => 
        key.id === id ? { ...key, is_active: !currentStatus } : key
      ));
      
      // Track with PostHog
      posthog.capture('api_key_toggled', {
        new_status: !currentStatus ? 'active' : 'inactive'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update API key');
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      const supabaseClient = supabase();
      if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
      }
      const { error: deleteError } = await supabaseClient
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setApiKeys(prev => prev.filter(key => key.id !== id));
      
      // Track with PostHog
      posthog.capture('api_key_deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete API key');
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const supabaseClient = supabase();
        if (!supabaseClient || !supabaseClient.auth) {
          setSupabaseAuthStatus('error');
          setSupabaseError('Supabase client not properly initialized');
          return;
        }

        const { data, error: userError } = await supabaseClient.auth.getUser();
        if (userError) {
          setSupabaseAuthStatus('error');
          setSupabaseError(userError.message);
        } else if (data?.user) {
          setIsAuthenticated(true);
          setCurrentUserId(data.user.id);
          setSupabaseAuthStatus('authenticated');
          setSupabaseAuthUser(data.user.email || null);
          fetchData();
          
          // Track with PostHog
          posthog.identify(data.user.id, {
            email: data.user.email,
            role: 'admin'
          });
        } else {
          setIsAuthenticated(false);
          setSupabaseAuthStatus('unauthenticated');
          setSupabaseAuthUser(null);
          setCurrentUserId(null);
        }
      } catch (error) {
        setSupabaseAuthStatus('error');
        setSupabaseError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    checkAuthStatus();

    try {
      const supabaseClient = supabase();
      if (!supabaseClient || !supabaseClient.auth) {
        setSupabaseAuthStatus('error');
        setSupabaseError('Supabase client not properly initialized');
        return;
      }

      const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          setIsAuthenticated(true);
          setCurrentUserId(session?.user?.id || null);
          setSupabaseAuthStatus('authenticated');
          setSupabaseAuthUser(session?.user?.email || null);
          fetchData();
          
          // Track with PostHog
          if (session?.user) {
            posthog.identify(session.user.id, {
              email: session.user.email,
              role: 'admin'
            });
            posthog.capture('admin_signed_in');
          }
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setCurrentUserId(null);
          setSupabaseAuthStatus('unauthenticated');
          setSupabaseAuthUser(null);
          // Removed unused pageViews state
          setContactSubmissions([]);
          setApiKeys([]);
          setTodos([]);
          setNotes([]);
          
          // Track with PostHog
          posthog.capture('admin_signed_out');
          posthog.reset();
        }
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
    } catch (error) {
      setSupabaseAuthStatus('error');
      setSupabaseError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Track with PostHog before logging out
      posthog.capture('admin_logout_initiated');
      
      const supabaseClient = supabase();
      if (!supabaseClient || !supabaseClient.auth) {
        setSupabaseAuthStatus('error');
        setSupabaseError('Supabase client not properly initialized');
        return;
      }

      const { error: signOutError } = await supabaseClient.auth.signOut();
      if (signOutError) {
        setSupabaseAuthStatus('error');
        setSupabaseError(signOutError.message);
      } else {
        setIsAuthenticated(false);
        setCurrentUserId(null);
        setSupabaseAuthStatus('unauthenticated');
        setSupabaseAuthUser(null);
      }
    } catch (error) {
      setSupabaseAuthStatus('error');
      setSupabaseError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const TabButton = ({ tab, icon: Icon, label }: { tab: typeof activeTab; icon: LucideIcon; label: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        // Track tab change with PostHog
        posthog.capture('admin_tab_change', { tab });
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
        activeTab === tab
          ? 'bg-[#0CF2A0] text-black'
          : 'text-gray-400 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon size={18} />
      <span className="font-light tracking-tight">{label}</span>
    </button>
  );

  const StatusIndicator = ({ status }: { status: 'checking' | 'connected' | 'error' | 'authenticated' | 'unauthenticated' }) => {
     let colorClass = 'text-gray-500';
     let text = 'Checking...';
     let Icon = Activity;

     if (status === 'connected' || status === 'authenticated') {
       colorClass = 'text-green-500';
       text = status === 'connected' ? 'Connected' : 'Authenticated';
       Icon = Database;
     } else if (status === 'error') {
       colorClass = 'text-red-500';
       text = 'Error';
       Icon = Activity;
     } else if (status === 'unauthenticated') {
        colorClass = 'text-yellow-500';
        text = 'Unauthenticated';
        Icon = Database;
     }

     return (
       <span className={`flex items-center gap-2 ${colorClass}`}>
         <Icon size={18} />
         {text}
       </span>
     );
  };

  if (isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-black text-white">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-[#1a1a1a] min-h-screen p-6 border-r border-gray-800">
            <h1 className="text-xl font-light mb-8 tracking-tight">Admin Dashboard</h1>
            <div className="space-y-2">
              <TabButton tab="analytics" icon={BarChart2} label="Analytics" />
              <TabButton tab="clients-jobs" icon={Briefcase} label="Clients & Jobs" />
              <TabButton tab="contacts" icon={Mail} label="Contact Forms" />
              <TabButton tab="design-requests" icon={Palette} label="Design Requests" />
              <TabButton tab="subscriptions" icon={CreditCard} label="Subscriptions" />
              <TabButton tab="financials" icon={DollarSign} label="Financials" />
              <TabButton tab="api-keys" icon={Key} label="API Keys" />
              <TabButton tab="todos" icon={FileText} label="Todo List" />
              <TabButton tab="notes" icon={Sticky} label="Notes" />
              <TabButton tab="coming-soon" icon={Bell} label="Coming Soon" />
              <TabButton tab="seo-audits" icon={Search} label="SEO Audits" />
              <TabButton tab="seo-analyzer" icon={Search} label="SEO Analyser" />
              <TabButton tab="supabase-status" icon={Database} label="Supabase Status" />
            </div>
            
            {/* API Debugger Button */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <button
                onClick={() => {
                  console.log('API Debugger button clicked');
                  console.log('Current isAPIDebuggerOpen state:', isAPIDebuggerOpen);
                  setIsAPIDebuggerOpen(true);
                  console.log('Set isAPIDebuggerOpen to true');
                }}
                className="flex items-center gap-2 px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded w-full transition-colors"
              >
                <Search size={18} />
                <span className="font-light tracking-tight">API Debugger</span>
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded mt-8 w-full transition-colors"
            >
              <LogOut size={18} />
              <span className="font-light tracking-tight">Logout</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {dataLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0CF2A0]"></div>
              </div>
            ) : (
              <>
                {activeTab === 'analytics' && (
                  <AnalyticsDashboard />
                )}

                {activeTab === 'clients-jobs' && (
                  <ClientsJobsManager 
                    clients={clients}
                    jobs={jobs}
                    setClients={setClients}
                    setJobs={setJobs}
                    currentUserId={currentUserId}
                  />
                )}

                {activeTab === 'contacts' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-light tracking-tight">Contact Form Submissions</h2>
                    <ContactSubmissionList contactSubmissions={contactSubmissions} setContactSubmissions={setContactSubmissions} />
                  </div>
                )}

                {activeTab === 'design-requests' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-light tracking-tight">Design Requests</h2>
                    <DesignRequestList designRequests={designRequests} setDesignRequests={setDesignRequests} />
                  </div>
                )}

                {activeTab === 'subscriptions' && (
                  <SubscriptionManager 
                    subscriptions={subscriptions}
                    setSubscriptions={setSubscriptions}
                  />
                )}

                {activeTab === 'financials' && (
                  <FinancialDashboard 
                    apiCosts={apiCosts}
                    revenues={revenues}
                    expenses={expenses}
                    setApiCosts={setApiCosts}
                    setRevenues={setRevenues}
                    setExpenses={setExpenses}
                  />
                )}

                {activeTab === 'api-keys' && (
                  <ApiKeyManager
                    apiKeys={apiKeys}
                    newApiKey={newApiKey}
                    isAddingKey={isAddingKey}
                    handleAddApiKey={handleAddApiKey}
                    handleToggleApiKey={handleToggleApiKey}
                    handleDeleteApiKey={handleDeleteApiKey}
                    setNewApiKey={setNewApiKey}
                    error={error}
                  />
                )}

                {activeTab === 'todos' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-light tracking-tight">Todo List</h2>
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
                      <TodoList todos={todos} setTodos={setTodos} currentUserId={currentUserId} />
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-light tracking-tight">Notes</h2>
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
                      <NotesList notes={notes} setNotes={setNotes} currentUserId={currentUserId} />
                    </div>
                  </div>
                )}

                {activeTab === 'coming-soon' && (
                  <ComingSoonNotificationsManager 
                    notifications={comingSoonNotifications}
                    setNotifications={setComingSoonNotifications}
                  />
                )}

                {activeTab === 'seo-audits' && (
                  <SeoAudits />
                )}

                {activeTab === 'seo-analyzer' && (
                  <SeoAnalyzer />
                )}

                {activeTab === 'supabase-status' && (
                   <div className="space-y-8">
                     <h2 className="text-2xl font-light tracking-tight">Supabase Status</h2>
                     <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 space-y-4">
                        <div>
                           <h3 className="text-lg font-light tracking-tight mb-2">Authentication Status: <StatusIndicator status={supabaseAuthStatus} /></h3>
                           {supabaseAuthUser && <p className="text-gray-400 text-sm">Logged in as: {supabaseAuthUser}</p>}
                        </div>
                        <div>
                           <h3 className="text-lg font-light tracking-tight mb-2">Database Status: <StatusIndicator status={supabaseDbStatus} /></h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                              {Object.entries(supabaseDetails).map(([key, value]) => (
                                 <div key={key} className="bg-black/20 p-4 rounded border border-gray-800">
                                    <h4 className="text-[#0CF2A0] capitalize mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                    <div className="space-y-1 text-sm">
                                       {Object.entries(value as Record<string, unknown>).map(([subKey, subValue]) => (
                                          <p key={subKey} className="text-gray-300">
                                             <span className="text-gray-500 capitalize">{subKey.replace(/([A-Z])/g, ' $1').trim()}:</span> {' '}
                                             {typeof subValue === 'object' ? JSON.stringify(subValue) : String(subValue)}
                                          </p>
                                       ))}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div>
                           <h3 className="text-lg font-light tracking-tight mb-2">Storage Status: <StatusIndicator status={supabaseStorageStatus} /></h3>
                           <p className="text-gray-400 text-sm">Storage buckets not configured</p>
                        </div>

                        {supabaseError && (
                           <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm">
                             Last Error: {supabaseError}
                           </div>
                        )}

                         <button
                           onClick={fetchData}
                           className="flex items-center gap-2 px-4 py-2 bg-[#0CF2A0] text-black rounded transition-colors hover:bg-[#07C280]"
                         >
                           <Activity size={18} />
                           <span className="font-light tracking-tight">Re-check Connections</span>
                         </button>
                     </div>
                   </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* API Debugger Modal */}
      <APIDebugger 
        isOpen={isAPIDebuggerOpen} 
        onClose={() => {
          console.log('APIDebugger onClose called');
          setIsAPIDebuggerOpen(false);
        }} 
      />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-lg border border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-light mb-6 tracking-tight text-center">Admin Login</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-light mb-2 tracking-tight">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-light mb-2 tracking-tight">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#0CF2A0] text-black py-3 rounded transition-colors hover:bg-[#07C280] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminPage;