import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState,useCallback } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart from "./Cart"
import {generateCartItemsFrom} from "./Cart"
import "./Products.css";

const Products = () => {
  const [allProducts,setAllProducts] = useState([])
  const [searchProducts,setSearchProdcuts] = useState()
  const [input,setInput] = useState("")
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState(false)
  const [cartItem,setCartItem] = useState([])
  const { enqueueSnackbar } = useSnackbar();  

  useEffect(()=>{
    performAPICall()
    fetchCart(localStorage.getItem("token"))
  },[])


  async function performAPICall() {
    setLoading(true)
    try {
      setError(false)
       const res = await axios.get(config.endpoint + "/products")    
       setAllProducts(res.data)
       setLoading(false)
    } catch(error) {
      if (error.response) {
        // RETURN API ERROR
        enqueueSnackbar(error.response.statusText, { variant: 'error' });
      } else {
        // IF BACKEND IS NOT RUNNING
        enqueueSnackbar("Something went wrong!", { variant: 'error' });
      }  }
  }

  async function performSearch(e) {
    const text = e.target.value;
    if(text.length === 0) {
            performAPICall();      
    } else {
    try {
      const res = await axios.get(config.endpoint + `/products/search?value=${text}`)
      // JSON.parse(res.data)
      setSearchProdcuts(res.data)
      setAllProducts([])
      setError(false)
    } catch (error){
      setError(true);
      setSearchProdcuts([])
      setAllProducts([])
       }
    }
  }

    const debounceSearch = (funct, debounceTimeout) => {
      let timer;
      return function (...args) {
        const context = this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          timer = null;
          funct.apply(context, args);
        }, debounceTimeout);
      }
    };

    const debounce = useCallback(debounceSearch(performSearch, 500), []);

    

    /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;
    
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const res = await axios.get(config.endpoint + `/cart`,{
        headers: {
          'Authorization': `Bearer ${token}`
         }
      })
      // const parsedData =  JSON.parse(res.data)
      // setCartItem(parsedData)
      setCartItem(res.data)
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
          );
        }
        return null;
      } 
    };
    
    
  
  

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].productId === productId) {
        return true;
      }
    }
    return null;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if(!token){
      enqueueSnackbar(
        "Login to add an item to the Cart",
        {
          variant: "warning",
        }
        );
    }
    if(isItemInCart(items,productId)){
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
        );
    }

    else {
      try {
        const res = await axios.post(config.endpoint + `/cart`,{
          "productId": productId,
          "qty": qty
        },{
          headers: {
            'Authorization': `Bearer ${token}`
           }
        })
        setCartItem(res.data)
      } catch (e) {
        if (e.response && e.response.status === 404) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
        } 
        }
    }
  };

  
  

  const handleQuantity =  async (e,id) => {
    

         for (let i = 0; i < cartItem.length; i++) {
    
      if(cartItem[i].productId === id){
        // else {
          const res =  await axios.post(config.endpoint + `/cart`,{
    //         //  ...cartItem,
            "productId": id,
              "qty": `${e === "handleAdd" ? cartItem[i].qty + 1 :cartItem[i].qty - 1 }` * 1
          },{
            headers: {
              'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            }
          })
        setCartItem(res.data)
      }
    }
    
 
  }

  return (
      <div>
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onInput={(e)=>setInput(e.target.value)} onChange={debounce}
        />
      </Header>
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search" onInput={(e)=>setInput(e.target.value)} onChange={debounce}
      />

       <Grid container>
        <Grid item md>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>
               to your door step
             </p>
           </Box>
           </Grid>
           {loading && 
            <div className="loading">
            <CircularProgress>
          </CircularProgress>
          <h2>Loading Products</h2>
          </div>}
          {error && 
            <div className="loading">
            <SentimentDissatisfied></SentimentDissatisfied>
          <h2>No Products Found</h2>
          </div>
          }
          <Grid container direction="row" spacing={{ xs: 1, md: 2 }}>
           {allProducts && allProducts.map((product)=>{
         return   <Grid item md={3} xs={6} key={product._id}> <ProductCard product={product} handleAddToCart={async () => await addToCart(window.localStorage.getItem('token'), cartItem, allProducts, product._id, 1, {preventDuplicate: true})}
         >
          </ProductCard> </Grid>
              
         }) 
         }
           {searchProducts && searchProducts.map((product)=>{
         return   <Grid item md={3} xs={6} key={product._id}> <ProductCard product={product} handleAddToCart={async () => await addToCart(window.localStorage.getItem('token'), cartItem, allProducts, product._id, 1, {preventDuplicate: true})}
         ></ProductCard> </Grid>
              
         }) 
         }
         </Grid>
         </Grid>
         {window.localStorage.getItem("token") !== null &&
         <Grid item md={3} sm={12} style={{backgroundColor: '#E9F5E1' }}>
        <Cart items={generateCartItemsFrom(cartItem,allProducts)}  handleQuantity={(e,id)=>handleQuantity(e,id)}>

        </Cart>
         </Grid>
        }
       </Grid>
       
      <Footer />
    </div>    )
}

export default Products;
