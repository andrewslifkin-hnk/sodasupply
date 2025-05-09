const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

const downloadFile = (url, destination) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${destination}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(destination, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {});
      reject(err);
    });
  });
};

async function main() {
  const productImages = [
    {
      name: 'coca-cola-6pack.png',
      url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Beverage%20box/3D/beverage_box_3d.png'
    },
    {
      name: 'sparkling-water-variety.png',
      url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cup%20with%20straw/3D/cup_with_straw_3d.png'
    },
    {
      name: 'fanta-orange-2l.png',
      url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Teacup%20without%20handle/3D/teacup_without_handle_3d.png'
    },
    {
      name: 'sprite-8pack.png',
      url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Bubble%20tea/3D/bubble_tea_3d.png'
    },
    {
      name: 'redbull-4pack.png',
      url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Green%20salad/3D/green_salad_3d.png'
    },
    {
      name: 'lipton-peach-tea.png',
      url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Hot%20beverage/3D/hot_beverage_3d.png'
    },
    {
      name: 'evian-6pack.png',
      url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Pouring%20liquid/3D/pouring_liquid_3d.png'
    },
    {
      name: 'coke-zero-1.5l.png',
      url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Tumbler%20glass/3D/tumbler_glass_3d.png'
    },
    {
      name: 'canada-dry-4pack.png',
      url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Beer%20mug/3D/beer_mug_3d.png'
    },
    {
      name: 'heineken-24pack.png',
      url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Bottle%20with%20popping%20cork/3D/bottle_with_popping_cork_3d.png'
    }
  ];

  const productsDir = path.join(__dirname, '../public/products');
  
  // Create the products directory if it doesn't exist
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }
  
  // Download all images
  for (const image of productImages) {
    const destination = path.join(productsDir, image.name);
    try {
      await downloadFile(image.url, destination);
    } catch (error) {
      console.error(`Error downloading ${image.name}:`, error.message);
    }
  }
  
  console.log('All downloads completed!');
}

main().catch(console.error); 