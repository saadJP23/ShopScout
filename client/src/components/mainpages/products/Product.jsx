import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import ProductLists from "../utils/ProductList/ProductLists";

const Product = () => {
  
  
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin

  console.log(state)
  return (
    <div className="products">
      {products.map((prod) => {
        return <ProductLists key={prod._id} product={prod} isAdmin={isAdmin}/>;
      })}
    </div>
  );
};

export default Product;
