/* eslint-disable*/
import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import {
  Card,
  // eslint-disable-next-line
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  // console.log(productsData);
  // Use the map function to loop through cartData and find the corresponding product in productData
  // return cartData
  //   .map((cartItem) => {
  //     // Find the product matching the productId from cartItem in the productData array
  //     const product = productsData.find(
  //       (product) => product._id === cartItem.productId
  //     );
  //     console.log(product);
  //     // If a product is found, return a new object combining product and cart data
  //     if (product) {
  //       return {
  //         ...product, // Spread product data (name, price, etc.)
  //         productId: product._id, // Include productId from the product data
  //         qty: cartItem.qty, // Add the quantity from cartData
  //       };
  //     }

  //     // If no matching product is found, return null or an empty object
  //     return null;
  //   })
  //   .filter((item) => item !== null); // Filter out null values in case no product was found

  // console.log(cartData, productsData);
  if (!cartData) return;

  const nextCart = cartData.map((item) => ({
    ...item,
    ...productsData.find((product) => item.productId === product._id),
  }));

  // console.log(nextCart);
  return nextCart;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = [], products = []) => {
  return items.reduce((total, item) => {
    const product = products.find((product) => product._id === item.productId);
    return total + item.qty * (product?.cost || 0);
  }, 0);
};
export const getTotalItems = (items = []) => {
  return items.reduce((total, item) => total + item.qty, 0);
};
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ isReadOnly, value, handleAdd, handleDelete }) => {
  if (isReadOnly) {
    return <Box>Qty: {value}</Box>;
  }

  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 *
 *
 */
const Cart = ({ isReadOnly = false, products, items = [], handleQuantity }) => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const handleCheckout = () => {
    history.push("/checkout"); // Redirect to the /checkout page
  };

  // console.log(items)
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }
  
  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        <Box>
          {items.map((item) => {
            return (
              <Card
                className="card"
                key={item.productId}
                sx={{
                  display: "flex", // Make the card a flex container
                  flexDirection: "row",
                  alignItems: "center", // Vertically align content
                  gap: "1rem", // Add spacing between elements
                  padding: "1rem", // Optional padding for better visuals
                }}
              >
                <CardMedia
                  component="img"
                  image={item.image || ""} // Directly access image from item
                  alt={item.name || "Product Image"} // Directly access name from item
                  className="product-image"
                  sx={{
                    width: "100px", // Set image width
                    height: "100px", // Set image height
                    objectFit: "contain", // Maintain aspect ratio
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontSize: ".9rem" }}
                  >
                    {item.name || ""}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex", // Make the card a flex container
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    

                    <ItemQuantity
                      isReadOnly={isReadOnly}
                      value={item.qty}
                      handleAdd={async () => {
                        await handleQuantity(
                          token,
                          items,
                          item.productId,
                          products,
                          item.qty + 1
                        );
                      }}
                      handleDelete={async () => {
                        await handleQuantity(
                          token,
                          items,
                          item.productId,
                          products,
                          item.qty - 1
                        );
                      }}
                    />
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontSize: ".9rem", marginTop: "7px" }}
                    >
                      {`$${item.cost}` || ""}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items, products)}
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          {!isReadOnly && (
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={handleCheckout} // Add the navigation logic
            >
              Checkout
            </Button>
          )}
        </Box>
        {
          isReadOnly && (
            <Box className="cart">
              <Typography padding="0.5rem" color="#3C3C3C" variant="h4" my="1rem">
                Order Details
              </Typography>
              <Box
                padding="0.5rem"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box color="#3C3C3C" alignSelf="center">
                  Products
                </Box>
                <Box color="#3C3C3C" alignSelf="center">
                  {getTotalItems(items)}
                </Box>
              </Box>
              <Box
                padding="0.5rem"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box color="#3C3C3C" alignSelf="center">
                  Subtotal
                </Box>
                <Box color="#3C3C3C" alignSelf="center">
                ${getTotalCartValue(items, products)}
                </Box>
              </Box>
              <Box
                padding="0.5rem"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box color="#3C3C3C" alignSelf="center">
                  Shipping Charges
                </Box>
                <Box color="#3C3C3C" alignSelf="center">
                  $0
                </Box>
              </Box>
              <Box
                padding="0.5rem"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                fontWeight="600"
                fontSize="1.5rem"
              >
                <Box color="#3C3C3C" alignSelf="center">
                  Total
                </Box>
                <Box color="#3C3C3C" alignSelf="center">
                ${getTotalCartValue(items, products)}
                </Box>
              </Box>
            </Box>
          )
        }
      </Box>
    </>
  );
};

export default Cart;
