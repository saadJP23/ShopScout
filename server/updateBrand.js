// updateBrand.js
const Products = require('./models/productsModels'); // ✅ make sure this path is correct
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/products');


(async () => {
  try {
    await Products.updateMany(
      { brand: { $exists: false } },
      { $set: { brand: 'J.' } }
    );
    console.log("✅ Default brand set for products without brand.");
  } catch (err) {
    console.error("❌ Error updating products:", err);
  } finally {
    mongoose.disconnect();
  }
})();
