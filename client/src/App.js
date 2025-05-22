import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Offers from "./pages/Offers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OfferDetail from "./pages/OfferDetail";
import Header from "./components/Header";
import Orders from "./pages/Orders";
import Review from "./pages/Review";
import CreateOffer from "./pages/CreateOffer";
import MyOffers from "./pages/MyOffers";
import UpdateOffer from "./pages/UpdateOffer";

function App() {
  return (
    <Router>
        <Header />
      <Routes>
        <Route path="/" element={<Offers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/offers/:id" element={<OfferDetail />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/review/:id" element={<Review />} />
        <Route path="/createOffer" element={<CreateOffer />} />
        <Route path="/myOffers" element={<MyOffers />} />
        <Route path="/updateOffer/:id" element={<UpdateOffer />} />
      </Routes>
    </Router>
  );
}

export default App;
