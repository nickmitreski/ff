import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Get environment variables - these should be set in Vercel
const getSupabaseConfig = () => {
  return {
    url: config.supabase.url,
    anonKey: config.supabase.anonKey
  };
};

// Create the Supabase client with error handling
let supabase: ReturnType<typeof createClient>;

const initializeSupabase = () => {
  const config = getSupabaseConfig();
  
  if (!config.url || !config.anonKey) {
    console.error('Missing required Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    throw new Error('Supabase environment variables not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
  }

  try {
    supabase = createClient(config.url, config.anonKey);
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    throw new Error('Failed to initialize Supabase client');
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

export { getSupabase as supabase };

// Contact form submission with error handling
export const submitContactForm = async (data: {
  name: string;
  email: string;
  message: string;
}) => {
  try {
    const supabaseClient = getSupabase();
    if (!supabaseClient || !supabaseClient.from) {
      return { success: false, error: 'Supabase client not properly initialized' };
    }
    
    const { error } = await supabaseClient.from('contact_submissions').insert([
      { ...data, timestamp: new Date().toISOString() }
    ]);

    if (error) {
      console.error('Error submitting contact form:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error submitting contact form:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

// Video management with error handling
export const getVideos = async () => {
  try {
    const supabaseClient = getSupabase();
    if (!supabaseClient || !supabaseClient.from) {
      return { success: false, error: 'Supabase client not properly initialized', videos: [] };
    }
    
    const { data, error } = await supabaseClient
      .from('videos')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return { success: true, videos: data };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { success: false, error, videos: [] };
  }
};