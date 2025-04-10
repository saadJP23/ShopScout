// ✅ Sequelize version of categoryControl.js
const Category = require("../sequelize-models/Category");

const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const existing = await Category.findOne({ where: { name } });
      if (existing) return res.status(400).json({ msg: "Category already exists" });

      await Category.create({ name });
      res.json({ msg: "Category created successfully" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      await Category.destroy({ where: { id: req.params.id } });
      res.json({ msg: "Deleted a Category" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.update({ name }, { where: { id: req.params.id } });
      res.json({ msg: "Updated" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoryCtrl;