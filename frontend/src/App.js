
import './App.css';
import { useEffect } from "react"
import Header from "./components/layout/Header/Header"
import Footer from "./components/layout/Footer/Footer.js";
import Home from "./components/Home/Home.js"
import products from "./components/Product/Products.js"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Search from './components/Product/Search';
import ProductDetails from './components/Product/ProductDetails.js'
import LoginSignUp from './components/User/LoginSignUp';
import { loadUser, clearErrors } from './actions/userActions';
import { useDispatch, useSelector } from "react-redux"
import UserOption from './components/layout/Header/UserOption';
import ProtectedRoute from './components/Route/ProtectedRoute';
import Profile from './components/User/Profile';
import UpdateProfile from "./components/User/UpdateProfile";
import ChangePassword from "./components/User/ChangePassword.js";
import Cart from './components/Cart/Cart';
import Shipping from './components/Cart/shipping';
import ConfirmOrder from './components/Cart/ConfirmOrder';
import Payment from "./components/Cart/Payment";
import OrderSucess from "./components/Cart/orderSuccess";
import MyOrders from "./components/order/MyOrder";
function App() {
  
  const { user, isAuthenticated,error } = useSelector(state => state.userInfo);
  console.log("this app component is rendering ",isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch])

  useEffect(() => {
    if (error)
      dispatch(clearErrors());
  }, [dispatch,error])


  return (
    <>


      <Router>
        {isAuthenticated && <UserOption user={user} />}
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/products' component={products} />
          <Route exact path='/search' component={Search} />
          <Route path='/products/:keyword' component={products} />
          <ProtectedRoute path='/product/:id' component={ProductDetails} />
          <Route exact path='/loginSignUp' component={LoginSignUp} />
          <ProtectedRoute exact path="/account" component={Profile} />
          <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
          <ProtectedRoute exact path="/password/update" component={ChangePassword} />
          <ProtectedRoute exact path="/cart" component ={Cart}/>
          <ProtectedRoute exact path="/shipping" component={Shipping}/>
          <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder}/>
          <ProtectedRoute exact path="/process/payment" component={Payment}/>
          <ProtectedRoute exact path="/success" component={OrderSucess} />
          <ProtectedRoute exact path="/orders" component={MyOrders} />
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
