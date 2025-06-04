// Manual user creation script
// Run this in browser console on the debug page

async function createTestUser() {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabase = createClient(
    'https://kwpuuednejlxlbghsqln.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cHV1ZWRuZWpseGxiZ2hzcWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNTEwMzUsImV4cCI6MjA2MzkyNzAzNX0.BQ5t7bV7pKU8PY169KYcxiRcxSbl-04HYOYU4SedE9Q'
  );

  // Try to sign up the user
  const { data, error } = await supabase.auth.signUp({
    email: 'vsc@gmail.com',
    password: 'test1234'
  });

  console.log('User creation result:', { data, error });
  
  if (error) {
    console.error('Failed to create user:', error.message);
  } else {
    console.log('User created successfully or already exists');
  }
}

// Call the function
createTestUser();
