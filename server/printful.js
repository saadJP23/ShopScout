const axios = require("axios");

const PRINTFUL_PRIVATE_TOKEN = process.env.PRINTFUL_PRIVATE_TOKEN;

const printful = axios.create({
  baseURL: "https://api.printful.com",
  headers: {
    Authorization: `Bearer ${PRINTFUL_PRIVATE_TOKEN}`,
    "Content-Type": "application/json",
  },
});

module.exports = printful;
