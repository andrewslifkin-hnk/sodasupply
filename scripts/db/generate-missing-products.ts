const fs = require("fs");
const path = require("path");

// --- CONFIGURE THESE ---
const productsDir = path.join(process.cwd(), "public/products");
const existingProductsJsonPath = path.join(process.cwd(), "scripts/db/existing-products.json");
const existingProductsCsvPath = path.join(process.cwd(), "scripts/db/existing-products.csv");
const outputSqlPath = path.join(process.cwd(), "scripts/db/insert-missing-products.sql");

// --- Load all product images ---
const imageFiles = fs.readdirSync(productsDir).filter((f: string) => /\.(jpe?g|png)$/i.test(f));

// --- Load existing products (export from Supabase as JSON) ---
let existingProducts: { image_url: string }[] = [];
if (fs.existsSync(existingProductsJsonPath)) {
  existingProducts = JSON.parse(fs.readFileSync(existingProductsJsonPath, "utf-8"));
} else if (fs.existsSync(existingProductsCsvPath)) {
  // Parse CSV manually (no external deps)
  const csv = fs.readFileSync(existingProductsCsvPath, "utf-8");
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(",");
  const imageIdx = header.findIndex((h: string) => h.trim() === "image_url");
  if (imageIdx === -1) {
    console.error("CSV does not have an image_url column");
    process.exit(1);
  }
  existingProducts = lines.slice(1).map((line: string) => {
    const cols = line.split(",");
    return { image_url: cols[imageIdx] };
  });
} else {
  console.error("Export your current products to scripts/db/existing-products.json or .csv first!");
  process.exit(1);
}
const usedImages = new Set(existingProducts.map(p => p.image_url.replace(/^\//, "")));

// --- Generate SQL for missing images ---
const sqlStatements: string[] = [];
for (const img of imageFiles) {
  const relPath = `/products/${img}`;
  if (!usedImages.has(`products/${img}`)) {
    const name = path.parse(img).name.replace(/[-_]/g, " ");
    sqlStatements.push(
      `INSERT INTO products (name, type, size, price, image_url, description, returnable, in_stock) VALUES (` +
      `'${name.replace(/'/g, "''")}', 'Misc', '', 0, '${relPath}', '', FALSE, TRUE);`
    );
  }
}

if (sqlStatements.length === 0) {
  console.log("No missing products found. All images are covered.");
} else {
  fs.writeFileSync(outputSqlPath, sqlStatements.join("\n") + "\n");
  console.log(`Wrote ${sqlStatements.length} SQL statements to ${outputSqlPath}`);
}