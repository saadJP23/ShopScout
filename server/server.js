require("dotenv").config();

const express = require("express");
const sequelize = require("./config/database");
const Product = require("./sequelize-models/Product");
const User = require("./sequelize-models/User");
const Category = require("./sequelize-models/Category");
const CartItem = require("./sequelize-models/CartItem");
const Order = require("./sequelize-models/Order");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const nodemailer = require("nodemailer");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cloudinary = require("cloudinary").v2;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const bodyParser = require("body-parser");
let tempCartByEmail = {};

const app = express();
const PORT = process.env.PORT || 5000;

const generateOrderNumber = () =>
  "ORD-" +
  Date.now().toString().slice(-6) +
  "-" +
  Math.floor(100 + Math.random() * 900);

// Middleware
app.use(
  cors({
    origin: ["https://www.shopscout.org"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // ✅ include PATCH
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);


app.options("*", cors());


app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_email;
      const billing = session.customer_details?.address;
      const shipping = session.shipping_details;
      const paymentIntentId = session.payment_intent;

      console.log("📧 Sending order confirmation to:", email);

      if (email) {
        try {
          const user = await User.findOne({ where: { email } });
          const cart = tempCartByEmail[email];

          if (user && Array.isArray(cart)) {
            const dateOnly = new Date().toLocaleDateString();
            const timestampedCart = cart.map((item) => ({
              ...item,
              date: dateOnly,
            }));

            const newHistory = [...(user.history || []), ...timestampedCart];

            for (const item of cart) {
              const product = await Product.findOne({
                where: { product_id: item.productId },
              });

              if (product) {
                let currentSold = [];

                try {
                  currentSold = Array.isArray(product.sold)
                    ? product.sold
                    : JSON.parse(product.sold || "[]");
                } catch (err) {
                  console.warn("🔁 Failed to parse 'sold' JSON:", err.message);
                }

                const updatedSold = [...currentSold];
                const index = updatedSold.findIndex(
                  (s) => s.size === item.size
                );

                if (index !== -1) {
                  updatedSold[index].units += item.quantity;
                } else {
                  updatedSold.push({ size: item.size, units: item.quantity });
                }

                await product.update({ sold: JSON.stringify(updatedSold) });
              }
            }

            await user.update({ history: newHistory, cart: [] });

            const simplifiedCart = cart.map((item) => ({
              productId: item.productId,
              userId: user.id,
              brand: item.product?.brand || "",
              quantity: item.quantity,
              size: item.size,
            }));

            await Order.create({
              orderNumber: generateOrderNumber(),
              email,
              name: shipping?.name || billing?.name || "",
              shippingAddress: shipping?.address || {},
              billingAddress: billing || {},
              items: simplifiedCart,
              totalAmount: session.amount_total,
              paymentIntentId,
              userId: user.id,
              status: "paid",
              deliveryStatus: "processing",
            });

            // ✅ Email setup
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
              },
              logger: true,
              debug: true,
            });

            // ✅ Compose email content
            const emailHTML = cart
              .map((item) => {
                const image =
                  item.product?.image || "https://via.placeholder.com/150";
                return `
                  <div style="margin-bottom: 20px; border-bottom:1px solid #ddd; padding-bottom:10px;">
                    <h3>${item.product?.title}</h3>
                    <p><strong>Size:</strong> ${item.size} | <strong>Quantity:</strong> ${item.quantity}</p>
                    <p><strong>Price:</strong> ¥${item.product?.price}</p>
                    <img src="${image}" alt="${item.product?.title}" width="160" style="border-radius:8px; margin-top:10px;" />
                  </div>
                `;
              })
              .join("");

            console.log("📤 Preparing to send confirmation email...");

            await transporter.sendMail({
              from: `"Shop Scout" <${process.env.EMAIL_USER}>`,
              to: email,
              bcc: process.env.EMAIL_USER, // optional: sends copy to admin
              subject: "🧾 Your Order Confirmation",
              html: `
                <h2>Thank you for shopping with us!</h2>
                <p>Your order has been received and is now being processed.</p>
                <hr />
                ${emailHTML}
                <hr />
                <p><strong>Order Total:</strong> ¥${session.amount_total.toLocaleString()}</p>
              `,
            });

            console.log("✅ Order saved and confirmation email sent.");
          }
        } catch (err) {
          console.error("❌ Failed to process checkout:", err.message);
        }
      }
    }

    res.status(200).json({ received: true });
  }
);

app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Sequelize Associations
User.hasMany(CartItem, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(CartItem, { foreignKey: "productId" });
Order.belongsTo(Product, { foreignKey: "productId" });

// Routes
app.get("/", (req, res) => res.json({ msg: "This is Example" }));
app.use("/user", require("./routes/userRouter"));
app.use("/api", require("./routes/categoryRouter"));
app.use("/api", require("./routes/productRouter"));
app.use("/api/upload", require("./routes/upload"));

// Contact
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Shop Scout" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // ✅ send to admin (you)
      cc: email,
      replyTo: email, // ✅ allows reply to sender
      subject: `Contact Us from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    res.status(200).json({ msg: "Email sent successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to send email", error: err.message });
  }
});

// Stripe Checkout: Single Product
app.post("/api/checkout-single", async (req, res) => {
  const { product } = req.body;

  try {
    if (!product.email) {
      return res.status(400).json({ error: "Email is required for checkout." });
    }

    const line_items = [
      {
        price_data: {
          currency: "jpy",
          product_data: {
            name: product.title,
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ];

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: product.email,
      line_items,
      // discounts: [
      //   {
      //     coupon: "100_OFF", // Replace with your actual 100% off coupon ID from Stripe
      //   },
      // ],
      success_url: `https://www.shopscout.org/success`,
      cancel_url: 'https://www.shopscout.org/cancel',

      allow_promotion_codes: true,

      payment_intent_data: {
        metadata: {
          customer_email: product.email,
        },
      },
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["JP"],
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout Error:", err.message);
    res.status(500).json({ error: "Checkout failed" });
  }
});

// Stripe Checkout: Cart
app.post("/api/checkout-cart", async (req, res) => {
  const { cart, email } = req.body;

  try {
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "jpy",
        product_data: { name: item.product?.title },
        unit_amount: item.product?.price,
      },
      quantity: item.quantity,
    }));

    tempCartByEmail[email] = cart;
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items,
      // discounts: [
      //   {
      //     coupon: "100_OFF", // Replace with your actual 100% off coupon ID from Stripe
      //   },
      // ],
      
      success_url: `https://www.shopscout.org//success`,
      cancel_url: 'https://www.shopscout.org/',
      allow_promotion_codes: true,

      payment_intent_data: {
        metadata: {
          customer_email: email,
        },
      },
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["JP"],
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Cart Checkout Error:", err.message);
    res.status(500).json({ error: "Checkout failed (cart)" });
  }
});

// Start Server and Connect to MySQL
sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ MySQL Connected Successfully");

    // Disable foreign key checks before sync
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    // Alter tables to match the updated models
    sequelize.sync(); // ✅ Just sync without altering


    // Re-enable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("✅ Tables updated");
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MySQL Connection Error:", err.message);
  });
