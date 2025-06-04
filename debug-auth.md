# Authentication Error Debugging Guide

## Current Issue

```
AuthApiError: Invalid login credentials
    at handleError (fetch.js:80:11)
    at async _handleRequest (fetch.js:123:9)
    at async _request (fetch.js:105:18)
    at async SupabaseAuthClient.signInWithPassword (GoTrueClient.js:357:23)
    at async getAuthToken (inventory-list.tsx:87:44)
```

## Root Causes

### 1. Environment Variables Not Accessible in Client Components

- `process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL` and `process.env.NEXT_PUBLIC_SUPABASE_USER_PASSWORD` may not be properly loaded
- Client-side components can only access variables prefixed with `NEXT_PUBLIC_`

### 2. Supabase Client Instance Mismatch

- Different Supabase client creation methods used across files
- Potential configuration inconsistencies

## Debugging Steps

### Step 1: Check Environment Variables

1. Open browser DevTools → Console
2. Run: `console.log(process.env)`
3. Verify your Supabase credentials are available

### Step 2: Test Supabase Connection

1. Create a simple test to verify Supabase connectivity
2. Test authentication with hardcoded credentials (temporarily)

### Step 3: Check Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Authentication → Users
3. Verify the test user exists with correct email
4. Check if the user is confirmed/verified

### Step 4: Verify Environment File

1. Ensure `.env` file is in the project root
2. Restart development server after env changes
3. Check for syntax errors in .env file

## Quick Fixes to Try

### Fix 1: Console Debug in Browser

Open browser console and run:

```javascript
console.log('Email:', process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL);
console.log('Password:', process.env.NEXT_PUBLIC_SUPABASE_USER_PASSWORD);
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

### Fix 2: Test Direct Authentication

In browser console:

```javascript
// Test with your actual credentials
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('your-url', 'your-anon-key');
supabase.auth
    .signInWithPassword({
        email: 'vsc@gmail.com',
        password: 'test1234',
    })
    .then(console.log)
    .catch(console.error);
```

### Fix 3: Check User in Supabase Dashboard

1. Login to supabase.com
2. Go to your project
3. Navigate to Authentication → Users
4. Look for user with email 'vsc@gmail.com'
5. If not found, create the user manually

## Recommended Solutions

### Solution 1: Fix Environment Variable Access

### Solution 2: Implement Proper Error Handling

### Solution 3: Use Session-Based Authentication

### Solution 4: Create Authentication Context
