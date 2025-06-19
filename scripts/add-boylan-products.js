const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Boylan products data
const boylanProducts = [
  // Individual Boylan Craft Sodas (12 fl oz Glass Bottles)
  {
    name: 'Boylan Black Cherry',
    type: 'Craft Soda',
    size: '12 fl oz Glass Bottle',
    price: 2.49,
    image_url: '/products/boylan-bottling-co-boyl-bbc-main.jpg',
    description: 'Premium craft soda with real black cherry flavor in traditional glass bottles',
    returnable: true,
    in_stock: true,
    name_pt: 'Boylan Cereja Preta',
    description_pt: 'Refrigerante artesanal premium com sabor real de cereja preta em garrafas de vidro tradicionais',
    type_pt: 'Refrigerante Artesanal'
  },
  {
    name: 'Boylan Cherry Cola',
    type: 'Craft Soda',
    size: '12 fl oz Glass Bottle',
    price: 2.49,
    image_url: '/products/boylan-bottling-co-boyl-bcc-main.jpg',
    description: 'Classic cherry cola with natural flavors and pure cane sugar in glass bottles',
    returnable: true,
    in_stock: true,
    name_pt: 'Boylan Cola de Cereja',
    description_pt: 'Cola de cereja clássica com sabores naturais e açúcar de cana puro em garrafas de vidro',
    type_pt: 'Refrigerante Artesanal'
  },
  {
    name: 'Boylan Cane Cola',
    type: 'Craft Soda',
    size: '12 fl oz Glass Bottle',
    price: 2.49,
    image_url: '/products/boylan-bottling-co-boyl-bcr-main.jpg',
    description: 'Original cola made with pure cane sugar and natural kola nut extract',
    returnable: true,
    in_stock: true,
    name_pt: 'Boylan Cola de Cana',
    description_pt: 'Cola original feita com açúcar de cana puro e extrato natural de noz de cola',
    type_pt: 'Refrigerante Artesanal'
  },
  // Boylan Diet Craft Sodas (12 fl oz Glass Bottles)
  {
    name: 'Boylan Diet Black Cherry',
    type: 'Diet Craft Soda',
    size: '12 fl oz Glass Bottle',
    price: 2.49,
    image_url: '/products/boylan-bottling-co-boyl-bdbc-main.jpg',
    description: 'Sugar-free black cherry soda with the same great taste in glass bottles',
    returnable: true,
    in_stock: true,
    name_pt: 'Boylan Diet Cereja Preta',
    description_pt: 'Refrigerante de cereja preta sem açúcar com o mesmo ótimo sabor em garrafas de vidro',
    type_pt: 'Refrigerante Diet Artesanal'
  },
  {
    name: 'Boylan Diet Cherry Cola',
    type: 'Diet Craft Soda',
    size: '12 fl oz Glass Bottle',
    price: 2.49,
    image_url: '/products/boylan-bottling-co-boyl-bdcc-main.jpg',
    description: 'Diet cherry cola with natural flavors and zero sugar',
    returnable: true,
    in_stock: true,
    name_pt: 'Boylan Diet Cola de Cereja',
    description_pt: 'Cola de cereja diet com sabores naturais e zero açúcar',
    type_pt: 'Refrigerante Diet Artesanal'
  },
  {
    name: 'Boylan Diet Cane Cola',
    type: 'Diet Craft Soda',
    size: '12 fl oz Glass Bottle',
    price: 2.49,
    image_url: '/products/boylan-bottling-co-boyl-bdcr-main.jpg',
    description: 'Sugar-free version of the classic cane cola with authentic taste',
    returnable: true,
    in_stock: true,
    name_pt: 'Boylan Diet Cola de Cana',
    description_pt: 'Versão sem açúcar da cola de cana clássica com sabor autêntico',
    type_pt: 'Refrigerante Diet Artesanal'
  },
  {
    name: 'Boylan Diet Root Beer',
    type: 'Diet Craft Soda',
    size: '12 fl oz Glass Bottle',
    price: 2.49,
    image_url: '/products/boylan-bottling-co-boyl-bdrb-main.jpg',
    description: 'Classic diet root beer with smooth vanilla notes and zero sugar',
    returnable: true,
    in_stock: true,
    name_pt: 'Boylan Diet Root Beer',
    description_pt: 'Root beer diet clássico com notas suaves de baunilha e zero açúcar',
    type_pt: 'Refrigerante Diet Artesanal'
  },
  // Boylan Variety Packs
  {
    name: 'Boylan Diet Soda Variety Pack (12 Count)',
    type: 'Diet Craft Soda',
    size: '12 fl oz (12 Glass Bottles)',
    price: 27.99,
    image_url: '/products/boylan-diet_variety-oxiv-boyl-dtvp-w15-u12-main.jpg',
    description: 'Assorted pack of diet craft sodas featuring multiple flavors in glass bottles',
    returnable: true,
    in_stock: true,
    name_pt: 'Boylan Pacote Variedades Diet (12 Unidades)',
    description_pt: 'Pacote sortido de refrigerantes diet artesanais com múltiplos sabores em garrafas de vidro',
    type_pt: 'Refrigerante Diet Artesanal'
  },
  {
    name: 'Boylan Diet Soda Variety Pack (24 Count)',
    type: 'Diet Craft Soda',
    size: '12 fl oz (24 Glass Bottles)',
    price: 52.99,
    image_url: '/products/boylan-diet_variety-oopo-boyl-dtvp-w29-u24-main.jpg',
    description: 'Large variety pack of diet craft sodas with multiple flavors in glass bottles',
    returnable: true,
    in_stock: true,
    name_pt: 'Boylan Pacote Variedades Diet (24 Unidades)',
    description_pt: 'Pacote grande de refrigerantes diet artesanais com múltiplos sabores em garrafas de vidro',
    type_pt: 'Refrigerante Diet Artesanal'
  }
];

async function addBoylanProducts() {
  try {
    console.log('🚀 Starting to add Boylan craft soda products...');
    
    // Check if products already exist to avoid duplicates
    const { data: existingProducts } = await supabase
      .from('products')
      .select('name')
      .like('name', '%Boylan%');
    
    if (existingProducts && existingProducts.length > 0) {
      console.log('⚠️  Some Boylan products already exist. Skipping to avoid duplicates...');
      console.log('Existing products:', existingProducts.map(p => p.name));
      return;
    }
    
    // Insert all products
    const { data, error } = await supabase
      .from('products')
      .insert(boylanProducts)
      .select();
    
    if (error) {
      console.error('❌ Error adding products:', error);
      return;
    }
    
    console.log(`✅ Successfully added ${data.length} Boylan products!`);
    console.log('Added products:');
    data.forEach(product => {
      console.log(`  - ${product.name} (${product.type}) - €${product.price}`);
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
addBoylanProducts(); 