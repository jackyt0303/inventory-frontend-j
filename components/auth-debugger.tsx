// Authentication Debug Component
// Place this in a component and visit it to debug auth issues

'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function AuthDebugger() {
    const [results, setResults] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const runDebugTests = async () => {
        setLoading(true);
        const testResults: any = {};

        // Test 1: Check environment variables
        testResults.envVars = {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            userEmail: process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL,
            userPassword: process.env.NEXT_PUBLIC_SUPABASE_USER_PASSWORD,
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            hasEmail: !!process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL,
            hasPassword: !!process.env.NEXT_PUBLIC_SUPABASE_USER_PASSWORD,
        };

        // Test 2: Create Supabase client
        try {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            testResults.clientCreation = { success: true, error: null };

            // Test 3: Try to sign in
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL!,
                    password: process.env.NEXT_PUBLIC_SUPABASE_USER_PASSWORD!,
                });

                testResults.authentication = {
                    success: !error,
                    error: error?.message || null,
                    hasSession: !!data.session,
                    hasUser: !!data.user,
                    sessionDetails: data.session
                        ? {
                              accessToken:
                                  data.session.access_token?.substring(0, 20) +
                                  '...',
                              refreshToken:
                                  data.session.refresh_token?.substring(0, 20) +
                                  '...',
                              expiresAt: data.session.expires_at,
                              userId: data.user?.id,
                          }
                        : null,
                };
            } catch (authError: any) {
                testResults.authentication = {
                    success: false,
                    error: authError.message,
                    hasSession: false,
                    hasUser: false,
                };
            }
        } catch (clientError: any) {
            testResults.clientCreation = {
                success: false,
                error: clientError.message,
            };
            testResults.authentication = {
                success: false,
                error: 'Could not create client',
            };
        }

        // Test 4: Check if backend is reachable
        try {
            const response = await fetch(
                'http://localhost:3333/api/stocks/test'
            );
            testResults.backendConnection = {
                success: response.ok,
                status: response.status,
                statusText: response.statusText,
            };
        } catch (backendError: any) {
            testResults.backendConnection = {
                success: false,
                error: backendError.message,
            };
        }

        setResults(testResults);
        setLoading(false);
    };

    return (
        <div className="space-y-4 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Authentication Debugger</CardTitle>
                    <CardDescription>
                        Debug authentication issues step by step
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={runDebugTests} disabled={loading}>
                        {loading ? 'Running Tests...' : 'Run Debug Tests'}
                    </Button>

                    {Object.keys(results).length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">
                                Test Results:
                            </h3>
                            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                                {JSON.stringify(results, null, 2)}
                            </pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
