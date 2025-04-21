"use client"

import { useEffect, useState } from "react"
import { Filter, Package, X, Edit, Plus, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type React from 'react';

// Mock inventory data
const inventoryData = [
  {
    id: "INV001",
    name: "Wireless Headphones",
    category: "Electronics",
    supplierName: "TechGear Inc.",
    supplierId: "SUP001",
    cost: 89.99,
    price: 109.99,
    quantity: 24,
    lastUpdated: "2025-04-18 10:15:00",
    status: "In Stock",
  }
];


export function InventoryList() {
  const [inventory, setInventory] = useState<typeof inventoryData>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [editItem, setEditItem] = useState<(typeof inventoryData)[0] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<Omit<(typeof inventoryData)[0], "id" | "lastUpdated" | "status">>({
    name: "",
    category: "",
    supplierName: "",
    supplierId: "",
    cost: 0,
    price: 0,
    quantity: 0,
  })


  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3333/inventory/jira")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data) {
        setInventory(data)
      } else {
        console.error("Received null or undefined data from the API")
      }
    } catch (error) {
      console.error("Failed to fetch inventory data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Simulate API call to fetch inventory data
  useEffect(() => {
    fetchData()
  }, [])

  // Filter inventory based on search term, categories, and status
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category)

    const matchesStatus = selectedStatus === "" || item.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Get unique categories for filter
  const categories = [...new Set(inventory.map((item) => item.category))]


  // Update active filters
  useEffect(() => {
    const filters: string[] = []

    if (searchTerm) {
      filters.push(`Search: ${searchTerm}`)
    }

    selectedCategories.forEach((category) => {
      filters.push(`Category: ${category}`)
    })

    if (selectedStatus) {
      filters.push(`Status: ${selectedStatus}`)
    }

    setActiveFilters(filters)
  }, [searchTerm, selectedCategories, selectedStatus])

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setSelectedStatus("")
  }

  // Remove specific filter
  const removeFilter = (filter: string) => {
    if (filter.startsWith("Search:")) {
      setSearchTerm("")
    } else if (filter.startsWith("Category:")) {
      const category = filter.split(": ")[1]
      setSelectedCategories((prev) => prev.filter((c) => c !== category))
    } else if (filter.startsWith("Status:")) {
      setSelectedStatus("")
    }
  }

  const handleCreateItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Create the new item with today's date
    const createdItem = {
      ...newItem,
    }

    console.log('name ', createdItem.name) 

    // call the API to create the new item
    fetch("http://localhost:3333/inventory/jira/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createdItem),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(() => {
        fetchData() 
        setCreateDialogOpen(false)
        setNewItem({
          name: "",
          category: "",
          price: 0,
          quantity: 0,
          supplierName: "",
          supplierId: "",
          cost: 0,
        })
      })
      .catch((error) => {
        console.error("Failed to create inventory item:", error)
      })
  }

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior.

    if (!editItem) return; // Exit if no item is being edited.

    try {
        // Prepare the payload for the API request.
        const payload = {
            fields: {
                issueId: editItem.id, // Use the item's ID as the issue ID.
                name: editItem.name,
                supplierName: editItem.supplierName,
                supplierId: editItem.supplierId,
                cost: editItem.cost,
                price: editItem.price,
                quantity: editItem.quantity,
                // lastUpdated: new Date().toISOString(), // Use the current timestamp.
                category: editItem.category,
            },
        };

        // Send a PUT request to the backend.
        const response = await fetch("http://localhost:3333/inventory/jira/edit", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to update inventory item: ${response.statusText}`);
        }
        await fetchData(); // Refetch the inventory data after successful update.
        
    } catch (error) {
        console.error("Error updating inventory item:", error);
    } finally {
        setDialogOpen(false); // Close the edit dialog.
        setEditItem(null); // Reset the `editItem` state to null.
    }
};

  const confirmDelete = (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;

    try {
      console.log('itemId: ', itemToDelete);
      const response = await fetch(`http://localhost:3333/inventory/jira/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "issueId": itemToDelete })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedInventory = inventory.filter((item) => item.id !== itemToDelete);
      setInventory(updatedInventory);
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
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
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Inventory</SheetTitle>
                <SheetDescription>Apply filters to narrow down your inventory items</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Categories</h4>
                  <div className="grid gap-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category])
                            } else {
                              setSelectedCategories(selectedCategories.filter((c) => c !== category))
                            }
                          }}
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Status</h4>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
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
        <Button onClick={() => setCreateDialogOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Create
        </Button>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => removeFilter(filter)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7">
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
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Supplier ID</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No inventory items found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.supplierName}</TableCell>
                    <TableCell>{item.supplierId}</TableCell>
                    <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "In Stock"
                            ? "default"
                            : item.status === "Low Stock"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                    <TableCell className="flex space-between content-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditItem(item)
                          setDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit {item.name}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete {item.name}</span>
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
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>Make changes to the inventory item here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                !editItem ||
                !editItem.name ||
                !editItem.category ||
                !editItem.supplierName ||
                !editItem.supplierId ||
                !editItem.cost ||
                !editItem.price 
                // !editItem.quantity
              ) {
                alert("Please fill out all fields before saving.");
                return;
              }
              handleSaveEdit(e);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="item-name"
                  value={editItem?.name || ""}
                  className="col-span-3"
                  onChange={(e) => setEditItem(editItem ? { ...editItem, name: e.target.value } : null)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={editItem?.category || ""}
                  onValueChange={(value) => setEditItem(editItem ? { ...editItem, category: value } : null)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-supplier-name" className="text-right">
                  Supplier
                </Label>
                <Input
                  id="item-supplier-name"
                  value={editItem?.supplierName || ""}
                  className="col-span-3"
                  onChange={(e) => setEditItem(editItem ? { ...editItem, supplierName: e.target.value } : null)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-supplier-id" className="text-right">
                  Supplier ID
                </Label>
                <Input
                  id="item-supplier-id"
                  value={editItem?.supplierId || ""}
                  className="col-span-3"
                  onChange={(e) => setEditItem(editItem ? { ...editItem, supplierId: e.target.value } : null)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-cost" className="text-right">
                  Cost
                </Label>
                <Input
                  id="item-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editItem?.cost || ""}
                  className="col-span-3"
                  onChange={(e) =>
                    setEditItem(editItem ? { ...editItem, cost: Number.parseFloat(e.target.value) } : null)
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="item-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editItem?.price || ""}
                  className="col-span-3"
                  onChange={(e) =>
                    setEditItem(editItem ? { ...editItem, price: Number.parseFloat(e.target.value) } : null)
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="item-quantity"
                  type="number"
                  min="0"
                  value={editItem?.quantity || ""}
                  className="col-span-3"
                  onChange={(e) =>
                    setEditItem(editItem ? { ...editItem, quantity: Number.parseInt(e.target.value) } : null)
                  }
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                variant="destructive"
                onClick={() => editItem && confirmDelete(editItem.id)}
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
            <DialogTitle>Create Inventory Item</DialogTitle>
            <DialogDescription>Add a new inventory item. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Error checking for required fields
              if (
                !newItem.name ||
                !newItem.category ||
                !newItem.supplierName ||
                !newItem.supplierId ||
                !newItem.cost ||
                !newItem.price
              ) {
                alert("Please fill out all required fields before creating the item.");
                return;
              }
              handleCreateItem(e);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-item-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="new-item-name"
                  value={newItem.name}
                  className="col-span-3"
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-item-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-item-supplier-name" className="text-right">
                  Supplier
                </Label>
                <Input
                  id="new-item-supplier-name"
                  value={newItem.supplierName}
                  className="col-span-3"
                  onChange={(e) => setNewItem({ ...newItem, supplierName: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-item-supplier-id" className="text-right">
                  Supplier ID
                </Label>
                <Input
                  id="new-item-supplier-id"
                  value={newItem.supplierId}
                  className="col-span-3"
                  onChange={(e) => setNewItem({ ...newItem, supplierId: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-item-cost" className="text-right">
                  Cost
                </Label>
                <Input
                  id="new-item-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.cost}
                  className="col-span-3"
                  onChange={(e) => setNewItem({ ...newItem, cost: Number.parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-item-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="new-item-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.price}
                  className="col-span-3"
                  onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) })}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-item-quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="new-item-quantity"
                  type="number"
                  min="0"
                  value={newItem.quantity}
                  className="col-span-3"
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) })}
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
          <p>This action is irreversible. Are you sure you want to delete this item?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
