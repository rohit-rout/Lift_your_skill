import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension"
import { productsReducer, productDetails } from "./reducers/productReducer"
import { userReducer, profileReducer} from "./reducers/userReducer"
import thunk from "redux-thunk"
import { cartReducer } from "./reducers/cartReducer";
import { myOrdersReducer, newOrderReducer } from "./reducers/orderReducer";

const reducers = combineReducers({
    allProducts: productsReducer,
    productInfo: productDetails,
    userInfo: userReducer,
    profile: profileReducer,
    cart: cartReducer,
    newOrder:newOrderReducer,
    myOrders:myOrdersReducer,
})
const initialState = {
    cart: {
        cartItems: localStorage.getItem("cartItems")
            ? JSON.parse(localStorage.getItem("cartItems")) : [],

    shippingInfo: localStorage.getItem("shippingInfo")
            ? JSON.parse(localStorage.getItem("shippingInfo"))
            : {},
    }


}

export const store = createStore(reducers, initialState, composeWithDevTools(applyMiddleware(thunk)));
