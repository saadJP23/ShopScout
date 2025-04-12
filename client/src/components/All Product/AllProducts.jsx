import React, { useEffect, useContext } from "react";
import "./AllProducts.css";
import ProductLists from "../mainpages/utils/ProductList/ProductLists";
import { GlobalState } from "../../GlobalState";
import LoadingSpinner from "../LoadingSpinner";

const AllProducts = () => {
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const loading = state.productsAPI.loading;

  useEffect(() => {
    console.log("New Item Added.");
  }, [products]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="all_products_wrapper">
      <h2 className="all_products_heading">All Products</h2>
      <div className="products_container_all">
        {products.map((product) => (
          <ProductLists key={product.id} products={product} spaced={false} />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
