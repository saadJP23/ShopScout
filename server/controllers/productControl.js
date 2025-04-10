// ✅ Sequelize version of productControl.js
const Product = require("../sequelize-models/Product");

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json({ status: "success", result: products.length, products });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  createProducts: async (req, res) => {
    console.log("REQ BODY: ", req.body);

    try {
      const {
        product_uinque_id_generator,
        product_id,
        title,
        price,
        description,
        images,
        category,
        season,
        brand,
        sizes,
      } = req.body;
      if (!images) return res.status(400).json({ msg: "No Image Upload" });

      const existing = await Product.findOne({ where: { product_unique_id: req.body.product_unique_id } });
      if (existing)
        return res.status(400).json({ msg: "This product already exists" });

      await Product.create({
        product_unique_id: req.body.product_unique_id,
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        images,
        category,
        season,
        brand,
        sizes,
      });
      res.json({ msg: "Create a product" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      await Product.destroy({ where: { id: req.params.id } });
      res.json({ msg: "Deleted a Product" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const {
        title,
        price,
        description,
        images,
        category,
        season,
        brand,
        sizes,
      } = req.body;
      if (!images) return res.status(400).json({ msg: "No Image Upload" });

      await Product.update(
        {
          title: title.toLowerCase(),
          price,
          description,
          images,
          category,
          season,
          brand,
          sizes,
        },
        { where: { id: req.params.id } }
      );

      res.json({ msg: "Updated a Product" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productCtrl;
