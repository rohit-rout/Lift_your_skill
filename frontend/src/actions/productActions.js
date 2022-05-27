import axios from "axios";

import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    CLEAR_ERRORS
} from "../constants/productConstants"

// get all products
export const getProducts=(keyword="",price=[0,100000],category="",ratings=0,page=1)=>async(dispatch)=>{
    try{
   dispatch({type:ALL_PRODUCT_REQUEST});
   let link=`/api/v1/products?keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&page=${page}`;
   if(category!=="")
   {link=`/api/v1/products?keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&catagory=${category}&ratings[gte]=${ratings}&page=${page}`}

   const {data}=await axios.get(link); 
   
    dispatch({
        type:ALL_PRODUCT_SUCCESS,
        payload:data
    })
    }catch(err){
        console.log(err);
        dispatch({
            type:ALL_PRODUCT_FAIL,
            payload:err.response.data.message,
        })
    }
}
//   getting product details
export const getProductDetails=(product_id)=>async(dispatch)=>{
    try{
        dispatch({type:PRODUCT_DETAILS_REQUEST});
        const link=`/api/v1/singleProduct/${product_id}`;
        const {data}=await axios.get(link);
      
        dispatch({
            type:PRODUCT_DETAILS_SUCCESS,
            payload:data.product
        })
    }catch(error){
        dispatch({
            type:PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message,
        });
    }
}

// Clearing Errors
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
  };
