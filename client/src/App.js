import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Contact from "./components/Contact/Contact";
import Cart from "./components/Cart/Cart";
import Footer from "./components/Footer/Footer";
import AllProducts from "./components/All Product/AllProducts";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { DataProvider } from "./GlobalState";
import DetailProduct from "./components/DetailProduct/DetailProduct";
import CreateProduct from "./components/CreateProduct/CreateProduct";
import CategoryPage from "./components/Category/CategoryPage";
import History from "./components/History/History";
import AboutUs from "./components/About/AboutUs";
import PrivacyPolicy from "./components/Privacy/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndCondition/TermsConditions";
import TrackOrder from "./components/Track/TrackOrder";
import Help from "./components/Help/Help";
import './App.css'
import CheckOut from './components/CheckOut/CheckOut';
import Success from './components/Success/Success';
import ResetPassword from './components/ResetPassword/ResetPassword'
import ForgetPassword from './components/ForgetPassword/ForgetPassword'
import ManageProduct from './components/ManageProduct/ManageProduct'
import Edit from './components/Edit/Edit'


const App = () => {
  return (
    <DataProvider>
      <Router>
        <div className="page-wrapper">
          <Navbar />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/view_all" element={<AllProducts />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/detail/:id" element={<DetailProduct />} />
              <Route path="/admin/create" element={<CreateProduct />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/history" element={<History />} />
              <Route path="/about_us" element={<AboutUs />} />
              <Route path="/priacy_policy" element={<PrivacyPolicy />} />
              <Route
                path="/terms_and_conditions"
                element={<TermsAndConditions />}
              />
              <Route path="/track_order" element={<TrackOrder />} />
              <Route path="/help" element={<Help />} />
              <Route path="/checkout/:id" element={<CheckOut />}/>
              <Route path="/success" element={<Success />}/>
              <Route path="/forget_password" element={<ForgetPassword/>}/>
              <Route path="/reset_password/:token" element={<ResetPassword/>}/>
              <Route path="/admin/products" element={<ManageProduct />} />
              <Route path="/admin/edit/:id" element={<Edit />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
};

export default App;
