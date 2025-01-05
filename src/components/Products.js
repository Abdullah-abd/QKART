/* eslint-disable */
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
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCards from "./ProductCard";
import Cart from "./Cart";
import { generateCartItemsFrom } from "./Cart";
// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [productFound, setProductFound] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items,setItems] = useState([])
  const { enqueueSnackbar } = useSnackbar();
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  useEffect(() => {
    performAPICall();
  }, []);
  const performSearch = async (text) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setProducts(response.data); // Update the product list with filtered products
    } catch (error) {
      setProductFound(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong. Please try again later.", {
          variant: "error",
        });
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimeout);
    const newTimeOut = setTimeout(() => {
      performSearch(event.target.value);
    }, 500);
    return newTimeOut;
  };

  const inputChangeHandler = (event) => {
    const timeOut = debounceSearch(event, debounceTimeout);
    setDebounceTimeout(timeOut);
  };
  
  const isItemInCart = (productId) => {
    return items.findIndex((item) => item.productId === productId) !== -1;
  };


  const handleAddToCart = async(productId,qty=1) => {
    const token = localStorage.getItem("token");
    if(!token){
      enqueueSnackbar("Please log in to add items to the Cart", { variant: "warning" });
      return;
    }
    if (isItemInCart(productId)) {
      enqueueSnackbar(
        "Item already in Cart. Use the cart sidebar to update quantity or remove item",
        { variant: "warning" }
      );
      return;
    }
    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty }, // Request body
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the Bearer token
            'Content-Type': 'application/json',
          },
        }
      );
      const cartItems=generateCartItemsFrom(response.data,products)
    setItems(cartItems)
      enqueueSnackbar(`Added product with ID: ${productId} to cart!`, {
        variant: "success",
      });
  
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
    }
   
  };
  {/*functions related to cart section*/ }
  const fetchCartData = async (token)=>{
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Pass the Bearer token
      },
    });


    console.log('from fethcard function',response.data)

    const cartItems=generateCartItemsFrom(response.data,products)
    setItems(cartItems)
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
    }
  }

  useEffect(()=>{
    // console.log(items)
  },[items])
  


  // const handleQuantity = async (productId, qty) => {
  //   const token = localStorage.getItem("token");
  
  //   if (!token) {
  //     enqueueSnackbar("You need to be logged in to update cart quantity!", { variant: "error" });
  //     return;
  //   }
  
  //   try {
  //     if (qty < 1) {
  //       // Handle delete case
  //       const response = await axios.delete(`${config.endpoint}/cart`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         data: { productId }, // Send productId to delete
  //       });
  //       console.log(response.data)
  //       enqueueSnackbar("Item removed from cart!", { variant: "success" });
  
  //       // Optionally update the cart state with the new response data
  //       // updateCartState(response.data);
  //     } else {
  //       // Handle update quantity case
  //       const response = await axios.post(
  //         `${config.endpoint}/cart`,
  //         { productId, qty },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       const cartData = generateCartItemsFrom(response.data,products)
  //       setItems(cartData)
  //       enqueueSnackbar("Cart updated successfully!", { variant: "success" });
  
  //       // Optionally update the cart state with the new response data
  //       // updateCartState(response.data);
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.data && error.response.data.message) {
  //       enqueueSnackbar(error.response.data.message, { variant: "error" });
  //     } else {
  //       enqueueSnackbar("An unexpected error occurred. Please try again.", { variant: "error" });
  //     }
  //   }
  // };
  
const handleQuantity = async (token, items, productId, products, qty,
  options = { preventDuplicate: false }
  ) => {
  if (!token) {
    enqueueSnackbar("Please log in to add item to cart", {
      variant: "warning",
    });
    return;
  } 

  if ( options.preventDuplicate && isItemInCart(items, productId)) {
    enqueueSnackbar(
      "Item already in cart. Use the cart slidebar to update quantity or remove item.",
      { variant: "warning" },
    );
    return;
  }


  try {
    const response = await axios.post(
      `${config.endpoint}/cart`,
      { productId, qty },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    enqueueSnackbar("Cart successfully updated", {
      variant: "Success",
    }); 
    const cartItems = generateCartItemsFrom(response.data, products)
    setItems(cartItems);
  }
catch (e) {
    if (e.response) {
      enqueueSnackbar(e.response.data.message, { variant: "error" });
    } else {
      enqueueSnackbar(
        "Could not fetch products. Check that the backend id=s running,reachable and return valid JSON",
        {
          variant: "error",
        }
      );
    }
  }

  
};


  {
    /*update login state*/
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchCartData(token);
    } else {
      setIsLoggedIn(false);
    }
  }, [products]);
  {
    /* handle logout */
  }
  const handleLogout = () => {
    localStorage.clear(); // Clear user data on logout
    setIsLoggedIn(false);
    // history.replace({ pathname: "/", state: { forceRender: true } }); // Redirect to home
  };
 
  return (
    <Box
      sx={{
        width: "99vw",
      }}
    >
      <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <Box sx={{maxWidth:"500px", width:"70%"}}>
        <TextField
          className="search-desktop search"
          size="small"
          sx={{ mx: "4rem" }}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={inputChangeHandler}
        />
        </Box>
      </Header>
      <div className={`main-container ${isLoggedIn ? "logged-in" : ""}`}>
        {/* Search view for mobiles */}
        <div className="products-section">
          <TextField
            className="search-mobile custom-search-field"
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
            name="search"
            onChange={inputChangeHandler}
          />
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
          </Grid>
          {!loading && productFound && (
            <Box sx={{ m: 2 }}>
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <ProductCards
                    product={product} // Pass each product as an array
                    handleAddToCart={handleAddToCart}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          )}
          {loading && (
            <Box className="loading">
              <div className="loader"></div>
              <div>Loading Products</div>
            </Box>
          )}
          {!productFound && (
            <Box className="loading">
              <span
                role="img"
                aria-label="sad emoji"
                style={{ fontSize: "3rem" }}
              >
                😞
              </span>
              <div>No Products found</div>
            </Box>
          )}
        </div>
        <div className="cart-section">
          {/* Cart Section */}
          {isLoggedIn && (
            <Grid item xs={12} md={3} className="cart-section">
              <Cart products={products} items={items} handleQuantity={handleQuantity} /> {/* Render Cart only when logged in */}
            </Grid>
          )}
        </div>
      </div>
      <Footer />
    </Box>
  );
};

export default Products;
