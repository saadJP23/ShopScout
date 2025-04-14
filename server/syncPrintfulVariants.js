// syncPrintfulVariants.js
const express = require("express");
const router = express.Router();
const Product = require("./sequelize-models/Product");
const printful = require("./printful");

// Helper: Convert variant sizes to [{ size: "S", units: 3 }, ...]
const formatSizes = (variants) => {
  const sizeCount = {};
  variants.forEach((v) => {
    if (v.size) {
      sizeCount[v.size] = (sizeCount[v.size] || 0) + 1;
    }
  });
  return Object.entries(sizeCount).map(([size, units]) => ({ size, units }));
};



// Helper: Guess category from title
const guessCategory = (title) => {
  title = title.toLowerCase();
  if (
    title.includes("baby") ||
    title.includes("infant") ||
    title.includes("kid")
  )
    return "child";
  if (title.includes("men") || title.includes("male")) return "male";
  if (title.includes("women") || title.includes("female")) return "female";
  return "unisex"; // fallback
};

router.post("/api/sync-printful-detailed", async (req, res) => {
  try {
    const basicList = await printful.get("/store/products");

    let syncedProducts = [];

    for (const item of basicList.data.result) {
      const fullDetails = await printful.get(`/store/products/${item.id}`);
      const data = fullDetails.data.result;

      if (!data?.external_id) {
        console.warn(`⚠️ Skipping product ${item.id} (missing external_id)`);
        continue;
      }

      const existing = await Product.findOne({
        where: { product_unique_id: data.external_id },
      });

      if (existing) continue; // skip duplicates

      const sizes = formatSizes(data.variants);
      const category = guessCategory(data.name);

      const newProduct = await Product.create({
        product_unique_id: data.external_id,
        product_id: String(data.id),
        title: data.name,
        price: parseFloat(data.variants[0]?.retail_price || 2999),
        description: "Imported via Printful API",
        brand: "Printful",
        images: [data.thumbnail_url],
        category,
        season: "all",
        sizes,
      });

      syncedProducts.push(newProduct);
    }

    res.status(200).json({
      message: `✅ Synced ${syncedProducts.length} detailed Printful products`,
      synced: syncedProducts,
    });
  } catch (err) {
    console.error("❌ Error syncing detailed Printful data:", err.message);
    res
      .status(500)
      .json({ error: "Failed to sync detailed Printful products" });
  }
});

module.exports = router;
