-- Add translation columns to products table for Portuguese
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_pt TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_pt TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS type_pt TEXT;

-- Update existing products with Portuguese translations
-- Sports Drinks
UPDATE products SET 
  name_pt = 'Gatorade Thirst Quencher Ponche de Frutas',
  description_pt = 'Reponha eletrólitos com sabor Ponche de Frutas',
  type_pt = 'Bebida Esportiva'
WHERE name = 'Gatorade Thirst Quencher Fruit Punch';

UPDATE products SET 
  name_pt = 'Gatorade Thirst Quencher Limão Lima',
  description_pt = 'Reponha eletrólitos com sabor Limão Lima',
  type_pt = 'Bebida Esportiva'
WHERE name = 'Gatorade Thirst Quencher Lemon Lime';

UPDATE products SET 
  name_pt = 'Gatorade Thirst Quencher Azul Gelado',
  description_pt = 'Reponha eletrólitos com sabor Azul Gelado',
  type_pt = 'Bebida Esportiva'
WHERE name = 'Gatorade Thirst Quencher Cool Blue';

UPDATE products SET 
  name_pt = 'Gatorade Frost Thirst Quencher Glacier Freeze',
  description_pt = 'Reponha eletrólitos com sabor Glacier Freeze',
  type_pt = 'Bebida Esportiva'
WHERE name = 'Gatorade Frost Thirst Quencher Glacier Freeze';

UPDATE products SET 
  name_pt = 'Gatorade Zero Açúcar Variedades',
  description_pt = 'Variedades sem açúcar com sabores Berry, Glacier Cherry e Glacier Freeze',
  type_pt = 'Bebida Esportiva'
WHERE name = 'Gatorade Zero Sugar Thirst Quencher Variety Pack';

-- POWERADE
UPDATE products SET 
  name_pt = 'POWERADE Mountain Berry Blast',
  description_pt = 'POWERADE com sabor Mountain Berry Blast',
  type_pt = 'Bebida Esportiva'
WHERE name = 'POWERADE Mountain Berry Blast';

UPDATE products SET 
  name_pt = 'POWERADE ZERO Berry Blast',
  description_pt = 'POWERADE zero calorias com sabor Berry Blast',
  type_pt = 'Bebida Esportiva'
WHERE name = 'POWERADE ZERO Berry Blast';

UPDATE products SET 
  name_pt = 'POWERADE ZERO Uva',
  description_pt = 'POWERADE zero calorias com sabor Uva',
  type_pt = 'Bebida Esportiva'
WHERE name = 'POWERADE ZERO Grape';

UPDATE products SET 
  name_pt = 'POWERADE Ponche de Frutas',
  description_pt = 'POWERADE com sabor Ponche de Frutas',
  type_pt = 'Bebida Esportiva'
WHERE name = 'POWERADE Fruit Punch';

-- Vitamin Water
UPDATE products SET 
  name_pt = 'Vitamin Water XXX (Açaí-Mirtilo-Romã)',
  description_pt = 'Água enriquecida com vitaminas sabor Açaí-Mirtilo-Romã',
  type_pt = 'Água Enriquecida'
WHERE name = 'Vitamin Water XXX (Acai-Blueberry-Pomegranate)';

UPDATE products SET 
  name_pt = 'Vitamin Water Power-C (Pitaya)',
  description_pt = 'Água enriquecida com vitaminas sabor Pitaya e vitamina C',
  type_pt = 'Água Enriquecida'
WHERE name = 'Vitamin Water Power-C (Dragonfruit)';

UPDATE products SET 
  name_pt = 'Vitamin Water Focus (Kiwi-Morango)',
  description_pt = 'Água enriquecida com vitaminas sabor Kiwi-Morango para foco',
  type_pt = 'Água Enriquecida'
WHERE name = 'Vitamin Water Focus (Kiwi-Strawberry)';

-- Propel Water
UPDATE products SET 
  name_pt = 'Propel Água para Treino Variedades',
  description_pt = 'Água com eletrólitos projetada para treinos, variedades',
  type_pt = 'Água Enriquecida'
WHERE name = 'Propel Workout Water Variety Pack';

UPDATE products SET 
  name_pt = 'Propel Água Saborizada com Eletrólitos (Kiwi Morango)',
  description_pt = 'Água saborizada com eletrólitos, sabor Kiwi Morango',
  type_pt = 'Água Enriquecida'
WHERE name = 'Propel Flavored Water with Electrolytes (Kiwi Strawberry)';

-- OLIPOP Prebiotic Sodas
UPDATE products SET 
  name_pt = 'OLIPOP Refrigerante Prebiótico Cola Vintage',
  description_pt = 'Refrigerante prebiótico com sabor Cola Vintage, baixo açúcar',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'OLIPOP Prebiotic Soda Vintage Cola';

UPDATE products SET 
  name_pt = 'OLIPOP Refrigerante Prebiótico Root Beer Clássico',
  description_pt = 'Refrigerante prebiótico com sabor Root Beer Clássico, baixo açúcar',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'OLIPOP Prebiotic Soda Classic Root Beer';

UPDATE products SET 
  name_pt = 'OLIPOP Refrigerante Prebiótico Morango Baunilha',
  description_pt = 'Refrigerante prebiótico com sabor Morango Baunilha, baixo açúcar',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'OLIPOP Prebiotic Soda Strawberry Vanilla';

UPDATE products SET 
  name_pt = 'OLIPOP Refrigerante Prebiótico Cream Soda',
  description_pt = 'Refrigerante prebiótico com sabor Cream Soda, baixo açúcar',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'OLIPOP Prebiotic Soda Cream Soda';

UPDATE products SET 
  name_pt = 'OLIPOP Refrigerante Prebiótico Uva Clássica',
  description_pt = 'Refrigerante prebiótico com sabor Uva Clássica, baixo açúcar',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'OLIPOP Prebiotic Soda Classic Grape';

UPDATE products SET 
  name_pt = 'OLIPOP Refrigerante Prebiótico Ginger Ale',
  description_pt = 'Refrigerante prebiótico com sabor Ginger Ale, baixo açúcar',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'OLIPOP Prebiotic Soda Ginger Ale';

-- Poppi Prebiotic Sodas
UPDATE products SET 
  name_pt = 'Poppi Refrigerante Prebiótico Creme de Laranja',
  description_pt = 'Refrigerante prebiótico com sabor Creme de Laranja',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'Poppi Prebiotic Soda Orange Cream';

UPDATE products SET 
  name_pt = 'Poppi Refrigerante Prebiótico Framboesa Rosa',
  description_pt = 'Refrigerante prebiótico com sabor Framboesa Rosa',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'Poppi Prebiotic Soda Raspberry Rose';

UPDATE products SET 
  name_pt = 'Poppi Refrigerante Prebiótico Morango Limão',
  description_pt = 'Refrigerante prebiótico com sabor Morango Limão',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'Poppi Prebiotic Soda Strawberry Lemon';

UPDATE products SET 
  name_pt = 'Poppi Refrigerante Prebiótico Cherry Limeade',
  description_pt = 'Refrigerante prebiótico com sabor Cherry Limeade',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'Poppi Prebiotic Soda Cherry Limeade';

UPDATE products SET 
  name_pt = 'Poppi Cherry Limeade (4 Unidades)',
  description_pt = 'Refrigerante prebiótico com sabor Cherry Limeade, 4 unidades',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'Poppi Cherry Limeade (4 Pack)';

UPDATE products SET 
  name_pt = 'Poppi Refrigerante Prebiótico Cola Clássica',
  description_pt = 'Refrigerante prebiótico com sabor Cola Clássica',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'Poppi Prebiotic Soda Classic Cola';

UPDATE products SET 
  name_pt = 'Poppi Refrigerante Prebiótico Doc Pop',
  description_pt = 'Refrigerante prebiótico estilo Dr Pepper, 4 unidades',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'Poppi Prebiotic Soda Doc Pop';

UPDATE products SET 
  name_pt = 'Poppi Refrigerante Prebiótico Uva',
  description_pt = 'Refrigerante prebiótico com sabor Uva',
  type_pt = 'Refrigerante Prebiótico'
WHERE name = 'Poppi Prebiotic Soda Grape';

-- Generic type translations for any remaining products
UPDATE products SET type_pt = 'Bebida Esportiva' WHERE type = 'Sports Drink' AND type_pt IS NULL;
UPDATE products SET type_pt = 'Água Enriquecida' WHERE type = 'Enhanced Water' AND type_pt IS NULL;
UPDATE products SET type_pt = 'Refrigerante Prebiótico' WHERE type = 'Prebiotic Soda' AND type_pt IS NULL;
UPDATE products SET type_pt = 'Refrigerante' WHERE type = 'Soda' AND type_pt IS NULL;
UPDATE products SET type_pt = 'Bebida' WHERE type = 'Beverage' AND type_pt IS NULL;
UPDATE products SET type_pt = 'Diversos' WHERE type = 'Misc' AND type_pt IS NULL;

-- Add default Portuguese translations for products without specific translations
UPDATE products SET 
  name_pt = name,
  description_pt = COALESCE(description, 'Uma bebida refrescante.'),
  type_pt = COALESCE(type_pt, type)
WHERE name_pt IS NULL; 