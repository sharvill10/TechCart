import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import { Provider } from "react-redux";
import store from "./store";
import CartScreen from "./screens/CartScreen";
import SignInScreen from "./screens/SignInScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import PrivateRoute from "./components/PrivateRoute";
import OrderScreen from "./screens/OrderScreen";
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import OrderListScreen from "./screens/admin/OrderListScreen";
import ProductListScreen from "./screens/admin/ProductListScreen";
import ProductEditScreen from "./screens/admin/ProductEditScreen";
import UserListScreen from "./screens/admin/UserListScreen";
import UserEditScreen from "./screens/admin/UserEditScreen";
import AdminRoute from "./components/AdminRoute";
import MyOrderScreen from "./screens/MyOrderScreen";

// ScrollToTop component that will handle the scroll behavior
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Modify App component to include ScrollToTop
const AppWithScrollToTop = () => {
  return (
    <>
      <ScrollToTop />
      <App />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<AppWithScrollToTop />}>
        <Route index element={<HomeScreen />} />
        <Route path="product/:id" element={<ProductScreen />} />
        <Route path="cart" element={<CartScreen />} />
        <Route path="login" element={<SignInScreen />} />
        <Route path="register" element={<RegisterScreen />} />

        <Route path='' element={<PrivateRoute />}>
          <Route path='/shipping' element={<ShippingScreen />} />
          <Route path='/payment' element={<PaymentScreen />} />
          <Route path='/placeorder' element={<PlaceOrderScreen />} />
          <Route path='/order/:id' element={<OrderScreen />} />
          <Route path='/profile' element={<ProfileScreen />} />
          <Route path='/myorders' element={<MyOrderScreen />} />
        </Route>

        <Route path='' element={<AdminRoute />}>
          <Route path='/admin/orderlist' element={<OrderListScreen />} />
          <Route path='/admin/productlist' element={<ProductListScreen />} />
          <Route
            path='/admin/productlist/:pageNumber'
            element={<ProductListScreen />}
          />
          <Route path='/admin/userlist' element={<UserListScreen />} />
          <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
          <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
        </Route>
      </Route>
    </>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider> 
    </Provider>
  </React.StrictMode>
);

reportWebVitals();