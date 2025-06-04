# Backend API Examples for Sales Data

## Express Backend Endpoint Examples

Based on your sales data structure, here are the recommended backend endpoints:

### 1. Total Sales Endpoint: `/api/sales/total`

```javascript
// GET /api/sales/total?period=month
app.get('/api/sales/total', async (req, res) => {
  try {
    const { period } = req.query; // 'week', 'month', 'year', or empty for all-time
    
    let whereClause = '';
    if (period === 'week') {
      whereClause = "WHERE created_at >= NOW() - INTERVAL '7 days'";
    } else if (period === 'month') {
      whereClause = "WHERE created_at >= NOW() - INTERVAL '30 days'";
    } else if (period === 'year') {
      whereClause = "WHERE created_at >= NOW() - INTERVAL '365 days'";
    }

    const result = await db.query(`
      SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(total_sales), 0) as total_revenue,
        COALESCE(SUM(total_items_sold), 0) as total_items_sold
      FROM sales_data 
      ${whereClause}
    `);

    res.json({
      totalSales: parseInt(result.rows[0].total_sales),
      totalRevenue: parseFloat(result.rows[0].total_revenue),
      totalItemsSold: parseInt(result.rows[0].total_items_sold),
      period: period || 'all-time'
    });
  } catch (error) {
    console.error('Error fetching sales total:', error);
    res.status(500).json({ error: 'Failed to fetch sales total' });
  }
});
```

### 2. Sales by Branch Endpoint: `/api/sales/by-branch`

```javascript
// GET /api/sales/by-branch
app.get('/api/sales/by-branch', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        branch_id,
        branch_name,
        COUNT(*) as total_sales,
        COALESCE(SUM(total_sales), 0) as total_revenue,
        COALESCE(SUM(total_items_sold), 0) as items_sold
      FROM sales_data 
      GROUP BY branch_id, branch_name
      ORDER BY total_revenue DESC
    `);

    res.json(result.rows.map(row => ({
      branchId: row.branch_id,
      branchName: row.branch_name,
      totalSales: parseInt(row.total_sales),
      totalRevenue: parseFloat(row.total_revenue),
      itemsSold: parseInt(row.items_sold)
    })));
  } catch (error) {
    console.error('Error fetching sales by branch:', error);
    res.status(500).json({ error: 'Failed to fetch sales by branch' });
  }
});
```

### 3. Dashboard Stats Endpoint: `/api/dashboard/stats`

```javascript
// GET /api/dashboard/stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    // Current month stats
    const currentMonth = await db.query(`
      SELECT 
        COUNT(*) as sales_count,
        COALESCE(SUM(total_sales), 0) as revenue,
        COALESCE(SUM(total_items_sold), 0) as items_sold
      FROM sales_data 
      WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    `);

    // Previous month stats for comparison
    const previousMonth = await db.query(`
      SELECT 
        COUNT(*) as sales_count,
        COALESCE(SUM(total_sales), 0) as revenue,
        COALESCE(SUM(total_items_sold), 0) as items_sold
      FROM sales_data 
      WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    `);

    const current = currentMonth.rows[0];
    const previous = previousMonth.rows[0];

    // Calculate percentage changes
    const revenueChange = previous.revenue > 0 
      ? ((current.revenue - previous.revenue) / previous.revenue * 100) 
      : 0;
    
    const salesChange = previous.sales_count > 0 
      ? ((current.sales_count - previous.sales_count) / previous.sales_count * 100) 
      : 0;

    res.json({
      totalRevenue: {
        value: `$${parseFloat(current.revenue).toLocaleString()}`,
        change: Math.round(revenueChange * 10) / 10,
        trend: revenueChange >= 0 ? 'up' : 'down'
      },
      totalSales: {
        value: current.sales_count.toString(),
        change: Math.round(salesChange * 10) / 10,
        trend: salesChange >= 0 ? 'up' : 'down'
      },
      // Add inventory and customer stats as needed
      activeInventory: {
        value: "573", // From inventory table
        change: -4.5,
        trend: 'down'
      },
      activeCustomers: {
        value: "1,429", // From customer activity
        change: 10.1,
        trend: 'up'
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});
```

## Key Benefits of This Approach:

1. **Database Optimization**: SQL aggregation functions (SUM, COUNT, GROUP BY) are highly optimized
2. **Network Efficiency**: Only calculated results are transmitted, not raw data
3. **Frontend Performance**: No heavy calculations on the client side
4. **Scalability**: Works efficiently even with millions of sales records
5. **Flexibility**: Easy to add filters, date ranges, and new calculations

## Security Considerations:

```javascript
// Add authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Use on all sales endpoints
app.get('/api/sales/total', authenticateToken, async (req, res) => {
  // ... endpoint logic
});
```

## Caching for Performance:

```javascript
const redis = require('redis');
const client = redis.createClient();

app.get('/api/sales/total', async (req, res) => {
  const cacheKey = `sales:total:${req.query.period || 'all'}`;
  
  // Try to get from cache first
  try {
    const cached = await client.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
  } catch (error) {
    console.log('Cache miss or error:', error);
  }

  // If not in cache, fetch from database
  const result = await fetchSalesTotal(req.query.period);
  
  // Cache for 5 minutes
  try {
    await client.setex(cacheKey, 300, JSON.stringify(result));
  } catch (error) {
    console.log('Cache set error:', error);
  }

  res.json(result);
});
```

This approach ensures your application remains performant and scalable as your data grows!
