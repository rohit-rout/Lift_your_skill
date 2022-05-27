
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    CLEAR_ERRORS
} from "../constants/productConstants"

export const productsReducer=(state={products:[]},action)=>{
  switch (action.type) {
      case ALL_PRODUCT_REQUEST:
        return {
            loading: true,
            products: [],
          };      
      case ALL_PRODUCT_SUCCESS:
          return {
               loading:false,
               products:action.payload.products,
               resultPerPage:action.payload.resultPerPage,
               filterProductsCount:action.payload.filterProductsCount
            
          }

          case ALL_PRODUCT_FAIL:
          return {
            loading:false,
            products:[],
            error:action.payload,

          }
          case CLEAR_ERRORS:
              return {
                ...state,
                error:null
           
                  
              }
      default:
          return state
  }
}


export const productDetails=(state={productDetail:{}},action)=>{
  switch(action.type){
    case PRODUCT_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case PRODUCT_DETAILS_SUCCESS:
      return{
         loading:false,
        productDetail:action.payload,

      }
      case PRODUCT_DETAILS_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
  
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
  }
}