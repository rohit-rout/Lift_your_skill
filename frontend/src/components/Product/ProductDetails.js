import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productActions";
import { addItemsToCart } from "../../actions/cartActions";
import "./ProductDetails.css";
// import Carousel from "react-material-ui-carousel";
import { Rating } from "@material-ui/lab";
import MetaData from "../layout/MetaData";
import ReviewCard from "./ReviewCard.js"
import { useAlert } from "react-alert";
import Loader from "../layout/Loader/Loader";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import axios from "axios";

const ProductDetails = ({ match }) => {
  const history=useHistory();
  const product_id = match.params.id;
  const dispatch = useDispatch();
  const alert = useAlert();
  const { productDetail, error, loading } = useSelector(
    (state) => state.productInfo
  );

  // useState defination
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // useEffect
  useEffect(() => {

    dispatch(getProductDetails(product_id));
  }, [dispatch, product_id]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch, alert]);


  // options for rating
  const options = {
    size: "large",
    value: productDetail.ratings ? productDetail.ratings : 0,
    readOnly: true,
    precision: 0.5,
  };

  // all state changing function
  const increaseQuantity = () => {
    if (productDetail.stocks <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };
  const addToCartHandler = () => {
    dispatch(addItemsToCart(match.params.id, quantity));
    alert.success("Course added to cart successfully");


  };
  const reviewSubmitHandler = async () => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      // console.log("every thing is fine here");

     const data= await axios.post("/api/v1/product/review", { productId: product_id, rating, comment }, config);
    //  console.log(data);
    //  if(data.success==false){
    //    dispatch(clearErrors());
    //    history.push('/loginSignUp');
    //   }
     

      dispatch(getProductDetails(product_id));
      submitReviewToggle();
    } catch (error) {
      alert.error(error);
    }
  };



  // rendering the document
  return (
    <>
      {loading ? <Loader /> : (<>
        <MetaData title={`${productDetail.name} `} />
        <div className='ProductDetails'>
          <div>
            {/* <Carousel> */}
            {productDetail.images &&
              productDetail.images.map((item, i) => (
                <img
                  className='CarouselImage'
                  key={i}
                  src={item.url}
                  alt={`${i} Slide`}
                />
              ))}
            {/* </Carousel> */}
          </div>
          <div>
            <div className='detailsBlock-1'>
              <h2>{productDetail.name}</h2>
              <p>Course # {productDetail._id}</p>
            </div>
            <div className='detailsBlock-2'>
              <Rating {...options} />
              <span className='detailsBlock-2-span'>
                {" "}
                ({productDetail.numberOfReviews} Reviews)
              </span>
            </div>
            <div className='detailsBlock-3'>
              <h1>{`₹${productDetail.price}`}</h1>
              <div className='detailsBlock-3-1'>
                {/* <div className='detailsBlock-3-1-1'>
                  <button onClick={decreaseQuantity}>-</button>
                  <input readOnly type='number' value={quantity} />
                  <button onClick={increaseQuantity}>+</button>
                </div> */}
                <button
                  disabled={productDetail.Stock < 1 ? true : false}
                  onClick={addToCartHandler}>
                  Add to Cart
                </button>
              </div>

              <p>
                Status:
                <b
                  className={productDetail.Stock < 1 ? "redColor" : "greenColor"}>
                  {productDetail.Stock < 1 ? "Not Available" : "Available"}
                </b>
              </p>
            </div>
            <div className='detailsBlock-4'>
              Description : <p>{productDetail.description}</p>
            </div>

            <button onClick={submitReviewToggle} className='submitReview'>
              Submit Review
            </button>
          </div>
        </div>

        <h3 className='reviewsHeading'>REVIEWS</h3>

        <Dialog
          aria-labelledby='simple-dialog-title'
          open={open}
          onClose={submitReviewToggle}>

          <DialogTitle>Submit Review</DialogTitle>
          <DialogContent className="submitDialog">
            <Rating onChange={(e) => setRating(e.target.value)} value={rating} size="large" />
            <textarea
              className="submitDialogTextArea"
              cols="30"
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </DialogContent>
          <DialogActions>
            <Button onClick={submitReviewToggle} color="secondary">
              Cancel
            </Button>
            <Button onClick={reviewSubmitHandler} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>


        {productDetail.reviews && productDetail.reviews[0] ? (
          <div className="reviews">
            {productDetail.reviews &&
              productDetail.reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
          </div>
        ) : (
          <p className="noReviews">No Reviews Yet</p>
        )}
      </>)
      }

    </>

  );
}

export default ProductDetails;