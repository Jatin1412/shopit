import React from "react";
import "./App.css";

import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <>
          <Header />
          <div className="container">
            <Home />
          </div>
          <Footer />
        </>
      ),
    },
    {
      path: "/product/:id",
      element: (
        <>
          <Header />
          <div className="container">
            <ProductDetails />
          </div>
          <Footer />
        </>
      ),
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

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
