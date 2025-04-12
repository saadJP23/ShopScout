import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./productList.css";
import { FaShoppingCart } from "react-icons/fa";
import { GlobalState } from "../../../../GlobalState";
import axios from "axios";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const ProductLists = ({ products, spaced }) => {
  const state = useContext(GlobalState);
  const addCart = state.userAPI.addCart;
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  const BASE_URL = "https://shopscout-production-7795.up.railway.app";

  const handleBuyNow = async (product) => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const res = await axios.post(`${BASE_URL}/api/checkout-single`, {
        product: {
          title: product.title,
          price: product.price,
          email: userEmail,
        },
      });

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment error:", err.message);
    }
  };

  const handleCartClick = (product) => {
    setSelectedProduct(product);
    setShowSizeModal(true);
  };

  const confirmAddToCart = () => {
    if (!selectedSize) return alert("Please select a size.");
    addCart({
      ...selectedProduct,
      productId: selectedProduct._id || selectedProduct.id,
      size: selectedSize,
    });

    setShowSizeModal(false);
    setSelectedProduct(null);
    setSelectedSize("");
  };

  console.log(products);
  // console.log('spaced: ', spaced)

  return (
    <>
      <div className={`product-cart ${spaced ? "with-spacing" : ""}`}>
        <div className="product_card_alt">
          <Link
            to={`/detail/${products.product_unique_id}`}
            className="product_img_wrapper_alt"
          >
            <div className="thumbnail-scroll">
              {Array.isArray(products.images) && products.images.length > 0 ? (
                <img
                  src={products.images[0].url || products.images[0]}
                  alt={products.title}
                  className="product_img_alt"
                />
              ) : (
                <img
                  src="/placeholder.png"
                  alt="no-img"
                  className="product_img_alt"
                />
              )}
            </div>
          </Link>

          <div className="product_content">
            <p className="brand_title_alt">{products.title}</p>
            {/* <h3 className="product_brand">{products.brand}</h3> */}
            <div className="product_info_row">
              <span className="product_price_alt">¥{products.price}</span>
            </div>
          </div>

          <div className="button-row">
            <button
              className="buy_now_btn"
              onClick={() => handleBuyNow(products)}
            >
              Buy Now
            </button>
            <button
              className="cart_icon_btn"
              onClick={() => handleCartClick(products)}
            >
              <FaShoppingCart size={16} />
            </button>
          </div>
        </div>

        {showSizeModal && selectedProduct && (
          <div className="size-modal">
            <div className="modal-content">
              <h4>Select Size for "{selectedProduct.title}"</h4>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">-- Choose Size --</option>
                {selectedProduct.sizes?.map((s, index) => {
                  const soldArray = Array.isArray(selectedProduct.sold)
                    ? selectedProduct.sold
                    : JSON.parse(selectedProduct.sold || "[]");

                  const soldCount =
                    soldArray.find((soldItem) => soldItem.size === s.size)
                      ?.units || 0;

                  const remaining = parseInt(s.units) - soldCount;
                  const isDisabled = remaining <= 0;

                  return (
                    <option key={index} value={s.size} disabled={isDisabled}>
                      {s.size} ({remaining} left)
                    </option>
                  );
                })}
              </select>
              <div style={{ marginTop: "1rem" }}>
                <button
                  onClick={confirmAddToCart}
                  style={{ marginRight: "1rem" }}
                >
                  Add to Cart
                </button>
                <button onClick={() => setShowSizeModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductLists;
