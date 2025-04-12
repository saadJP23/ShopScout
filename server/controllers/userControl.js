const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../sequelize-models/User");
const CartItem = require("../sequelize-models/CartItem");
const Category = require("../sequelize-models/Category");
const Product = require("../sequelize-models/Product");
const nodemailer = require("nodemailer");

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const userControl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser)
        return res.status(400).json({ msg: "Email Already Registered" });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters" });

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: passwordHash,
      });

      const accessToken = createAccessToken({ id: newUser.id });
      const refreshToken = createRefreshToken({ id: newUser.id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "None",
        secure: true,
      });

      res.json({ accessToken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect Password" });

      const accessToken = createAccessToken({ id: user.id });
      const refreshToken = createRefreshToken({ id: user.id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "None",
        secure: true,
      });

      res.json({ accessToken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  refreshtoken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;

      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register" });
        const accessToken = createAccessToken({ id: user.id });
        res.json({ accessToken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Log Out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);

      if (!user) return res.status(400).json({ msg: "User Not Found" });

      const cart = user.cart || [];
      const rawHistory = user.history || [];
      const simplifiedHistory = rawHistory.map((item) => ({
        product_id: item._id,
        size: item.size,
        brand: item.product?.brand,
        price: item.product?.price,
        quantity: item.quantity,
      }));

      res.json({
        user_id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        cart, // ✅ return cart JSON
        history: simplifiedHistory,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const cart = req.body.cart;

      if (!Array.isArray(cart)) {
        return res.status(400).json({ msg: "Invalid cart format" });
      }

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ msg: "User not found" });

      await user.update({ cart }); // ✅ just update the JSON column

      res.json({ msg: "Cart updated" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addHistory: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(400).json({ msg: "User not found" });

      // You can implement a proper Order model if needed
      const history = req.body.history;
      if (!Array.isArray(history)) {
        return res.status(400).json({ msg: "Invalid history format" });
      }

      // Store JSON data in the user model (optional: build proper Order model)
      await user.update({ history: JSON.stringify(history) });

      res.json({ msg: "Purchase history saved." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getHistory: async (req, res) => {
    console.log(req.user);
    try {
      const user = await User.findByPk(req.user.id);

      if (!user) return res.status(400).json({ msg: "User not found" });

      // No need to parse if it's already JSON
      const history = Array.isArray(user.history) ? user.history : [];

      res.json({ history });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ msg: "Email not registered." });

      const token = jwt.sign({ id: user.id }, process.env.RESET_TOKEN_SECRET, {
        expiresIn: "15m",
      });

      console.log("token: ", token);

      const resetLink = `https://main.d1b1b2mnj76860.amplifyapp.com/reset_password/${token}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset your password - Shop Scout",
        html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
      });

      res.json({ msg: "Reset link has been sent to your email." });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    const { token, newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) return res.status(400).json({ msg: "Invalid token." });

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await user.update({ password: passwordHash });

      res.json({ msg: "Password successfully updated!" });
    } catch (err) {
      res.status(500).json({ msg: "Invalid or expired token." });
    }
  },
};

module.exports = userControl;
