import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';



const Checkout = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const BASE_URL = 'https://shopscout-production-7795.up.railway.app';

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`${BASE_URL}/api/products`);
      const found = res.data.products.find((item) => item._id === id);
      setProduct(found);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Checkout</h2>
      <img src={product.images.url} alt={product.title} width="200" />
      <h3>{product.title}</h3>
      <p>Price: ¥{product.price}</p>
      <button
        onClick={() => alert("Payment gateway coming soon!")}
        style={{ padding: '10px 20px', backgroundColor: '#088178', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Proceed to Pay
      </button>
    </div>
  );
};

export default Checkout;
