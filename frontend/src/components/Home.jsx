import React, { useEffect } from "react";
import MetaData from "./layout/MetaData";
import { useGetProductsQuery } from "../redux/Api/productsApi";
import ProductItem from "./product/ProductItem";
import Loader from "./layout/Loader";
import toast from "react-hot-toast";
import CustomPagination from "./layout/CustomPagination";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const params = { page };
  const { data, isLoading, error, isError } = useGetProductsQuery(params);
  console.log(data);
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError, error]);

  if (isLoading) return <Loader />;
  return (
    <>
      <MetaData title={"Buy Best Products Online"} />
      <div className="row">
        <div className="col-12 col-sm-6 col-md-12">
          <h1 id="products_heading" className="text-secondary">
            Latest Products
          </h1>
          <section id="products" className="mt-5">
            <div className="row">
              {data?.products.map((product) => (
                <ProductItem product={product} key={product._id} />
              ))}
            </div>
          </section>
          <CustomPagination
            resPerPage={data?.resPerPage}
            filteredProductsCount={data?.filteredProductsCount}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
