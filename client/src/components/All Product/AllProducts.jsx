import React, { useEffect, useState, useContext } from "react";
import list from "../List";
import "./AllProducts.css";
import ProductLists from "../mainpages/utils/ProductList/ProductLists";
import { GlobalState } from "../../GlobalState";

const AllProducts = () => {
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;

  useEffect(() => {
    console.log("New Item Added.");
  }, [products]);
  return (
    <>
      <div className="all_products_wrapper">
        <h2 className="all_products_heading">All Products</h2>
        <div className="products_container_all">
          {products.map((product) => (
            <ProductLists key={product.id} products={product} spaced={false} />
          ))}
        </div>
      </div>
    </>
  );
};

export default AllProducts;
