const fs = require("fs");
const path = require("path");

// --- CONFIGURATION ---
const productsDir = path.join(process.cwd(), "public/products");
const outputSqlPath = path.join(process.cwd(), "scripts/db/rebuild_products.sql");

// --- HELPER FUNCTIONS ---

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function cleanSize(s: string): string {
  return s.replace(/-fl-oz/g, ' fl oz').replace(/-/g, ' ');
}

// Identifies filenames that are likely UUIDs or hashes instead of descriptive names
function isGibberish(filenameBase: string): boolean {
    const knownBrands = ['gatorade', 'powerade', 'olipop', 'poppi', 'sprite', 'propel', 'vitaminwater', 'savia', 'great-value'];
    const lowerName = filenameBase.toLowerCase();

    // If it contains a known brand, it's probably descriptive
    if (knownBrands.some(brand => lowerName.includes(brand))) {
        return false;
    }

    // If it's mostly numbers and hyphens, it's likely gibberish
    const alphaChars = (lowerName.match(/[a-z]/g) || []).length;
    if (lowerName.length > 20 && (alphaChars / lowerName.length) < 0.5) {
        return true;
    }
    
    // Check for UUID-like patterns (e.g., f0095011-...)
    if (/^[a-f0-9]{8}-/.test(lowerName)) {
        return true;
    }

    return false;
}

// Main function to parse a filename into product data
function parseFilename(filename: string): any {
    let base = path.parse(filename).name.replace(/\s\(\d+\)$/, ''); // remove " (1)"
    const originalBase = base.split('_')[0]; // The part before any UUID hash

    if (!originalBase) return null;

    // Check if the filename is gibberish
    if (isGibberish(originalBase)) {
        return {
            name: `NEEDS_REVIEW: ${filename}`,
            type: 'Beverage',
            size: 'Standard',
            price: 4.99,
            image_url: `/products/${filename}`,
            description: 'Description to be updated.',
            returnable: false,
            in_stock: true,
            needs_review: true // Flag for later
        };
    }

    const parts = originalBase.split('-');
    const brand = capitalize(parts[0]);

    let sizeStartIndex = parts.findIndex((part: string, i: number) => 
      /\d/.test(part) && (parts[i+1] === 'fl' || parts[i+1] === 'oz' || parts[i+1] === 'Pack')
    );

    let nameParts = parts.slice(1, sizeStartIndex > 0 ? sizeStartIndex : undefined);
    let sizeParts = sizeStartIndex > 0 ? parts.slice(sizeStartIndex) : [];
    
    let name = nameParts.map(capitalize).join(' ');
    let size = cleanSize(sizeParts.join(' '));
    
    const fullProductName = `${brand} ${name}`.trim();

    let type = 'Beverage';
    const lowerCaseName = fullProductName.toLowerCase();
    if (lowerCaseName.includes('soda')) type = 'Soda';
    if (lowerCaseName.includes('sports drink') || lowerCaseName.includes('powerade') || lowerCaseName.includes('gatorade')) type = 'Sports Drink';
    if (lowerCaseName.includes('water') || lowerCaseName.includes('propel') || lowerCaseName.includes('vitaminwater')) type = 'Enhanced Water';
    if (lowerCaseName.includes('juice')) type = 'Juice';

    const price = (Math.random() * (25 - 3) + 3).toFixed(2);

    return {
        name: fullProductName,
        type: type,
        size: size || 'Standard',
        price: parseFloat(price),
        image_url: `/products/${filename}`,
        description: `A refreshing ${fullProductName}.`,
        returnable: false,
        in_stock: true,
        needs_review: false
    };
}


// --- SCRIPT EXECUTION ---

const allImageFiles = fs.readdirSync(productsDir).filter((f: string) => /\.(jpe?g|png)$/i.test(f));
const uniqueImages = new Map<string, string>();
allImageFiles.forEach((f: string) => {
    const base = path.parse(f).name.replace(/\s\(\d+\)$/, '').split('_')[0];
    if (base && !uniqueImages.has(base)) {
        uniqueImages.set(base, f);
    }
});

const allProducts = Array.from(uniqueImages.values()).map(parseFilename).filter((p: any) => p !== null);

// Separate good products from those needing review
const goodProducts = allProducts.filter((p: any) => !p.needs_review);
const reviewProducts = allProducts.filter((p: any) => p.needs_review);

const sqlStatements: string[] = [
    '-- This script completely rebuilds the products table.',
    '-- Backup your data before running this!',
    'TRUNCATE TABLE products RESTART IDENTITY CASCADE;',
    ''
];

// Add good products first
goodProducts.forEach((p: any) => {
    const name = p.name.replace(/'/g, "''");
    const description = p.description.replace(/'/g, "''");
    const type = p.type.replace(/'/g, "''");
    const size = p.size.replace(/'/g, "''");
    sqlStatements.push(
        `INSERT INTO products (name, type, size, price, image_url, description, returnable, in_stock) VALUES (` +
        `'${name}', '${type}', '${size}', ${p.price}, '${p.image_url}', '${description}', ${p.returnable}, ${p.in_stock});`
    );
});

// Add placeholder products that need review
if (reviewProducts.length > 0) {
    sqlStatements.push('\n-- =================================================================');
    sqlStatements.push('-- PRODUCTS REQUIRING MANUAL NAME CORRECTION');
    sqlStatements.push('-- =================================================================');
    reviewProducts.forEach((p: any) => {
        const name = p.name.replace(/'/g, "''");
        sqlStatements.push(
            `INSERT INTO products (name, type, size, price, image_url, description, returnable, in_stock) VALUES (` +
            `'${name}', '${p.type}', '${p.size}', ${p.price}, '${p.image_url}', '${p.description}', ${p.returnable}, ${p.in_stock});`
        );
    });
}


fs.writeFileSync(outputSqlPath, sqlStatements.join('\n') + '\n');

// Final console output
console.log(`✅ Successfully generated ${goodProducts.length} product entries automatically.`);
if (reviewProducts.length > 0) {
    console.log(`\n⚠️  ${reviewProducts.length} products need manual review.`);
    console.log("Their filenames were not descriptive. I've added them to the SQL file with a placeholder name like 'NEEDS_REVIEW:'.");
    console.log("\nACTION REQUIRED:");
    console.log("Please drag and drop the following images into our chat. For each one, I will provide the correct product details.");
    reviewProducts.forEach((p: any) => {
        console.log(`  - ${p.image_url.substring(1)}`); // e.g., products/f0095011-....jpeg
    });
    console.log("\nAfter I give you the details, edit the generated `rebuild_products.sql` file before running it in Supabase.");
}
console.log(`\n➡️  Your SQL script is ready at: ${outputSqlPath}`); 