import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ProductAPI = () => {
  const [products, setProducts] = useState([])
  const [callback, setCallback] = useState(false);
  const BASE_URL = 'https://shopscout-production-7795.up.railway.app';


const getProducts = async() => {
  try {
    const res = await axios.get(`${BASE_URL}/api/products`);
    console.log('✅ Products response:', res.data);
    setProducts(res.data.products); // Or adapt if your key is different
  } catch (err) {
    console.error('❌ Fetch error:', err);
  }
}

useEffect(() => {
  getProducts()
},[callback])

  return {
    products: [products, setProducts],
    callback: [callback, setCallback]
  }
}

export default ProductAPI