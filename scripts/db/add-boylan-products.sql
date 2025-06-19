-- Add Boylan Craft Soda Products to the database
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
('Boylan Diet Soda Variety Pack', 'Diet Craft Soda', '12 fl oz (12 Glass Bottles)', 27.99, '/products/boylan-diet_variety-oxiv-boyl-dtvp-w15-u12-main.jpg', 'Assorted pack of diet craft sodas featuring multiple flavors in glass bottles', TRUE, TRUE),
('Boylan Diet Soda Variety Pack', 'Diet Craft Soda', '12 fl oz (24 Glass Bottles)', 52.99, '/products/boylan-diet_variety-oopo-boyl-dtvp-w29-u24-main.jpg', 'Large variety pack of diet craft sodas with multiple flavors in glass bottles', TRUE, TRUE); 