import React, { useState, useEffect, Fragment } from 'react'
import { clearErrors, getProducts } from "../../actions/productActions";
import Loader from "../layout/Loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "./ProductCard"
import "./products.css"
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";

const categories = [
  "Web development",
  "Marketing",
  "Competetive Programming",
  "Machine Learning",
  "Entertainment",
  "Photography",
  "Stock Marketing",
];
const Products = ({ match }) => {
  const alert = useAlert();

  const { products, resultPerPage, loading, filterProductsCount, error } = useSelector((state) => state.allProducts);
  const [price, setPrice] = useState([0, 10000]);
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ratings, setRatings] = useState(0);
  const dispatch = useDispatch();
  const keyword = match.params.keyword;


  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };


  useEffect(() => {

    dispatch(getProducts(keyword, price, category, ratings, currentPage))
  }, [dispatch, price, category, ratings, currentPage, keyword])

  useEffect((error) => {
    if(error){
    alert.error(error)
    dispatch(clearErrors());
    }
  }, [error, alert, dispatch])

  return (
    <>
    {loading ? <Loader /> : ( <Fragment> 
      <MetaData title="COURSES" />
      <h2 className="productsHeading">Your Best COURSES are here!</h2>



      <div className="products">
        {products && products.map((product, index) => {
          return <ProductCard key={index} product={product} />
        })}
      </div>
      <div className="filterBox">
        <Typography>Price</Typography>
        <Slider
          value={price}
          onChange={priceHandler}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          min={0}
          max={2000}
        />


        <Typography>Categories</Typography>
        <ul className="categoryBox">
          {categories.map((category) => (
            <li
              className="category-link"
              key={category}
              onClick={() => setCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>
        <fieldset>
          <Typography component="legend">Ratings Above</Typography>
          <Slider className='rating_slider'
            value={ratings}
            onChange={(e, newRating) => {
              setRatings(newRating);
            }}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            min={0}
            max={5}
          />
        </fieldset>

      </div>

      {resultPerPage < filterProductsCount && (
        <div className="paginationBox">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={filterProductsCount}
            onChange={setCurrentPageNo}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="1st"
            lastPageText="Last"
            itemClass="page-item"
            linkClass="page-link"
            activeClass="pageItemActive"
            activeLinkClass="pageLinkActive"
          />
        </div>
         )}     
     </Fragment>)





    }
    </>
  )
  

}




export default Products