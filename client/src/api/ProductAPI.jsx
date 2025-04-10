import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ProductAPI = () => {
  const [products, setProducts] = useState([])
  const [callback, setCallback] = useState(false);
  

const getProducts = async() => {
  const res = await axios.get('http://localhost:5000/api/products');
  setProducts(res.data.products);
  // console.log(res.data.products)
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