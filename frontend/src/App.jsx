import React from "react";
import "./App.css";

import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/auth/Login";

// Layout Component
const Layout = () => {
  return (
    <>
      <Header />
      <div className="container">
        <Outlet /> {/* This renders the matched route's component */}
      </div>
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/product/:id", element: <ProductDetails /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);

const App = () => {
  return (
    <RouterProvider router={router}>
      <div className="App">
        <Toaster position="top-center" />
      </div>
    </RouterProvider>
  );
};

export default App;
