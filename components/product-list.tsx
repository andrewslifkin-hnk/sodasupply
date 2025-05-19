"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { motion } from "framer-motion"
import { getProducts } from "@/services/product-service"
import { ProductListSkeleton } from "@/components/skeletons"
import { useFilter } from "@/context/filter-context"

interface Product {
  id: number
  name: string
  type: string
  size: string
  price: number
  image: string
  returnable: boolean
  inStock: boolean
  brand?: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { searchQuery, sortOption, filterProducts, setFilteredProductCount } = useFilter()

  // Fetch products whenever search query changes
  useEffect(() => {
    let isMounted = true

    async function fetchProducts() {
      try {
        setLoading(true)
        // In a real app, you would pass the filters to your API
        // Here we'll fetch all products and filter them client-side
        const productsData = await getProducts(searchQuery || "")

        if (productsData.length > 0) {
          const mappedProducts = productsData.map((product) => ({
            id: product.id,
            name: product.name,
            type: product.type,
            size: product.size,
            price: product.price,
            image:
              product.image_url || `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(product.name)}`,
            returnable: product.returnable,
            inStock: product.in_stock,
            brand: product.name.split(" ")[0], // Extract brand from name for demo purposes
          }))

          if (isMounted) {
            setProducts(mappedProducts)
            setLoading(false)
          }
        } else {
          // Fallback to default products if none are found in the database
          if (isMounted) {
            setProducts(defaultProducts)
            setLoading(false)
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        if (isMounted) {
          setProducts(defaultProducts)
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [searchQuery])

  // Apply filters to products
  const filteredProducts = filterProducts(products)

  // Update the filtered product count in the context
  useEffect(() => {
    setFilteredProductCount(filteredProducts.length)
  }, [filteredProducts.length, setFilteredProductCount])

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "newest":
        return b.id - a.id // Using ID as a proxy for newness
      default: // featured
        return 0
    }
  })

  if (loading) {
    return <ProductListSkeleton />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedProducts.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-lg text-gray-500">No products found matching your criteria</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search term</p>
        </div>
      ) : (
        sortedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="transition-all duration-300"
          >
            <ProductCard product={product} />
          </motion.div>
        ))
      )}
    </div>
  )
}

// Default products as fallback
const defaultProducts = [
  {
    id: 1,
    name: "OLIPOP Vintage Cola 4-Pack",
    type: "Prebiotic",
    size: "4 x 12 fl oz",
    price: 11.99,
    image: "/products/OLIPOP-Prebiotic-Soda-Vintage-Cola-12-fl-oz-4-Pack-Pantry-Packs_a411ca43-2ff8-4297-bfd8-636c98da5bf6.b571756ee739db94ffcbc24556a21106.jpeg",
    returnable: true,
    inStock: true,
    brand: "Olipop",
  },
  {
    id: 2,
    name: "Poppi Strawberry Lemon Prebiotic Soda",
    type: "Prebiotic",
    size: "12 fl oz",
    price: 2.49,
    image: "/products/Poppi-Strawberry-Lemon-Prebiotic-Soda-12-oz-1-Pack-Can_6a9872ba-12fa-48a0-b8bb-ee9ba6750116.fba277c271a60a424d538bfa71d63e04 (1).jpeg",
    returnable: true,
    inStock: true,
    brand: "Poppi",
  },
  {
    id: 3,
    name: "OLIPOP Classic Root Beer",
    type: "Prebiotic",
    size: "4 x 12 fl oz",
    price: 11.99,
    image: "/products/OLIPOP-Prebiotic-Soda-Classic-Root-Beer-12-fl-oz-4-Pack-Pantry-Packs_1c4479aa-dcf4-4cff-81b6-d1797c9abb96.3f83822f383379fd4bf080076e004a20.jpeg",
    returnable: true,
    inStock: true,
    brand: "Olipop",
  },
  {
    id: 4,
    name: "Poppi Doc Pop Prebiotic Soda 4-Pack",
    type: "Prebiotic",
    size: "4 x 12 fl oz",
    price: 9.99,
    image: "/products/Poppi-Doc-Pop-Prebiotic-Soda-12-oz-4-Pack-Cans_4a67166f-efff-4668-9520-902e16db8245.626234501e4f3b68285a5e3add1aba28.jpeg",
    returnable: true,
    inStock: true,
    brand: "Poppi",
  },
  {
    id: 5,
    name: "OLIPOP Cherry Vanilla",
    type: "Prebiotic",
    size: "12 fl oz",
    price: 2.49,
    image: "/products/OLIPOP-Prebiotic-Soda-Cherry-Vanilla-12-fl-oz-Refrigerated_ed826f96-2f4b-4b79-b48c-54c14672f746.c283d6b3abb80b70f405ed0efcab610f (1).jpeg",
    returnable: false,
    inStock: true,
    brand: "Olipop",
  },
  {
    id: 6,
    name: "Poppi Cherry Limeade 4-Pack",
    type: "Prebiotic",
    size: "4 x 12 fl oz",
    price: 9.99,
    image: "/products/Poppi-Cherry-Limeade-Prebiotic-Soda-12-oz-4-Pack-Cans_1c1bab54-43ff-4493-a1ab-ce692fa9fa52.e873a04df12356897bfe4fdc8cb98973.jpeg",
    returnable: true,
    inStock: true,
    brand: "Poppi",
  },
  {
    id: 7,
    name: "OLIPOP Ginger Ale",
    type: "Prebiotic",
    size: "12 fl oz",
    price: 2.49,
    image: "/products/OLIPOP-Prebiotic-Soda-Ginger-Ale-12-fl-oz-Refrigerated_4be9f922-3024-4310-a97a-49cfccae7fc9.6df5e47b19350ef52f3b2d3351d5e1e0.jpeg",
    returnable: true,
    inStock: true,
    brand: "Olipop",
  },
  {
    id: 8,
    name: "OLIPOP Cream Soda 4-Pack",
    type: "Prebiotic",
    size: "4 x 12 fl oz",
    price: 11.99,
    image: "/products/OLIPOP-Prebiotic-Soda-Cream-Soda-12-fl-oz-4-Pack-Pantry-Packs_522a6251-8f10-4fa5-9753-ef1e4c0b700d.ef6cbd1cbbd0a4e019695cab9402a461.jpeg",
    returnable: true,
    inStock: true,
    brand: "Olipop",
  },
  {
    id: 9,
    name: "Poppi Orange Cream",
    type: "Prebiotic",
    size: "12 fl oz",
    price: 2.49,
    image: "/products/Poppi-Orange-Cream-Prebiotic-Soda-12-oz-1-Pack-Can_3a2e9a55-2228-4cba-8ed2-82c0ce2e45e0.5f50c08f000959eaf0508dd50235d5f1 (1).jpeg",
    returnable: true,
    inStock: true,
    brand: "Poppi",
  },
  {
    id: 10,
    name: "OLIPOP Banana Cream",
    type: "Prebiotic",
    size: "12 fl oz",
    price: 2.49,
    image: "/products/OLIPOP-Prebiotic-Soda-Banana-Cream-12-fl-oz-Refrigerated_ef9b03f9-b777-46d7-91a9-fd2191fb5dde.8e0902632fb4a0e9e742da37f3dfd072 (1).jpeg",
    returnable: false,
    inStock: true,
    brand: "Olipop",
  },
  {
    id: 11,
    name: "Poppi Raspberry Rose",
    type: "Prebiotic",
    size: "12 fl oz",
    price: 2.49,
    image: "/products/Poppi-Raspberry-Rose-Prebiotic-Soda-12-oz-1-Pack-Can_c2397ac2-56ff-4851-bbab-31cd30257e74.78ea0d9d55bd181cba0b99199cf44f55 (1).jpeg",
    returnable: true,
    inStock: true,
    brand: "Poppi",
  },
  {
    id: 12,
    name: "OLIPOP Cherry Cola 4-Pack",
    type: "Prebiotic",
    size: "4 x 12 fl oz",
    price: 11.99,
    image: "/products/OLIPOP-Prebiotic-Soda-Cherry-Cola-12-fl-oz-4-Pack-Pantry-Packs_2994d7c8-bb50-41c9-b2d3-8525f6218683.0b4180d69dda37c5885156d387bd7325 (1).jpeg",
    returnable: true,
    inStock: false,
    brand: "Olipop",
  },
  {
    id: 13,
    name: "Poppi Classic Cola",
    type: "Prebiotic",
    size: "12 fl oz",
    price: 2.49,
    image: "/products/Poppi-Classic-Cola-Prebiotic-Soda-12-oz-1-Pack-Can_5978c167-1271-43b0-b13d-6bc63266b60f.d92522c6001a7414affc985e7d9d0da6 (1).jpeg",
    returnable: true,
    inStock: true,
    brand: "Poppi",
  },
  {
    id: 14,
    name: "OLIPOP Tropical Punch",
    type: "Prebiotic",
    size: "12 fl oz",
    price: 2.49,
    image: "/products/OLIPOP-Prebiotic-Soda-Tropical-Punch-12-fl-oz_c3c44b6e-5867-4f79-9933-1a2f4f016d00.d6fa8076e52928b889b016a1753bdb04 (1).jpeg",
    returnable: true,
    inStock: true,
    brand: "Olipop",
  },
  {
    id: 15,
    name: "Poppi Strawberry Lemon Mini Cans",
    type: "Prebiotic",
    size: "7.5 fl oz",
    price: 1.99,
    image: "/products/poppi-Strawberry-Lemon-7-5oz-Mini-Can_0958e817-2d42-48f8-8cf6-9e66cb8d240b.bb20e3ac1fd4d20015e5e24e77b83e25 (1).jpeg",
    returnable: false,
    inStock: true,
    brand: "Poppi",
  },
  {
    id: 16,
    name: "OLIPOP Classic Grape",
    type: "Prebiotic",
    size: "12 fl oz",
    price: 2.49,
    image: "/products/OLIPOP-Prebiotic-Soda-Classic-Grape-12-fl-oz-Pantry-Packs_5bac9c51-ac9e-4d23-bf61-d5a41f30fabd.339e98f4cc13073004324e89382aab2d.jpeg",
    returnable: true,
    inStock: true,
    brand: "Olipop",
  },
  {
    id: 17,
    name: "Coca-Cola Classic 12-Pack",
    type: "Soda",
    size: "12 x 12 fl oz",
    price: 6.99,
    image: "/products/Coca-Cola-Classic-Soda-Pop-Fridge-Pack-12-fl-oz-Cans-12-Pack_f69cdc2c-b50b-48a2-9a99-90b70870d3fd.38aeec71eb668abc670732098e30e064.jpeg",
    returnable: true,
    inStock: true,
    brand: "Coca-Cola",
  },
  {
    id: 18,
    name: "Coca-Cola Zero Sugar 24-Pack",
    type: "Soda",
    size: "24 x 12 fl oz",
    price: 11.99,
    image: "/products/Coca-Cola-Zero-Sugar-Sugar-Free-Soda-Pop-12-fl-oz-Cans-24-Pack_3b326608-9ff5-409d-a0de-42008993f114.b20a167b211a46171e8f6cd973bdebea.jpeg",
    returnable: true,
    inStock: true,
    brand: "Coca-Cola",
  },
  {
    id: 19,
    name: "Diet Coke",
    type: "Soda",
    size: "2 Liter",
    price: 2.29,
    image: "/products/Diet-Coke-Diet-Cola-Soda-Pop-2-Liters-Bottle_deac1d1b-353c-406a-bb77-54182000a787.212ae0042fb709a752bb5a3594e5a8eb.jpeg",
    returnable: false,
    inStock: true,
    brand: "Coca-Cola",
  },
  {
    id: 20,
    name: "Sprite Lemon-Lime 12-Pack",
    type: "Soda",
    size: "12 x 12 fl oz",
    price: 6.99,
    image: "/products/Sprite-Lemon-Lime-Soda-Pop-12-fl-oz-12-Pack-Cans_78d05f57-50d6-4599-b5c3-a646ec48b889.a0dc236de895322cca7530073792fc26.jpeg",
    returnable: true,
    inStock: true,
    brand: "Sprite",
  },
  {
    id: 21,
    name: "Sprite Lemon-Lime 24-Pack",
    type: "Soda",
    size: "24 x 12 fl oz",
    price: 11.99,
    image: "/products/Sprite-Lemon-Lime-Soda-Pop-12-fl-oz-24-Pack-Cans_2be0b1e4-cb9e-4d72-b8d3-43459758e9c5.579701aa47eef734a40695771a25607b.jpeg",
    returnable: true,
    inStock: true,
    brand: "Sprite",
  },
  {
    id: 22,
    name: "OLIPOP Strawberry Vanilla 4-Pack",
    type: "Prebiotic",
    size: "4 x 12 fl oz",
    price: 11.99,
    image: "/products/OLIPOP-Prebiotic-Soda-Strawberry-Vanilla-12-fl-oz-4-Pack-Pantry-Packs_4abd8a0c-7f42-48c7-8e63-4a2fdcc031fd.ddb345958fd69b8a7ff780d2dc1c4982.jpeg",
    returnable: true,
    inStock: true,
    brand: "Olipop",
  },
  {
    id: 23,
    name: "OLIPOP Cream Soda 4-Pack Premium",
    type: "Prebiotic",
    size: "4 x 12 fl oz",
    price: 12.99,
    image: "/products/OLIPOP-Prebiotic-Soda-Cream-Soda-12-fl-oz-4-Pack-Pantry-Packs_522a6251-8f10-4fa5-9753-ef1e4c0b700d.ef6cbd1cbbd0a4e019695cab9402a461.jpeg",
    returnable: true,
    inStock: true,
    brand: "Olipop",
  },
  {
    id: 24,
    name: "Poppi Lemon Lime",
    type: "Prebiotic",
    size: "12 fl oz",
    price: 2.49,
    image: "/products/Poppi-Lemon-Lime-Prebiotic-Soda-12-oz-1-Pack-Can_7f9651a0-66e9-4ad6-b66c-0652dd637d00.febd295d14c5b13d1efcf8cfd1d3fa76 (1).jpeg",
    returnable: true,
    inStock: true,
    brand: "Poppi",
  },
  {
    id: 25,
    name: "Poppi Grape",
    type: "Prebiotic",
    size: "12 fl oz",
    price: 2.49,
    image: "/products/Poppi-Grape-Prebiotic-Soda-12-oz-1-Pack-Can_eb4d6323-6e85-4913-8b66-d79267622e5d.3ce39aedbf637694b385bf83101485da (1).jpeg",
    returnable: true,
    inStock: true,
    brand: "Poppi",
  },
  {
    id: 26,
    name: "Poppi Cherry Limeade",
    type: "Prebiotic",
    size: "12 fl oz",
    price: 2.49,
    image: "/products/Poppi-Cherry-Limeade-Prebiotic-Soda-12-oz-1-Pack-Can_f781f445-b7a9-4471-9b8f-07f89bc06612.43dc1c7f8b6ca56127cce6c4f7e4f5a4 (1).jpeg",
    returnable: true,
    inStock: true,
    brand: "Poppi",
  },
  {
    id: 27,
    name: "Premium Cola Variety Pack",
    type: "Soda",
    size: "12 x 12 fl oz",
    price: 14.99,
    image: "/products/04b0220b-def5-4481-b727-00d6c55d6234.c306a466de3157600795cc1064b62953.jpeg",
    returnable: true,
    inStock: true,
    brand: "Assorted",
  },
  {
    id: 28,
    name: "Citrus Sparkling Beverage",
    type: "Sparkling Water",
    size: "8 x 12 fl oz",
    price: 9.99,
    image: "/products/8aa3f01a-9f6d-43c4-a1f3-0a33fa8dad1d.46c5fde827e0adee668603f00cc44de5.jpeg",
    returnable: true,
    inStock: true,
    brand: "Citrus",
  },
  {
    id: 29,
    name: "Cherry Cola Premium",
    type: "Soda",
    size: "12 fl oz",
    price: 1.99,
    image: "/products/59a6d1d9-a5f2-42ff-ad8c-03a726316d34.dc1a5696efffccefb24602ba63c42675.jpeg",
    returnable: false,
    inStock: true,
    brand: "Cherry",
  },
  {
    id: 30,
    name: "Orange Soda",
    type: "Soda",
    size: "12 fl oz",
    price: 1.79,
    image: "/products/82c32506-f8ed-449b-8573-1adb6e5a349a.52fe5f21ddf4d307d51a4511c7fc6552.jpeg",
    returnable: false,
    inStock: true,
    brand: "Orange",
  },
  {
    id: 31,
    name: "Raspberry Sparkling Water",
    type: "Sparkling Water",
    size: "8 x 12 fl oz",
    price: 8.99,
    image: "/products/bbf58b74-1fa3-442e-9121-3cb07cae870a.611dae149a452cb0141827ee3d6ff2bc.jpeg",
    returnable: true,
    inStock: true,
    brand: "Raspberry",
  },
  {
    id: 32,
    name: "Energy Drink Blue",
    type: "Energy Drink",
    size: "16 fl oz",
    price: 2.99,
    image: "/products/ea4d324e-9857-4c44-83c0-9325a8ab0435.ce719d17ee6efd1b7039ffa61ac0fdc2.jpeg",
    returnable: false,
    inStock: true,
    brand: "Energy",
  },
  {
    id: 33,
    name: "Gatorade Frost Glacier Freeze 12-Pack",
    type: "Sports Drink",
    size: "12 x 12 fl oz",
    price: 9.99,
    image: "/products/Gatorade-Frost-Thirst-Quencher-Glacier-Freeze-Sports-Drinks-12-fl-oz-12-Count-Bottles_a1cc3e1b-d158-4354-a429-7991a1d3aecd.f07dad619a3d54b53ebf007fdc4c0bc0.jpeg",
    returnable: true,
    inStock: true,
    brand: "Gatorade",
  },
  {
    id: 34,
    name: "BODYARMOR Fruit Punch 8-Pack",
    type: "Sports Drink",
    size: "8 x 12 fl oz",
    price: 11.99,
    image: "/products/BODYARMOR-Fruit-Punch-Electrolyte-Sports-Drink-12-fl-oz-8-Pack-Bottles_a2740ba1-610b-4517-b7c3-6bf0e361b746.0c290d2da55e806d4032303ab4f34a3c.jpeg",
    returnable: true,
    inStock: true,
    brand: "BODYARMOR",
  },
  {
    id: 35,
    name: "BODYARMOR Orange Mango 8-Pack",
    type: "Sports Drink",
    size: "8 x 12 fl oz",
    price: 11.99,
    image: "/products/BODYARMOR-SuperDrink-Orange-Mango-Sports-Drink-12-fl-oz-bottles-8-pack_cb7ebb21-5351-4e2c-9504-3c356082ce36.1a430f1befa758fa7210de74afdf6959.jpeg",
    returnable: true,
    inStock: true,
    brand: "BODYARMOR",
  },
  {
    id: 36,
    name: "BODYARMOR Strawberry Banana 8-Pack",
    type: "Sports Drink",
    size: "8 x 12 fl oz",
    price: 11.99,
    image: "/products/BODYARMOR-SuperDrink-Strawberry-Banana-Sports-Drink-12-fl-oz-bottles-8-pack_0c0058e1-6404-417a-8784-9b785f0d1149.795788580b288744c702eb12244bb06d.jpeg",
    returnable: true,
    inStock: true,
    brand: "BODYARMOR",
  },
  {
    id: 37,
    name: "Gatorade Cool Blue 28oz",
    type: "Sports Drink",
    size: "28 fl oz",
    price: 2.29,
    image: "/products/Gatorade-Thirst-Quencher-Sports-Drink-Cool-Blue-28-fl-oz-Bottle_631b7d6d-5d58-4497-ab55-d67019d77737.c1c6c158cdcbee2d8bd3950b9019b21e.jpeg",
    returnable: false,
    inStock: true,
    brand: "Gatorade",
  },
  {
    id: 38,
    name: "Gatorade Glacier Cherry 12-Pack",
    type: "Sports Drink",
    size: "12 x 12 fl oz",
    price: 9.99,
    image: "/products/Gatorade-Frost-Thirst-Quencher-Glacier-Cherry-Bottled-Sports-Drink-12-fl-oz-12-Count-Bottles_76f3465e-8454-4511-8666-1f55e9e9f89b.33a30e802ab2e01e15a166b437cce197.jpeg",
    returnable: true,
    inStock: true,
    brand: "Gatorade",
  },
  {
    id: 39,
    name: "POWERADE Mountain Berry Blast 8-Pack",
    type: "Sports Drink",
    size: "8 x 12 fl oz",
    price: 8.99,
    image: "/products/POWERADE-Mountain-Berry-Blast-Bottled-Electrolyte-Sports-Drink-12-fl-oz-8-Count_9a442df3-ad8c-48a7-95fd-573224987551.8efa6e3a703d0a51609b1f292e63c61c.jpeg",
    returnable: true,
    inStock: true,
    brand: "POWERADE",
  },
  {
    id: 40,
    name: "POWERADE Fruit Punch 8-Pack",
    type: "Sports Drink",
    size: "8 x 20 fl oz",
    price: 11.99,
    image: "/products/POWERADE-Fruit-Punch-Bottled-Electrolyte-Sports-Drink-20-fl-oz-8-Count_8f4a0c0a-a711-4be9-8a37-7874889409dd.ab78b24827aa3e4538a06a7991a63676.jpeg",
    returnable: true,
    inStock: true,
    brand: "POWERADE",
  },
  {
    id: 41,
    name: "vitaminwater XXX Acai-Blueberry 6-Pack",
    type: "Enhanced Water",
    size: "6 x 16.9 fl oz",
    price: 8.49,
    image: "/products/vitaminwater-XXX-Acai-Blueberry-Pomegranate-Flavored-Water-Beverage-16-9-fl-oz-6-Pack-Bottles_d3547c1c-cab7-43af-815e-8706bf1b5815.4204caa03a7f7f3d3f2237b6283d04a3.jpeg",
    returnable: true,
    inStock: true,
    brand: "vitaminwater",
  },
  {
    id: 42,
    name: "vitaminwater Power-C Dragonfruit 6-Pack",
    type: "Enhanced Water",
    size: "6 x 16.9 fl oz",
    price: 8.49,
    image: "/products/vitaminwater-Power-C-Dragonfruit-Flavored-Water-Beverage-16-9-fl-oz-6-Pack-Bottles_cb99d096-946d-46e8-b4a9-d0f8007551d9.b3ad6549c0e0ae76eaafc5b662beeb02.jpeg",
    returnable: true,
    inStock: true,
    brand: "vitaminwater",
  },
  {
    id: 43,
    name: "POWERADE ZERO Grape 8-Pack",
    type: "Sports Drink",
    size: "8 x 20 fl oz",
    price: 11.99,
    image: "/products/POWERADE-ZERO-Grape-Bottled-Electrolyte-Sports-Drink-20-fl-oz-8-Count_7c1932d2-76c0-4023-b2d9-43bd59a23a39.cbf84459bcfeb784dc2cbcb2ea05133d.jpeg",
    returnable: true,
    inStock: true,
    brand: "POWERADE",
  },
  {
    id: 44,
    name: "BODYARMOR Lyte Dragonfruit Berry",
    type: "Sports Drink",
    size: "16 fl oz",
    price: 2.29,
    image: "/products/BODYARMOR-Lyte-Dragonfruit-Berry-Sports-Drink-16-fl-oz-Bottle_b0bf41b8-0f0e-4c74-831b-86b1ec74f4ac.0ddcf1e68eb63af894f54b745a995885.jpeg",
    returnable: false,
    inStock: true,
    brand: "BODYARMOR",
  },
  {
    id: 45,
    name: "Propel Kiwi Strawberry 12-Pack",
    type: "Fitness Water",
    size: "12 x 16.9 fl oz",
    price: 10.99,
    image: "/products/Propel-Flavored-Water-with-Electrolytes-Kiwi-Strawberry-16-9-fl-oz-12-Pack_f6fa331e-9a41-431d-8a5e-69488d5c5c03.d646c6c15de8f8ba385f528ad99fde96.jpeg",
    returnable: true,
    inStock: true,
    brand: "Propel",
  },
  {
    id: 46,
    name: "Propel Workout Water Variety Pack",
    type: "Fitness Water",
    size: "18 x 16.9 fl oz",
    price: 15.99,
    image: "/products/Propel-Workout-Water-Variety-Pack-16-9-fl-oz-18-Count-Bottles_6bc1584b-68a8-4ee1-9bd5-6fed985cae5c.77dd01dc71484f81ddb4cd6d8b371c31.jpeg",
    returnable: true,
    inStock: true,
    brand: "Propel",
  },
  {
    id: 47,
    name: "BODYARMOR Lyte Peach Mango 8-Pack",
    type: "Sports Drink",
    size: "8 x 12 fl oz",
    price: 11.99,
    image: "/products/BODYARMOR-Lyte-Peach-Mango-Electrolyte-Sports-Drink-12-fl-oz-8-Pack-Bottles_b2d911c1-2034-4600-8dbd-e2082a6077d2.b5e0891174e7b1651e3433cc039cc420.jpeg",
    returnable: true,
    inStock: true,
    brand: "BODYARMOR",
  },
  {
    id: 48,
    name: "Gatorade Zero Variety Pack",
    type: "Sports Drink",
    size: "18 x 12 fl oz",
    price: 12.99,
    image: "/products/Gatorade-Zero-Sugar-Thirst-Quencher-Variety-Pack-Berry-Glacier-Cherry-Glacier-Freeze-Sports-Drinks-12-fl-oz-18-Count-Bottles_886dd60c-ca21-4d77-8a0a-122bf446189e.c7f2c6acc0e590fb5ec9420b9b9cdb92.jpeg",
    returnable: true,
    inStock: true,
    brand: "Gatorade",
  },
  {
    id: 49,
    name: "Gatorade Fierce Orange 12-Pack",
    type: "Sports Drink",
    size: "12 x 12 fl oz",
    price: 9.99,
    image: "/products/Gatorade-Fierce-Thirst-Quencher-Sports-Drink-Orange-12-oz-Bottles-12-Count_f217dfdc-588c-4d01-8c28-273bf81f3059.aa7368367a0da848c51ec532775a0d64.jpeg",
    returnable: true,
    inStock: true,
    brand: "Gatorade",
  },
  {
    id: 50,
    name: "Gatorade Frost Variety Pack",
    type: "Sports Drink",
    size: "18 x 12 fl oz",
    price: 12.99,
    image: "/products/Gatorade-Frost-Thirst-Quencher-Variety-Pack-Glacier-Freeze-Cherry-Arctic-Blitz-Sports-Drinks-12-fl-oz-18-Ct-Bottles_7815b5a1-f294-4d3b-9ea9-3a6ea324f723.cd35c6714c25906ef9b31d06a359780f.jpeg",
    returnable: true,
    inStock: true,
    brand: "Gatorade",
  },
]
