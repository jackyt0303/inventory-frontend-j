import { NextResponse } from "next/server"

// Mock inventory data
const inventoryData = [
  {
    id: "INV001",
    name: "Laptop",
    category: "Electronics",
    price: 999.99,
    quantity: 15,
    status: "In Stock",
    lastUpdated: "2023-04-15",
  },
  {
    id: "INV002",
    name: "Smartphone",
    category: "Electronics",
    price: 699.99,
    quantity: 25,
    status: "In Stock",
    lastUpdated: "2023-04-14",
  },
  {
    id: "INV003",
    name: "Headphones",
    category: "Electronics",
    price: 149.99,
    quantity: 30,
    status: "In Stock",
    lastUpdated: "2023-04-13",
  },
  {
    id: "INV004",
    name: "T-Shirt",
    category: "Clothing",
    price: 19.99,
    quantity: 100,
    status: "In Stock",
    lastUpdated: "2023-04-12",
  },
  {
    id: "INV005",
    name: "Jeans",
    category: "Clothing",
    price: 49.99,
    quantity: 75,
    status: "In Stock",
    lastUpdated: "2023-04-11",
  },
  {
    id: "INV006",
    name: "Sneakers",
    category: "Footwear",
    price: 89.99,
    quantity: 50,
    status: "In Stock",
    lastUpdated: "2023-04-10",
  },
  {
    id: "INV007",
    name: "Backpack",
    category: "Accessories",
    price: 39.99,
    quantity: 20,
    status: "Low Stock",
    lastUpdated: "2023-04-09",
  },
  {
    id: "INV008",
    name: "Watch",
    category: "Accessories",
    price: 199.99,
    quantity: 5,
    status: "Low Stock",
    lastUpdated: "2023-04-08",
  },
  {
    id: "INV009",
    name: "Tablet",
    category: "Electronics",
    price: 349.99,
    quantity: 0,
    status: "Out of Stock",
    lastUpdated: "2023-04-07",
  },
  {
    id: "INV010",
    name: "Desk Chair",
    category: "Furniture",
    price: 149.99,
    quantity: 0,
    status: "Out of Stock",
    lastUpdated: "2023-04-06",
  },
]

export async function GET(request: Request) {
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Get URL parameters
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""
  const status = searchParams.get("status") || ""

  // Filter inventory based on search parameters
  let filteredInventory = [...inventoryData]

  if (search) {
    filteredInventory = filteredInventory.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase()),
    )
  }

  if (category) {
    filteredInventory = filteredInventory.filter((item) => item.category === category)
  }

  if (status) {
    filteredInventory = filteredInventory.filter((item) => item.status === status)
  }

  return NextResponse.json(filteredInventory)
}

export async function POST(request: Request) {
  const data = await request.json()

  // In a real application, you would validate the data and save it to a database
  // For this MVP, we'll just return the data with a new ID
  const newItem = {
    id: `INV${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`,
    ...data,
    lastUpdated: new Date().toISOString().split("T")[0],
  }

  return NextResponse.json(newItem, { status: 201 })
}
