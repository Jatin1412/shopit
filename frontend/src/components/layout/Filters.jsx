import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceQueryParams } from "../../helpers/helpers";
import { PRODUCT_CATEGORIES } from "../../constants/constants";
import StarRatings from "react-star-ratings";

const Filters = () => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  useEffect(() => {
    searchParams.has("min") && setMin(searchParams.get("min"));
    searchParams.has("max") && setMax(searchParams.get("max"));
  }, []);

  // Handle category and rating filter
  const handleClick = (checkBox) => {
    const checkBoxes = document.getElementsByName(checkBox.name);

    checkBoxes.forEach((item) => {
      if (item !== checkBox) item.checked = false;

      if (checkBox.checked === false) {
        if (searchParams.has(checkBox.name)) {
          searchParams.delete(checkBox.name);
          // Construct the new URL with the updated query parameters
          const path = window.location.pathname + "?" + searchParams.toString();

          // Navigate to the new URL with updated query parameters
          navigate(path);
        }
      } else {
        // set new filter value if already there
        if (searchParams.has(checkBox.name)) {
          searchParams.set(checkBox.name, checkBox.value);
        } else {
          // Append new filter
          searchParams.append(checkBox.name, checkBox.value);
        }
      }
    });
  };

  const defaultCheckHandler = (checkBoxType, checkBoxValue) => {
    const value = searchParams.get(checkBoxType);

    if (checkBoxValue === value) return true;
    return false;
  };

  // Handle price filter
  const handleButtonClick = (e) => {
    e.preventDefault();

    // Clone searchParams into a new URLSearchParams object to update it
    const newSearchParams = new URLSearchParams(searchParams);

    // Update the price range parameters
    getPriceQueryParams(newSearchParams, "min", min);
    getPriceQueryParams(newSearchParams, "max", max);

    // You can also add other filters (category, ratings) here

    // Construct the new URL with the updated query parameters
    const path = window.location.pathname + "?" + newSearchParams.toString();

    // Navigate to the new URL with updated query parameters
    navigate(path);
  };

  return (
    <div className="border p-3 filter">
      <h3>Filters</h3>
      <hr />
      <h5 className="filter-heading mb-3">Price</h5>
      <form id="filter_form" className="px-2" onSubmit={handleButtonClick}>
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Min"
              name="min"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Max"
              name="max"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">
              GO
            </button>
          </div>
        </div>
      </form>
      <hr />
      <h5 className="mb-3">Category</h5>

      {PRODUCT_CATEGORIES.map((category) => (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="category"
            id="check4"
            defaultChecked={defaultCheckHandler("category", category)}
            value={category}
            onClick={(e) => handleClick(e.target)}
          />
          <label className="form-check-label" htmlFor="check4">
            {" "}
            {category}
          </label>
        </div>
      ))}

      <hr />
      <h5 className="mb-3">Ratings</h5>
      {[5, 4, 3, 2, 1].map((rating) => (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="ratings"
            id="check7"
            value={rating}
            defaultChecked={defaultCheckHandler("ratings", rating?.toString())}
            onClick={(e) => handleClick(e.target)}
          />
          <label className="form-check-label" htmlFor="check7">
            <StarRatings
              rating={rating}
              starRatedColor="#ffb289"
              numberOfStars={5}
              name="rating"
              starDimension="21px"
              starSpacing="1px"
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default Filters;
