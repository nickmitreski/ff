# 🔧 API Management & Debugging Guide

## 📋 Overview

This guide provides comprehensive information about managing and debugging API integrations in the project, with a focus on LLM APIs, environment variables, and error handling.

## 🎯 Key Recommendations

### **1. Environment Variables vs Supabase Storage**

**✅ RECOMMENDED: Environment Variables (Vercel)**
- **Primary choice** for production deployments
- **Better security** - keys are encrypted and not stored in database
- **Easier management** - centralized in Vercel dashboard
- **No database queries** - faster API calls
- **Automatic rotation** - easier to update keys

**⚠️ FALLBACK: Supabase Storage**
- Use only as backup when environment variables fail
- Requires database queries (slower)
- More complex key rotation
- Good for development/testing

### **2. API Key Management Strategy**

```typescript
// Priority order for API key retrieval:
1. Environment Variables (VITE_*)
2. Supabase Database (fallback)
3. Demo/placeholder keys (development only)
```

## 🔍 Debugging Tools

### **1. API Debugger Dashboard**

Access the API Debugger from the Admin Panel:
1. Go to `/admin`
2. Click "API Debugger" in the sidebar
3. Use the tabs to diagnose issues:

#### **Environment Status Tab**
- Shows all environment variables
- Displays API key prefixes (first 10 characters)
- Indicates development vs production mode

#### **API Tests Tab**
- Tests all API endpoints
- Shows response times
- Displays detailed error messages

#### **Debug Logs Tab**
- Real-time API call logs
- Request/response details
- Error tracking with context

#### **API Keys Tab**
- Validates all API keys
- Shows key sources (env vs supabase)
- Provides suggestions for issues

### **2. Browser Console Debugging**

```javascript
// Access debug utilities in browser console
window.apiDebugger.getStatus()           // Environment status
window.apiDebugger.validateKey(key, 'openai')  // Validate specific key
window.apiDebugger.exportLog()           // Export debug logs
```

## 🚨 Common Issues & Solutions

### **1. "Incorrect API key provided" Error**

**Symptoms:**
- 401 errors from OpenAI/Mistral
- Console shows placeholder keys

**Solutions:**
1. **Check Vercel Environment Variables:**
   ```bash
   # In Vercel Dashboard > Settings > Environment Variables
   VITE_OPENAI_API_KEY=sk-your-actual-key
   VITE_MISTRAL_API_KEY=your-actual-mistral-key
   ```

2. **Verify Key Format:**
   - OpenAI: Starts with `sk-`
   - Mistral: 32+ characters
   - Supabase: Starts with `eyJ`

3. **Check for Placeholders:**
   - Remove any keys containing "your-" or "placeholder"
   - Ensure keys are complete (not truncated)

### **2. "Failed to load resource" Errors**

**Symptoms:**
- 404/401 errors for PostHog, Google APIs
- MIME type errors

**Solutions:**
1. **PostHog Issues:**
   ```bash
   # Set valid PostHog key or disable
   VITE_POSTHOG_KEY=your-actual-key
   # OR disable completely
   VITE_POSTHOG_KEY=disabled
   ```

2. **Google APIs:**
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
   VITE_YOUTUBE_API_KEY=your-youtube-key
   ```

### **3. Supabase Connection Issues**

**Symptoms:**
- Database queries failing
- Authentication errors

**Solutions:**
1. **Check Supabase URL:**
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

2. **Verify Anon Key:**
   ```bash
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 🔧 Environment Variable Setup

### **Required Variables for Vercel**

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# LLM APIs
VITE_OPENAI_API_KEY=sk-your-openai-api-key
VITE_MISTRAL_API_KEY=your-mistral-api-key

# Google APIs
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_YOUTUBE_API_KEY=your-youtube-api-key

# Analytics
VITE_POSTHOG_KEY=your-posthog-key
VITE_POSTHOG_HOST=https://app.posthog.com

# Server-side (Supabase Edge Functions)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
REPLICATE_API_KEY=your-replicate-api-key
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_PAGESPEED_API_KEY=your-google-pagespeed-api-key
SERPAPI_API_KEY=your-serpapi-api-key
```

### **Setting Up in Vercel**

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with correct values
5. Redeploy the application

## 🧪 Testing API Connections

### **1. Manual Testing**

```javascript
// Test OpenAI
const response = await fetch('https://api.openai.com/v1/models', {
  headers: { 'Authorization': `Bearer ${VITE_OPENAI_API_KEY}` }
});

// Test Mistral
const response = await fetch('https://api.mistral.ai/v1/models', {
  headers: { 'Authorization': `Bearer ${VITE_MISTRAL_API_KEY}` }
});

// Test Supabase
const response = await fetch(`${VITE_SUPABASE_URL}/rest/v1/`, {
  headers: { 
    'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`,
    'apikey': VITE_SUPABASE_ANON_KEY
  }
});
```

### **2. Using the Debugger**

1. Open API Debugger in Admin Panel
2. Go to "API Tests" tab
3. Click "Run Tests"
4. Review results for each provider

## 📊 Monitoring & Logging

### **1. Debug Logs**

The system automatically logs:
- All API calls with timestamps
- Response times
- Error details
- API key sources

### **2. Exporting Logs**

```javascript
// Export logs for analysis
const logs = window.apiDebugger.exportLog();
// Downloads as JSON file
```

### **3. Real-time Monitoring**

- Check browser console for live logs
- Use API Debugger dashboard
- Monitor Vercel function logs

## 🔒 Security Best Practices

### **1. API Key Security**

- ✅ Use environment variables in production
- ✅ Rotate keys regularly
- ✅ Use least-privilege access
- ❌ Never commit keys to git
- ❌ Don't expose keys in client-side code

### **2. Error Handling**

- ✅ Log errors without exposing sensitive data
- ✅ Use fallback mechanisms
- ✅ Graceful degradation
- ❌ Don't expose full error messages to users

### **3. Rate Limiting**

- Monitor API usage
- Implement request throttling
- Use appropriate timeouts

## 🚀 Performance Optimization

### **1. API Call Optimization**

```typescript
// Use appropriate models
- OpenAI: gpt-3.5-turbo (cheaper, faster)
- Mistral: mistral-tiny (cheapest option)

// Implement caching where possible
// Use connection pooling for database
```

### **2. Error Recovery**

```typescript
// Implement retry logic
const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2 ** i * 1000));
    }
  }
};
```

## 📞 Support & Troubleshooting

### **1. When to Use Each Debugging Tool**

- **API Debugger Dashboard**: Comprehensive analysis
- **Browser Console**: Quick checks and real-time monitoring
- **Vercel Logs**: Server-side function debugging
- **Supabase Dashboard**: Database and authentication issues

### **2. Common Debugging Workflow**

1. **Identify the Issue**: Check browser console for errors
2. **Use API Debugger**: Run tests and check environment status
3. **Validate Keys**: Ensure all API keys are correct
4. **Check Network**: Verify API endpoints are accessible
5. **Review Logs**: Export and analyze debug logs
6. **Test Manually**: Use browser console for direct API calls

### **3. Getting Help**

- Check this guide first
- Use the API Debugger dashboard
- Review browser console logs
- Check Vercel deployment logs
- Verify environment variables in Vercel dashboard

## 🔄 Maintenance

### **Regular Tasks**

1. **Monthly**: Review API usage and costs
2. **Quarterly**: Rotate API keys
3. **As needed**: Update this guide with new issues/solutions

### **Monitoring Checklist**

- [ ] All API keys are valid
- [ ] Environment variables are set correctly
- [ ] No placeholder keys in production
- [ ] Error rates are acceptable
- [ ] Response times are reasonable
- [ ] Costs are within budget

---

**Last Updated**: January 2025
**Version**: 1.0 