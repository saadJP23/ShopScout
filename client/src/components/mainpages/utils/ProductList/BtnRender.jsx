import React, { useContext, useState } from "react";
import { GlobalState } from "../../../../GlobalState";
import { Link } from "react-router-dom";
import "../ProductList/BtnRender.css";

const BtnRender = ({ product }) => {
  const state = useContext(GlobalState);
  const [isAdmin] = state.userAPI.isAdmin;
  const addCart = state.userAPI.addCart;

  return (
    <div className="row_btn">
      {isAdmin ? (
        <>
          <Link id="btn_buy" to={"#!"}>
            Delete
          </Link>
          <Link id="btn_view" to={`detail/${product._id}`}>
            Edit
          </Link>
        </>
      ) : (
        <>
          <Link
            id="btn_buy"
            to=""
            onClick={(e) => {
              e.preventDefault();
              addCart(product);
            }}
          >
            Buy
          </Link>
          <Link
            id="btn_add_cart"
            to=""
            onClick={(e) => {
              e.preventDefault();
              addCart(product);
            }}
          >
            Add To Cart
          </Link>
        </>
      )}
    </div>
  );
};

export default BtnRender;
