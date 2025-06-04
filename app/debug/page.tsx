import { AuthDebugger } from '@/components/auth-debugger';

export default function DebugPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">
                Authentication Debug Page
            </h1>
            <AuthDebugger />
        </div>
    );
}
