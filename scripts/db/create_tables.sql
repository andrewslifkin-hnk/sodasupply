-- Create stores table (already done, included for reference)
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    size VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    description TEXT,
    returnable BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    store_id INTEGER REFERENCES stores(id),
    store_name VARCHAR(255),
    store_address VARCHAR(255),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    order_date TIMESTAMPTZ DEFAULT NOW(),
    delivery_date TIMESTAMPTZ NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    vat DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'processing',
    payment_method VARCHAR(50) NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    product_name VARCHAR(255),
    product_type VARCHAR(100),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clear existing products to avoid duplicates
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

-- Insert actual products using the real product images in the public/products directory
INSERT INTO products (name, type, size, price, image_url, description, returnable, in_stock)
VALUES
-- Sports Drinks
('Gatorade Thirst Quencher Fruit Punch', 'Sports Drink', '12 fl oz (12 Pack)', 12.99, '/products/Gatorade-Thirst-Quencher-Fruit-Punch-Sports-Drinks-12-fl-oz-12-Count-Bottles_be2b5bf3-06c9-4b53-b2dc-1beab3e8d0e6.080d878747414581e2c57dd14102f909.jpeg', 'Replenish electrolytes with Fruit Punch flavor', TRUE, TRUE),
('Gatorade Thirst Quencher Lemon Lime', 'Sports Drink', '12 fl oz (12 Pack)', 12.99, '/products/Gatorade-Thirst-Quencher-Lemon-Lime-Sports-Drinks-12-fl-oz-12-Count-Bottles_5edbb65e-b3db-4ab6-8699-8aef0399a193.7399a41d2f218dbb404a4a1c34ce27a5.jpeg', 'Replenish electrolytes with Lemon Lime flavor', TRUE, TRUE),
('Gatorade Thirst Quencher Cool Blue', 'Sports Drink', '12 fl oz (12 Pack)', 12.99, '/products/Gatorade-Thirst-Quencher-Cool-Blue-12-pack-12-fl-oz_51574861-17a2-42a0-8948-04211ce574af.4f5486da92e9f5d8a5e00b8cd3e6225b.jpeg', 'Replenish electrolytes with Cool Blue flavor', TRUE, TRUE),
('Gatorade Frost Thirst Quencher Glacier Freeze', 'Sports Drink', '12 fl oz (12 Pack)', 12.99, '/products/Gatorade-Frost-Thirst-Quencher-Glacier-Freeze-Sports-Drinks-12-fl-oz-12-Count-Bottles_a1cc3e1b-d158-4354-a429-7991a1d3aecd.f07dad619a3d54b53ebf007fdc4c0bc0.jpeg', 'Replenish electrolytes with Glacier Freeze flavor', TRUE, TRUE),
('Gatorade Zero Sugar Thirst Quencher Variety Pack', 'Sports Drink', '12 fl oz (18 Pack)', 18.99, '/products/Gatorade-Zero-Sugar-Thirst-Quencher-Variety-Pack-Berry-Glacier-Cherry-Glacier-Freeze-Sports-Drinks-12-fl-oz-18-Count-Bottles_886dd60c-ca21-4d77-8a0a-122bf446189e.c7f2c6acc0e590fb5ec9420b9b9cdb92.jpeg', 'Zero sugar variety pack with Berry, Glacier Cherry, and Glacier Freeze flavors', TRUE, TRUE),
('Gatorade G Zero Thirst Quencher Glacier Freeze', 'Sports Drink', '20 fl oz (8 Pack)', 10.99, '/products/Gatorade-G-Zero-Thirst-Quencher-Glacier-Freeze-20-oz-Bottles-8-Count_ad1260e8-cccb-43ac-9fbe-cbc000d38991.1dcb693e89d824fceee46b10a74ebccc.jpeg', 'Zero sugar electrolyte beverage with Glacier Freeze flavor', TRUE, TRUE),
('Gatorade Thirst Quencher Variety Pack', 'Sports Drink', '20 fl oz (12 Pack)', 15.99, '/products/Gatorade-Thirst-Quencher-Variety-20-fl-oz-12-Count_6b0f2c4b-7ff9-41e4-a35f-4145a249ec3f.8f3489e0c599cdd240b9ecd7eada05ca.jpeg', 'Variety pack with multiple Gatorade flavors', TRUE, TRUE),
('Gatorade Thirst Quencher Sports Drink Cool Blue', 'Sports Drink', '28 fl oz', 2.29, '/products/Gatorade-Thirst-Quencher-Sports-Drink-Cool-Blue-28-fl-oz-Bottle_631b7d6d-5d58-4497-ab55-d67019d77737.c1c6c158cdcbee2d8bd3950b9019b21e.jpeg', 'Large bottle of Cool Blue Gatorade', TRUE, TRUE),

-- POWERADE
('POWERADE Mountain Berry Blast', 'Sports Drink', '12 fl oz (8 Pack)', 9.99, '/products/POWERADE-Mountain-Berry-Blast-Bottled-Electrolyte-Sports-Drink-12-fl-oz-8-Count_9a442df3-ad8c-48a7-95fd-573224987551.8efa6e3a703d0a51609b1f292e63c61c.jpeg', 'POWERADE with Mountain Berry Blast flavor', TRUE, TRUE),
('POWERADE ZERO Berry Blast', 'Sports Drink', '20 fl oz (8 Pack)', 10.99, '/products/POWERADE-ZERO-Berry-Blast-Bottled-Electrolyte-Sports-Drink-20-fl-oz-8-Count_cc0fa22c-e4dc-4026-b25c-3c23856651f7.53051f92a01fc987bb49a1f130d189af.jpeg', 'Zero calorie POWERADE with Berry Blast flavor', TRUE, TRUE),
('POWERADE ZERO Grape', 'Sports Drink', '20 fl oz (8 Pack)', 10.99, '/products/POWERADE-ZERO-Grape-Bottled-Electrolyte-Sports-Drink-20-fl-oz-8-Count_7c1932d2-76c0-4023-b2d9-43bd59a23a39.cbf84459bcfeb784dc2cbcb2ea05133d.jpeg', 'Zero calorie POWERADE with Grape flavor', TRUE, TRUE),
('POWERADE Fruit Punch', 'Sports Drink', '20 fl oz (8 Pack)', 10.99, '/products/POWERADE-Fruit-Punch-Bottled-Electrolyte-Sports-Drink-20-fl-oz-8-Count_8f4a0c0a-a711-4be9-8a37-7874889409dd.ab78b24827aa3e4538a06a7991a63676.jpeg', 'POWERADE with Fruit Punch flavor', TRUE, TRUE),

-- Vitamin Water
('Vitamin Water XXX (Acai-Blueberry-Pomegranate)', 'Enhanced Water', '16.9 fl oz (6 Pack)', 7.99, '/products/vitaminwater-XXX-Acai-Blueberry-Pomegranate-Flavored-Water-Beverage-16-9-fl-oz-6-Pack-Bottles_d3547c1c-cab7-43af-815e-8706bf1b5815.4204caa03a7f7f3d3f2237b6283d04a3.jpeg', 'Vitamin enriched water with Acai-Blueberry-Pomegranate flavor', FALSE, TRUE),
('Vitamin Water Power-C (Dragonfruit)', 'Enhanced Water', '16.9 fl oz (6 Pack)', 7.99, '/products/vitaminwater-Power-C-Dragonfruit-Flavored-Water-Beverage-16-9-fl-oz-6-Pack-Bottles_cb99d096-946d-46e8-b4a9-d0f8007551d9.b3ad6549c0e0ae76eaafc5b662beeb02.jpeg', 'Vitamin enriched water with Dragonfruit flavor and vitamin C', FALSE, TRUE),
('Vitamin Water Focus (Kiwi-Strawberry)', 'Enhanced Water', '16.9 fl oz (6 Pack)', 7.99, '/products/vitaminwater-Focus-Kiwi-Strawberry-Flavored-Water-Beverage-16-9-fl-oz-6-Pack-Bottles_bc97a902-35cc-4896-932a-cfcf7421d580.e61cb79aa2d4d4ed391e9d873b664600.jpeg', 'Vitamin enriched water with Kiwi-Strawberry flavor for focus', FALSE, TRUE),

-- Propel Water
('Propel Workout Water Variety Pack', 'Enhanced Water', '16.9 fl oz (18 Pack)', 19.99, '/products/Propel-Workout-Water-Variety-Pack-16-9-fl-oz-18-Count-Bottles_6bc1584b-68a8-4ee1-9bd5-6fed985cae5c.77dd01dc71484f81ddb4cd6d8b371c31.jpeg', 'Electrolyte water designed for workouts, variety pack', FALSE, TRUE),
('Propel Flavored Water with Electrolytes (Kiwi Strawberry)', 'Enhanced Water', '16.9 fl oz (12 Pack)', 14.99, '/products/Propel-Flavored-Water-with-Electrolytes-Kiwi-Strawberry-16-9-fl-oz-12-Pack_f6fa331e-9a41-431d-8a5e-69488d5c5c03.d646c6c15de8f8ba385f528ad99fde96.jpeg', 'Flavored water with electrolytes, Kiwi Strawberry flavor', FALSE, TRUE),

-- OLIPOP Prebiotic Sodas
('OLIPOP Prebiotic Soda Vintage Cola', 'Prebiotic Soda', '12 fl oz (4 Pack)', 11.99, '/products/OLIPOP-Prebiotic-Soda-Vintage-Cola-12-fl-oz-4-Pack-Pantry-Packs_a411ca43-2ff8-4297-bfd8-636c98da5bf6.b571756ee739db94ffcbc24556a21106.jpeg', 'Prebiotic soda with Vintage Cola flavor, low sugar', FALSE, TRUE),
('OLIPOP Prebiotic Soda Classic Root Beer', 'Prebiotic Soda', '12 fl oz (4 Pack)', 11.99, '/products/OLIPOP-Prebiotic-Soda-Classic-Root-Beer-12-fl-oz-4-Pack-Pantry-Packs_1c4479aa-dcf4-4cff-81b6-d1797c9abb96.3f83822f383379fd4bf080076e004a20.jpeg', 'Prebiotic soda with Classic Root Beer flavor, low sugar', FALSE, TRUE),
('OLIPOP Prebiotic Soda Strawberry Vanilla', 'Prebiotic Soda', '12 fl oz (4 Pack)', 11.99, '/products/OLIPOP-Prebiotic-Soda-Strawberry-Vanilla-12-fl-oz-4-Pack-Pantry-Packs_4abd8a0c-7f42-48c7-8e63-4a2fdcc031fd.ddb345958fd69b8a7ff780d2dc1c4982.jpeg', 'Prebiotic soda with Strawberry Vanilla flavor, low sugar', FALSE, TRUE),
('OLIPOP Prebiotic Soda Cream Soda', 'Prebiotic Soda', '12 fl oz (4 Pack)', 11.99, '/products/OLIPOP-Prebiotic-Soda-Cream-Soda-12-fl-oz-4-Pack-Pantry-Packs_522a6251-8f10-4fa5-9753-ef1e4c0b700d.ef6cbd1cbbd0a4e019695cab9402a461.jpeg', 'Prebiotic soda with Cream Soda flavor, low sugar', FALSE, TRUE),
('OLIPOP Prebiotic Soda Classic Grape', 'Prebiotic Soda', '12 fl oz', 2.99, '/products/OLIPOP-Prebiotic-Soda-Classic-Grape-12-fl-oz-Pantry-Packs_5bac9c51-ac9e-4d23-bf61-d5a41f30fabd.339e98f4cc13073004324e89382aab2d.jpeg', 'Prebiotic soda with Classic Grape flavor, low sugar', FALSE, TRUE),
('OLIPOP Prebiotic Soda Ginger Ale', 'Prebiotic Soda', '12 fl oz', 2.99, '/products/OLIPOP-Prebiotic-Soda-Ginger-Ale-12-fl-oz-Refrigerated_4be9f922-3024-4310-a97a-49cfccae7fc9.6df5e47b19350ef52f3b2d3351d5e1e0.jpeg', 'Prebiotic soda with Ginger Ale flavor, low sugar', FALSE, TRUE),

-- Poppi Prebiotic Sodas
('Poppi Prebiotic Soda Orange Cream', 'Prebiotic Soda', '12 fl oz', 2.69, '/products/Poppi-Orange-Cream-Prebiotic-Soda-12-oz-1-Pack-Can_3a2e9a55-2228-4cba-8ed2-82c0ce2e45e0.5f50c08f000959eaf0508dd50235d5f1.jpeg', 'Prebiotic soda with Orange Cream flavor', FALSE, TRUE),
('Poppi Prebiotic Soda Raspberry Rose', 'Prebiotic Soda', '12 fl oz', 2.69, '/products/Poppi-Raspberry-Rose-Prebiotic-Soda-12-oz-1-Pack-Can_c2397ac2-56ff-4851-bbab-31cd30257e74.78ea0d9d55bd181cba0b99199cf44f55.jpeg', 'Prebiotic soda with Raspberry Rose flavor', FALSE, TRUE),
('Poppi Prebiotic Soda Strawberry Lemon', 'Prebiotic Soda', '12 fl oz', 2.69, '/products/Poppi-Strawberry-Lemon-Prebiotic-Soda-12-oz-1-Pack-Can_6a9872ba-12fa-48a0-b8bb-ee9ba6750116.fba277c271a60a424d538bfa71d63e04.jpeg', 'Prebiotic soda with Strawberry Lemon flavor', FALSE, TRUE),
('Poppi Prebiotic Soda Cherry Limeade', 'Prebiotic Soda', '12 fl oz', 2.69, '/products/Poppi-Cherry-Limeade-Prebiotic-Soda-12-oz-1-Pack-Can_f781f445-b7a9-4471-9b8f-07f89bc06612.43dc1c7f8b6ca56127cce6c4f7e4f5a4.jpeg', 'Prebiotic soda with Cherry Limeade flavor', FALSE, TRUE),
('Poppi Cherry Limeade (4 Pack)', 'Prebiotic Soda', '12 fl oz (4 Pack)', 10.49, '/products/Poppi-Cherry-Limeade-Prebiotic-Soda-12-oz-4-Pack-Cans_1c1bab54-43ff-4493-a1ab-ce692fa9fa52.e873a04df12356897bfe4fdc8cb98973.jpeg', 'Prebiotic soda with Cherry Limeade flavor, 4 pack', FALSE, TRUE),
('Poppi Prebiotic Soda Classic Cola', 'Prebiotic Soda', '12 fl oz', 2.69, '/products/Poppi-Classic-Cola-Prebiotic-Soda-12-oz-1-Pack-Can_5978c167-1271-43b0-b13d-6bc63266b60f.d92522c6001a7414affc985e7d9d0da6.jpeg', 'Prebiotic soda with Classic Cola flavor', FALSE, TRUE),
('Poppi Prebiotic Soda Doc Pop', 'Prebiotic Soda', '12 fl oz (4 Pack)', 10.49, '/products/Poppi-Doc-Pop-Prebiotic-Soda-12-oz-4-Pack-Cans_4a67166f-efff-4668-9520-902e16db8245.626234501e4f3b68285a5e3add1aba28.jpeg', 'Prebiotic soda with Dr Pepper style flavor, 4 pack', FALSE, TRUE),
('Poppi Prebiotic Soda Grape', 'Prebiotic Soda', '12 fl oz', 2.69, '/products/Poppi-Grape-Prebiotic-Soda-12-oz-1-Pack-Can_eb4d6323-6e85-4913-8b66-d79267622e5d.3ce39aedbf637694b385bf83101485da.jpeg', 'Prebiotic soda with Grape flavor', FALSE, TRUE);

-- Create indexes
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_order_items_order ON order_items(order_id); 