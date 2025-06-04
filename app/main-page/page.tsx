import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function MainPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Inventory Management System
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    A simple solution to manage your inventory
                                    and track sales
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Button asChild>
                                    <Link href="/dashboard">
                                        Dashboard{' '}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/inventory">
                                        Inventory{' '}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dashboard</CardTitle>
                                    <CardDescription>
                                        View sales and inventory analytics
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Get a quick overview of your business
                                        performance with interactive charts and
                                        metrics.
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild variant="ghost">
                                        <Link href="/dashboard">
                                            View Dashboard{' '}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Inventory Management</CardTitle>
                                    <CardDescription>
                                        Manage your stock efficiently
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Keep track of your inventory with
                                        powerful filtering and sorting
                                        capabilities.
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild variant="ghost">
                                        <Link href="/inventory">
                                            View Inventory{' '}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Real-time Updates</CardTitle>
                                    <CardDescription>
                                        Stay informed with the latest data
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Get real-time updates on your inventory
                                        and sales data to make informed
                                        decisions.
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild variant="ghost">
                                        <Link href="/dashboard">
                                            Learn More{' '}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
