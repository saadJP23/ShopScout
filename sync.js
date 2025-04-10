const sequelize = require('./server/config/database');
const Product = require('./server/sequelize-models/Product');

(async () => {
  try {
    await sequelize.sync({ alter: true }); // or { force: true } for full rebuild
    console.log("✅ All models were synchronized successfully.");
  } catch (err) {
    console.error("❌ Sync failed:", err.message);
    console.error(err); // 👈 Add this to see full validation stack trace
  }
})();
