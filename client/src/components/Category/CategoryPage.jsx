import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import ProductLists from "../mainpages/utils/ProductList/ProductLists";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { category } = useParams(); // Gets URL param like 'male'
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;

  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  return (
    <div className="category-page">
      <h2 className="category-heading">
        {category.charAt(0).toUpperCase() + category.slice(1)} Collection
      </h2>

      <div className="products_container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductLists key={product._id} products={product} />
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
