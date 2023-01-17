import React from "react";
import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout"
import Thanks from "./components/Thanks"

export const config = {
  endpoint: `https://qkart-frontend-nfvy.onrender.com`,
};

function App() {
  return (
  <Switch>
    <div className="App">
        <Route exact={true} path="/register">
          <Register></Register>
        </Route>
        <Route exact={true} path="/login">
          <Login></Login>
        </Route>
        <Route exact={true} path="/checkout">
          <Checkout></Checkout>
        </Route>
        <Route exact={true} path="/thanks">
          <Thanks></Thanks>
        </Route>
         <Route exact={true} path="/">
          <Products></Products>
        </Route>          
        </div>
  </Switch>  
  );
}

export default App;
  
