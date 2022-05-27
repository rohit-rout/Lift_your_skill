import React, { useEffect } from 'react'
import "./home.css"
import ProductCard from "../Product/ProductCard.js"
import { useSelector,useDispatch } from 'react-redux'
import {getProducts,clearErrors} from "../../actions/productActions"
import { useAlert } from "react-alert";

const Home = () => {
  const dispatch=useDispatch();
  const alert=useAlert();
  const {products,error} =useSelector(state=>state.allProducts);
  
  useEffect(() => {
    
      dispatch(getProducts())
  }, [dispatch])
  useEffect(() => {
    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [error,alert,dispatch])
  
  
  return (
    <>
           <div className="banner">
            <p>Welcome to <strong><i>LIFT YOUR SKILL</i></strong></p>
            <h1>FIND YOUR BEST COURSES </h1>

            <a href="#container">
              <button>
                Scroll 
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured COURSES</h2>

          <div className='container' id="container">
            {products&&products.map((product,index)=>{
              return <ProductCard key={index} product={product}/>
            })}

       
          </div>

    </>
  )
}

export default Home