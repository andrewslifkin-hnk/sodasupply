-- Complete setup for Boylan Craft Soda Products
-- This script adds the products and their Portuguese translations

-- First, add the new product types if the columns don't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_pt TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_pt TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS type_pt TEXT;

-- Insert Boylan Craft Soda Products
INSERT INTO products (name, type, size, price, image_url, description, returnable, in_stock) VALUES
-- Individual Boylan Craft Sodas (12 fl oz Glass Bottles)
('Boylan Black Cherry', 'Craft Soda', '12 fl oz Glass Bottle', 2.49, '/products/boylan-bottling-co-boyl-bbc-main.jpg', 'Premium craft soda with real black cherry flavor in traditional glass bottles', TRUE, TRUE),
('Boylan Cherry Cola', 'Craft Soda', '12 fl oz Glass Bottle', 2.49, '/products/boylan-bottling-co-boyl-bcc-main.jpg', 'Classic cherry cola with natural flavors and pure cane sugar in glass bottles', TRUE, TRUE),
('Boylan Cane Cola', 'Craft Soda', '12 fl oz Glass Bottle', 2.49, '/products/boylan-bottling-co-boyl-bcr-main.jpg', 'Original cola made with pure cane sugar and natural kola nut extract', TRUE, TRUE),

-- Boylan Diet Craft Sodas (12 fl oz Glass Bottles)
('Boylan Diet Black Cherry', 'Diet Craft Soda', '12 fl oz Glass Bottle', 2.49, '/products/boylan-bottling-co-boyl-bdbc-main.jpg', 'Sugar-free black cherry soda with the same great taste in glass bottles', TRUE, TRUE),
('Boylan Diet Cherry Cola', 'Diet Craft Soda', '12 fl oz Glass Bottle', 2.49, '/products/boylan-bottling-co-boyl-bdcc-main.jpg', 'Diet cherry cola with natural flavors and zero sugar', TRUE, TRUE),
('Boylan Diet Cane Cola', 'Diet Craft Soda', '12 fl oz Glass Bottle', 2.49, '/products/boylan-bottling-co-boyl-bdcr-main.jpg', 'Sugar-free version of the classic cane cola with authentic taste', TRUE, TRUE),
('Boylan Diet Root Beer', 'Diet Craft Soda', '12 fl oz Glass Bottle', 2.49, '/products/boylan-bottling-co-boyl-bdrb-main.jpg', 'Classic diet root beer with smooth vanilla notes and zero sugar', TRUE, TRUE),

-- Boylan Variety Packs
('Boylan Diet Soda Variety Pack (12 Count)', 'Diet Craft Soda', '12 fl oz (12 Glass Bottles)', 27.99, '/products/boylan-diet_variety-oxiv-boyl-dtvp-w15-u12-main.jpg', 'Assorted pack of diet craft sodas featuring multiple flavors in glass bottles', TRUE, TRUE),
('Boylan Diet Soda Variety Pack (24 Count)', 'Diet Craft Soda', '12 fl oz (24 Glass Bottles)', 52.99, '/products/boylan-diet_variety-oopo-boyl-dtvp-w29-u24-main.jpg', 'Large variety pack of diet craft sodas with multiple flavors in glass bottles', TRUE, TRUE);

-- Add Portuguese translations for all new Boylan products
UPDATE products SET 
  name_pt = 'Boylan Cereja Preta',
  description_pt = 'Refrigerante artesanal premium com sabor real de cereja preta em garrafas de vidro tradicionais',
  type_pt = 'Refrigerante Artesanal'
WHERE name = 'Boylan Black Cherry';

UPDATE products SET 
  name_pt = 'Boylan Cola de Cereja',
  description_pt = 'Cola de cereja clássica com sabores naturais e açúcar de cana puro em garrafas de vidro',
  type_pt = 'Refrigerante Artesanal'
WHERE name = 'Boylan Cherry Cola';

UPDATE products SET 
  name_pt = 'Boylan Cola de Cana',
  description_pt = 'Cola original feita com açúcar de cana puro e extrato natural de noz de cola',
  type_pt = 'Refrigerante Artesanal'
WHERE name = 'Boylan Cane Cola';

UPDATE products SET 
  name_pt = 'Boylan Diet Cereja Preta',
  description_pt = 'Refrigerante de cereja preta sem açúcar com o mesmo ótimo sabor em garrafas de vidro',
  type_pt = 'Refrigerante Diet Artesanal'
WHERE name = 'Boylan Diet Black Cherry';

UPDATE products SET 
  name_pt = 'Boylan Diet Cola de Cereja',
  description_pt = 'Cola de cereja diet com sabores naturais e zero açúcar',
  type_pt = 'Refrigerante Diet Artesanal'
WHERE name = 'Boylan Diet Cherry Cola';

UPDATE products SET 
  name_pt = 'Boylan Diet Cola de Cana',
  description_pt = 'Versão sem açúcar da cola de cana clássica com sabor autêntico',
  type_pt = 'Refrigerante Diet Artesanal'
WHERE name = 'Boylan Diet Cane Cola';

UPDATE products SET 
  name_pt = 'Boylan Diet Root Beer',
  description_pt = 'Root beer diet clássico com notas suaves de baunilha e zero açúcar',
  type_pt = 'Refrigerante Diet Artesanal'
WHERE name = 'Boylan Diet Root Beer';

UPDATE products SET 
  name_pt = 'Boylan Pacote Variedades Diet (12 Unidades)',
  description_pt = 'Pacote sortido de refrigerantes diet artesanais com múltiplos sabores em garrafas de vidro',
  type_pt = 'Refrigerante Diet Artesanal'
WHERE name = 'Boylan Diet Soda Variety Pack (12 Count)';

UPDATE products SET 
  name_pt = 'Boylan Pacote Variedades Diet (24 Unidades)',
  description_pt = 'Pacote grande de refrigerantes diet artesanais com múltiplos sabores em garrafas de vidro',
  type_pt = 'Refrigerante Diet Artesanal'
WHERE name = 'Boylan Diet Soda Variety Pack (24 Count)';

-- Add indexes to optimize queries
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price); 