'use client';

import { useEffect, useState } from 'react';
import { Filter, Package, X, Edit, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Stock item interface matching backend API structure
interface StockItem {
    id: string;
    product_name: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    supplier: string;
    branch_id: string;
    created_at: string;
    updated_at: string;
}

// Mock data with backend structure
const mockInventoryData: StockItem[] = [
    {
        id: 'cb87d4b8-9e34-457f-9277-d56ed5985798',
        product_name: 'Laptop Computer',
        product_id: 'LAP001',
        quantity: 25,
        unit_price: 899.99,
        supplier: 'Tech Supplier Inc',
        branch_id: '550e8400-e29b-41d4-a716-446655440001',
        created_at: '2025-05-27T13:39:44.435698+00:00',
        updated_at: '2025-05-27T13:39:44.435698+00:00',
    },
];

export function InventoryList() {
    const [inventory, setInventory] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [editItem, setEditItem] = useState<StockItem | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [newItem, setNewItem] = useState<
        Omit<StockItem, 'id' | 'created_at' | 'updated_at'>
    >({
        product_name: '',
        product_id: '',
        quantity: 0,
        unit_price: 0,
        supplier: '',
        branch_id: '550e8400-e29b-41d4-a716-446655440001', // Default branch
    });

    // Get authentication token
    const getAuthToken = async () => {
        try {
            // Debug environment variables
            console.log('Environment check:', {
                hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                hasEmail: !!process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL,
                hasPassword: !!process.env.NEXT_PUBLIC_SUPABASE_USER_PASSWORD,
                email: process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL,
            });

            // Check if we have required environment variables
            if (
                !process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL ||
                !process.env.NEXT_PUBLIC_SUPABASE_USER_PASSWORD
            ) {
                console.error(
                    'Missing environment variables for authentication'
                );
                throw new Error('Authentication credentials not configured');
            }

            // Sign in with credentials from .env
            const {
                data: { session },
                error,
            } = await supabase.auth.signInWithPassword({
                email: process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL,
                password: process.env.NEXT_PUBLIC_SUPABASE_USER_PASSWORD,
            });

            if (error) {
                console.error('Authentication error:', error);
                console.error('Error details:', {
                    message: error.message,
                    status: error.status,
                    statusCode: error.status,
                });
                throw error;
            }

            if (!session?.access_token) {
                console.error('No access token received from authentication');
                throw new Error('Authentication failed - no access token');
            }

            console.log(
                'Authentication successful, token length:',
                session.access_token.length
            );
            return session.access_token;
        } catch (error) {
            console.error('Failed to get auth token:', error);
            throw error;
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                'http://localhost:3333/api/stocks/test?page=1&limit=50'
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result?.data) {
                setInventory(result.data);
            } else {
                console.error('Received null or undefined data from the API');
                setInventory([]);
            }
        } catch (error) {
            console.error('Failed to fetch inventory data:', error);
            setInventory([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter inventory based on search term and suppliers
    const filteredInventory = inventory.filter((item) => {
        const matchesSearch =
            item.product_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item.product_id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSupplier =
            selectedSuppliers.length === 0 ||
            selectedSuppliers.includes(item.supplier);

        return matchesSearch && matchesSupplier;
    });

    // Get unique suppliers for filter
    const suppliers = [...new Set(inventory.map((item) => item.supplier))];

    // Determine stock status based on quantity
    const getStockStatus = (quantity: number) => {
        if (quantity === 0) return 'Out of Stock';
        if (quantity < 10) return 'Low Stock';
        return 'In Stock';
    };

    // Update active filters
    useEffect(() => {
        const filters: string[] = [];

        if (searchTerm) {
            filters.push(`Search: ${searchTerm}`);
        }

        selectedSuppliers.forEach((supplier) => {
            filters.push(`Supplier: ${supplier}`);
        });

        if (selectedStatus) {
            filters.push(`Status: ${selectedStatus}`);
        }

        setActiveFilters(filters);
    }, [searchTerm, selectedSuppliers, selectedStatus]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedSuppliers([]);
        setSelectedStatus('');
    };

    // Remove specific filter
    const removeFilter = (filter: string) => {
        if (filter.startsWith('Search:')) {
            setSearchTerm('');
        } else if (filter.startsWith('Supplier:')) {
            const supplier = filter.split(': ')[1];
            setSelectedSuppliers((prev) => prev.filter((s) => s !== supplier));
        } else if (filter.startsWith('Status:')) {
            setSelectedStatus('');
        }
    };

    const handleCreateItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const token = await getAuthToken();
            if (!token) {
                throw new Error(
                    'Authentication failed. Please check your credentials.'
                );
            }

            const response = await fetch('http://localhost:3333/api/stocks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${errorText}`
                );
            }

            await fetchData();
            setCreateDialogOpen(false);
            setNewItem({
                product_name: '',
                product_id: '',
                quantity: 0,
                unit_price: 0,
                supplier: '',
                branch_id: '550e8400-e29b-41d4-a716-446655440001',
            });
        } catch (error) {
            console.error('Failed to create inventory item:', error);
            alert(
                `Failed to create inventory item: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    };

    const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editItem) return;

        try {
            const token = await getAuthToken();
            if (!token) {
                alert('Authentication failed. Please check your credentials.');
                return;
            }

            const response = await fetch(
                `http://localhost:3333/api/stocks/${editItem.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        product_name: editItem.product_name,
                        product_id: editItem.product_id,
                        quantity: editItem.quantity,
                        unit_price: editItem.unit_price,
                        supplier: editItem.supplier,
                        branch_id: editItem.branch_id,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to update inventory item: ${response.statusText}`
                );
            }

            await fetchData();
        } catch (error) {
            console.error('Error updating inventory item:', error);
            alert('Failed to update inventory item. Please try again.');
        } finally {
            setDialogOpen(false);
            setEditItem(null);
        }
    };

    const confirmDelete = (itemId: string) => {
        setItemToDelete(itemId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        if (!itemToDelete) return;

        try {
            const token = await getAuthToken();
            if (!token) {
                alert('Authentication failed. Please check your credentials.');
                return;
            }

            const response = await fetch(
                `http://localhost:3333/api/stocks/${itemToDelete}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await fetchData();
        } catch (error) {
            console.error('Failed to delete inventory item:', error);
            alert('Failed to delete inventory item. Please try again.');
        } finally {
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input
                        placeholder="Search inventory..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                        type="search"
                    />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0"
                            >
                                <Filter className="h-4 w-4" />
                                <span className="sr-only">Filter</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filter Inventory</SheetTitle>
                                <SheetDescription>
                                    Apply filters to narrow down your inventory
                                    items
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium">Suppliers</h4>
                                    <div className="grid gap-2">
                                        {suppliers.map((supplier) => (
                                            <div
                                                key={supplier}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`supplier-${supplier}`}
                                                    checked={selectedSuppliers.includes(
                                                        supplier
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked) {
                                                            setSelectedSuppliers(
                                                                [
                                                                    ...selectedSuppliers,
                                                                    supplier,
                                                                ]
                                                            );
                                                        } else {
                                                            setSelectedSuppliers(
                                                                selectedSuppliers.filter(
                                                                    (s) =>
                                                                        s !==
                                                                        supplier
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`supplier-${supplier}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {supplier}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium">Status</h4>
                                    <Select
                                        value={selectedStatus}
                                        onValueChange={setSelectedStatus}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All
                                            </SelectItem>
                                            <SelectItem value="In Stock">
                                                In Stock
                                            </SelectItem>
                                            <SelectItem value="Low Stock">
                                                Low Stock
                                            </SelectItem>
                                            <SelectItem value="Out of Stock">
                                                Out of Stock
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button type="submit">Apply Filters</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
                <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="shrink-0"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                </Button>
            </div>

            {/* Active filters */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-muted-foreground">
                        Active filters:
                    </span>
                    {activeFilters.map((filter) => (
                        <Badge
                            key={filter}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {filter}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0"
                                onClick={() => removeFilter(filter)}
                            >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove filter</span>
                            </Button>
                        </Badge>
                    ))}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-7"
                    >
                        Clear all
                    </Button>
                </div>
            )}

            <Card>
                {loading ? (
                    <div className="p-4 space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Product ID</TableHead>
                                <TableHead>Supplier</TableHead>
                                <TableHead className="text-right">
                                    Unit Price
                                </TableHead>
                                <TableHead className="text-right">
                                    Quantity
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Branch ID</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead className="w-[80px]">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventory.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={10}
                                        className="text-center py-8"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Package className="h-8 w-8 text-muted-foreground" />
                                            <p className="text-muted-foreground">
                                                No inventory items found
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredInventory.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.id.slice(0, 8)}...
                                        </TableCell>
                                        <TableCell>
                                            {item.product_name}
                                        </TableCell>
                                        <TableCell>{item.product_id}</TableCell>
                                        <TableCell>{item.supplier}</TableCell>
                                        <TableCell className="text-right">
                                            ${item.unit_price.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    getStockStatus(
                                                        item.quantity
                                                    ) === 'In Stock'
                                                        ? 'default'
                                                        : getStockStatus(
                                                                item.quantity
                                                            ) === 'Low Stock'
                                                          ? 'secondary'
                                                          : 'destructive'
                                                }
                                            >
                                                {getStockStatus(item.quantity)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {item.branch_id.slice(0, 8)}...
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                item.updated_at
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="flex space-between content-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setEditItem(item);
                                                    setDialogOpen(true);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Edit {item.product_name}
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    confirmDelete(item.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Delete {item.product_name}
                                                </span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Stock Item</DialogTitle>
                        <DialogDescription>
                            Make changes to the stock item here. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (
                                !editItem ||
                                !editItem.product_name ||
                                !editItem.product_id ||
                                !editItem.supplier ||
                                !editItem.unit_price ||
                                editItem.quantity < 0
                            ) {
                                alert(
                                    'Please fill out all fields before saving.'
                                );
                                return;
                            }
                            handleSaveEdit(e);
                        }}
                    >
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="item-name"
                                    className="text-right"
                                >
                                    Product Name
                                </Label>
                                <Input
                                    id="item-name"
                                    value={editItem?.product_name || ''}
                                    className="col-span-3"
                                    onChange={(e) =>
                                        setEditItem(
                                            editItem
                                                ? {
                                                      ...editItem,
                                                      product_name:
                                                          e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="item-product-id"
                                    className="text-right"
                                >
                                    Product ID
                                </Label>
                                <Input
                                    id="item-product-id"
                                    value={editItem?.product_id || ''}
                                    className="col-span-3"
                                    onChange={(e) =>
                                        setEditItem(
                                            editItem
                                                ? {
                                                      ...editItem,
                                                      product_id:
                                                          e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="item-supplier"
                                    className="text-right"
                                >
                                    Supplier
                                </Label>
                                <Input
                                    id="item-supplier"
                                    value={editItem?.supplier || ''}
                                    className="col-span-3"
                                    onChange={(e) =>
                                        setEditItem(
                                            editItem
                                                ? {
                                                      ...editItem,
                                                      supplier: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="item-price"
                                    className="text-right"
                                >
                                    Unit Price
                                </Label>
                                <Input
                                    id="item-price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={editItem?.unit_price || ''}
                                    className="col-span-3"
                                    onChange={(e) =>
                                        setEditItem(
                                            editItem
                                                ? {
                                                      ...editItem,
                                                      unit_price:
                                                          Number.parseFloat(
                                                              e.target.value
                                                          ),
                                                  }
                                                : null
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="item-quantity"
                                    className="text-right"
                                >
                                    Quantity
                                </Label>
                                <Input
                                    id="item-quantity"
                                    type="number"
                                    min="0"
                                    value={editItem?.quantity || ''}
                                    className="col-span-3"
                                    onChange={(e) =>
                                        setEditItem(
                                            editItem
                                                ? {
                                                      ...editItem,
                                                      quantity: Number.parseInt(
                                                          e.target.value
                                                      ),
                                                  }
                                                : null
                                        )
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="item-branch"
                                    className="text-right"
                                >
                                    Branch ID
                                </Label>
                                <Input
                                    id="item-branch"
                                    value={editItem?.branch_id || ''}
                                    className="col-span-3"
                                    onChange={(e) =>
                                        setEditItem(
                                            editItem
                                                ? {
                                                      ...editItem,
                                                      branch_id: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter className="flex justify-between">
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    editItem && confirmDelete(editItem.id)
                                }
                            >
                                Delete
                            </Button>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Stock Item</DialogTitle>
                        <DialogDescription>
                            Add a new stock item. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (
                                !newItem.product_name ||
                                !newItem.product_id ||
                                !newItem.supplier ||
                                !newItem.unit_price ||
                                newItem.quantity < 0
                            ) {
                                alert(
                                    'Please fill out all required fields before creating the item.'
                                );
                                return;
                            }
                            handleCreateItem(e);
                        }}
                    >
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="new-item-name"
                                    className="text-right"
                                >
                                    Product Name
                                </Label>
                                <Input
                                    id="new-item-name"
                                    value={newItem.product_name}
                                    className="col-span-3"
                                    onChange={(e) =>
                                        setNewItem({
                                            ...newItem,
                                            product_name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="new-item-product-id"
                                    className="text-right"
                                >
                                    Product ID
                                </Label>
                                <Input
                                    id="new-item-product-id"
                                    value={newItem.product_id}
                                    className="col-span-3"
                                    onChange={(e) =>
                                        setNewItem({
                                            ...newItem,
                                            product_id: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="new-item-supplier"
                                    className="text-right"
                                >
                                    Supplier
                                </Label>
                                <Input
                                    id="new-item-supplier"
                                    value={newItem.supplier}
                                    className="col-span-3"
                                    onChange={(e) =>
                                        setNewItem({
                                            ...newItem,
                                            supplier: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="new-item-price"
                                    className="text-right"
                                >
                                    Unit Price
                                </Label>
                                <Input
                                    id="new-item-price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={newItem.unit_price}
                                    className="col-span-3"
                                    onChange={(e) =>
                                        setNewItem({
                                            ...newItem,
                                            unit_price: Number.parseFloat(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="new-item-quantity"
                                    className="text-right"
                                >
                                    Quantity
                                </Label>
                                <Input
                                    id="new-item-quantity"
                                    type="number"
                                    min="0"
                                    value={newItem.quantity}
                                    className="col-span-3"
                                    onChange={(e) =>
                                        setNewItem({
                                            ...newItem,
                                            quantity: Number.parseInt(
                                                e.target.value
                                            ),
                                        })
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="new-item-branch"
                                    className="text-right"
                                >
                                    Branch ID
                                </Label>
                                <Input
                                    id="new-item-branch"
                                    value={newItem.branch_id}
                                    className="col-span-3"
                                    onChange={(e) =>
                                        setNewItem({
                                            ...newItem,
                                            branch_id: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Create item</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>
                        This action is irreversible. Are you sure you want to
                        delete this item?
                    </p>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirmed}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
