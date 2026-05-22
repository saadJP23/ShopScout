import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./AllProducts.css";
import ProductLists from "../mainpages/utils/ProductList/ProductLists";
import { GlobalState } from "../../GlobalState";
import LoadingSpinner from "../LoadingSpinner";
import { FiSearch, FiX, FiFilter } from "react-icons/fi";

const CATEGORIES = ["All", "male", "female", "child"];

const AllProducts = () => {
  const state    = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const loading  = state.productsAPI.loading;
  const location = useLocation();

  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy]     = useState("default");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search");
    if (q) setSearch(q);
  }, [location.search]);

  const filtered = products
    .filter(p => {
      const matchCat  = category === "All" || p.category === category;
      const matchName = p.title?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchName;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc")  return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name-asc")   return a.title?.localeCompare(b.title);
      return 0;
    });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="allp">

      {/* ── Page Header ── */}
      <div className="allp__header">
        <h1 className="allp__title">All Products</h1>
        <p className="allp__sub">{filtered.length} items found</p>
      </div>

      {/* ── Controls ── */}
      <div className="allp__controls">
        {/* Search */}
        <div className="allp__search-wrap">
          <FiSearch size={16} className="allp__search-icon" />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="allp__search"
          />
          {search && (
            <button className="allp__clear" onClick={() => setSearch("")}><FiX size={15} /></button>
          )}
        </div>

        {/* Category pills */}
        <div className="allp__cats">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`allp__cat ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c === "male" ? "Men" : c === "female" ? "Women" : c === "child" ? "Kids" : "All"}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="allp__sort-wrap">
          <FiFilter size={14} className="allp__sort-icon" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="allp__sort"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name-asc">Name: A → Z</option>
          </select>
        </div>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="allp__empty">
          <p>No products match your search.</p>
          <button onClick={() => { setSearch(""); setCategory("All"); }}>Clear filters</button>
        </div>
      ) : (
        <div className="allp__grid">
          {filtered.map(p => (
            <ProductLists key={p.id} products={p} spaced={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
