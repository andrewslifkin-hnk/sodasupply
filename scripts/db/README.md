# Database Setup for Order Management

This directory contains scripts for setting up the Supabase database for the SodaSupply application's order management system.

## Tables

The database includes the following tables:

1. `orders` - Stores main order information
2. `order_items` - Stores items within each order

## Setup Instructions

### Using Supabase SQL Editor

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `init.sql` into a new query
4. Run the query to create the necessary tables and functions

### Using Migration Scripts (Alternative)

If you're using migration scripts with Supabase CLI:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project (replace with your project reference)
supabase link --project-ref YOUR_PROJECT_REF

# Run the migration from this directory
supabase db push
```

## Schema Information

### Orders Table

- `id`: Primary key
- `order_number`: Unique identifier (CO2024-XXXXX format)
- `order_date`: When the order was placed
- `delivery_date`: When the order will be delivered
- `total`: Total order amount
- `status`: Order status (processing, delivered, cancelled)
- `store_id`: Store ID where order is delivered
- `store_name`: Store name
- `store_address`: Delivery address
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

### Order Items Table

- `id`: Primary key
- `order_id`: Reference to parent order
- `product_id`: Product ID
- `product_name`: Product name
- `product_type`: Product type
- `quantity`: Quantity ordered
- `price`: Unit price
- `total`: Total for this line item
- `image`: Product image URL
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

## Indexing

The script creates the following indexes for better performance:

- `idx_order_items_order_id`: For faster lookup of items within an order
- `idx_orders_order_number`: For faster lookup by order number
- `idx_orders_order_date`: For date-based filtering
- `idx_orders_store_id`: For store-based filtering 