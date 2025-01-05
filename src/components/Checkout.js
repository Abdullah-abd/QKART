/*eslint-disable*/
import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
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

// const Checkout = () => {

/**
 * @typedef {Object} Address - Data on added address
 *
 * @property {string} _id - Unique ID for the address
 * @property {string} address - Full address string
 */

/**
 * @typedef {Object} Addresses - Data on all added addresses
 *
 * @property {Array.<Address>} all - Data on all added addresses
 * @property {string} selected - Id of the currently selected address
 */

/**
 * @typedef {Object} NewAddress - Data on the new address being typed
 *
 * @property { Boolean } isAddingNewAddress - If a new address is being added
 * @property { String} value - Latest value of the address being typed
 */

// TODO: CRIO_TASK_MODULE_CHECKOUT - Should allow to type a new address in the text field and add the new address or cancel adding new address
/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { String } token
 *    Login token
 *
 * @param { NewAddress } newAddress
 *    Data on new address being added
 *
 * @param { Function } handleNewAddress
 *    Handler function to set the new address field to the latest typed value
 *
 * @param { Function } addAddress
 *    Handler function to make an API call to add the new address
 *
 * @returns { JSX.Element }
 *    JSX for the Add new address view
 *
 */
const AddNewAddressView = ({
  token,
  newAddress,
  handleNewAddress,
  addAddress,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField
        multiline
        minRows={4}
        value={newAddress.value}
        onChange={handleNewAddress}
        placeholder="Enter your complete address"
      />
      {/* {console.log(newAddress)} */}
      <Stack direction="row" my="1rem">
        <Button
          className="button"
          variant="contained"
          onClick={() => addAddress(token, newAddress.value)}
        >
          Add
        </Button>
        <Button
          variant="text"
          value={false}
          onClick={() => handleNewAddress(false)}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

const Checkout = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });
  const handleAddressChange = (value) => {
    console.log(value)
    setAddresses((prevAddresses) => ({
      ...prevAddresses, // Spread the previous state
      selected: value, // Update the selected address
    }));
  };
  const handleNewAddress = (e) => {
    if (!e) {
      setNewAddress((prevAddress) => ({
        ...prevAddress,
        isAddingNewAddress: false,
      }));
      return;
    }
    const value = e.target.value;
    // console.log(value);
    setNewAddress({
      ...newAddress,
      value,
    });
  };
  // Fetch the entire products list
  const getProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);

      setProducts(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // Fetch cart data
  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  /**
   * Fetch list of addresses for a user
   *
   * API Endpoint - "GET /user/addresses"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "_id": "",
   *          "address": "Test address\n12th street, Mumbai"
   *      },
   *      {
   *          "_id": "BW0jAAeDJmlZCF8i",
   *          "address": "New address \nKolam lane, Chennai"
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
  const getAddresses = async (token) => {
    if (!token) return;

    try {
      const response = await axios.get(`${config.endpoint}/user/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data);
      setAddresses({ ...addresses, all: response.data });
      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch addresses. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  /**
   * Handler function to add a new address and display the latest list of addresses
   *
   * @param { String } token
   *    Login token
   *
   * @param { NewAddress } newAddress
   *    Data on new address being added
   *
   * @returns { Array.<Address> }
   *    Latest list of addresses
   *
   * API Endpoint - "POST /user/addresses"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "_id": "",
   *          "address": "Test address\n12th street, Mumbai"
   *      },
   *      {
   *          "_id": "BW0jAAeDJmlZCF8i",
   *          "address": "New address \nKolam lane, Chennai"
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
  const addAddress = async (token, newAddress) => {
    try {
      // TODO: CRIO_TASK_MODULE_CHECKOUT - Add new address to the backend and display the latest list of addresses
      const response = await axios.post(
        `${config.endpoint}/user/addresses`,
        { address: newAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        // console.log(response,"kj")
      // Fetch the latest list of addresses after successful addition
      await getAddresses(token);
      enqueueSnackbar("Address added successfully!", { variant: "success" });
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not add this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  /**
   * Handler function to delete an address from the backend and display the latest list of addresses
   *
   * @param { String } token
   *    Login token
   *
   * @param { String } addressId
   *    Id value of the address to be deleted
   *
   * @returns { Array.<Address> }
   *    Latest list of addresses
   *
   * API Endpoint - "DELETE /user/addresses/:addressId"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "_id": "",
   *          "address": "Test address\n12th street, Mumbai"
   *      },
   *      {
   *          "_id": "BW0jAAeDJmlZCF8i",
   *          "address": "New address \nKolam lane, Chennai"
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
  const deleteAddress = async (token, addressId) => {
    // event.stopPropagation();
    // try {
    //   // TODO: CRIO_TASK_MODULE_CHECKOUT - Delete selected address from the backend and display the latest list of addresses
    //   // Send DELETE request
    //   const response = await axios.delete(
    //     `${config.endpoint}/user/addresses/${addressId}`, // Replace `addressId` dynamically
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`, // Replace `token` with your auth token
    //       },
    //     }
    //   );

    //   // Show success message
    //   enqueueSnackbar("Address deleted successfully!", { variant: "success" });

    //   // Update the list of addresses (optional)
    //   await getAddresses(token); // Replace with your function to reload addresses
    // } catch (e) {
    //   if (e.response) {
    //     enqueueSnackbar(e.response.data.message, { variant: "error" });
    //   } else {
    //     enqueueSnackbar(
    //       "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
    //       {
    //         variant: "error",
    //       }
    //     );
    //   }
    // }

    try {
      // TODO: CRIO_TASK_MODULE_CHECKOUT - Delete selected address from the backend and display the latest list of addresses
      const res = await axios.delete(`${config.endpoint}/user/addresses/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setAddresses({
        ...addresses,
        all: res.data
      })
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };
  

  const handleLogout = () => {
    localStorage.clear(); // Clear user data on logout
    history.push("/login")
    // history.replace({ pathname: "/", state: { forceRender: true } }); // Redirect to home
  };
  // TODO: CRIO_TASK_MODULE_CHECKOUT - Validate request for checkout
  /**
   * Return if the request validation passed. If it fails, display appropriate warning message.
   *
   * Validation checks - show warning message with given text if any of these validation fails
   *
   *  1. Not enough balance available to checkout cart items
   *    "You do not have enough balance in your wallet for this purchase"
   *
   *  2. No addresses added for user
   *    "Please add a new address before proceeding."
   *
   *  3. No address selected for checkout
   *    "Please select one shipping address to proceed."
   *
   * @param { Array.<CartItem> } items
   *    Array of objects with complete data on products added to the cart
   *
   * @param { Addresses } addresses
   *    Contains data on array of addresses and selected address id
   *
   * @returns { Boolean }
   *    Whether validation passed or not
   *
   */
  const validateRequest = (items, addresses) => {
    const totalCartValue = getTotalCartValue(items,products);

    // Check for wallet balance
    const userWalletBalance = JSON.parse(localStorage.getItem("balance")); // Assume wallet balance is stored in localStorage
    if (totalCartValue > userWalletBalance) {
      enqueueSnackbar(
        "You do not have enough balance in your wallet for this purchase",
        { variant: "warning" }
      );
      return false;
    }

    // Check if there are any addresses added
    if (addresses.all.length === 0) {
      enqueueSnackbar("Please add a new address before proceeding.", {
        variant: "warning",
      });
      return false;
    }

    // Check if a shipping address is selected
    if (!addresses.selected) {
      enqueueSnackbar("Please select one shipping address to proceed.", {
        variant: "warning",
      });
      return false;
    }

    return true; // All validations passed

  };

  // TODO: CRIO_TASK_MODULE_CHECKOUT
  /**
   * Handler function to perform checkout operation for items added to the cart for the selected address
   *
   * @param { String } token
   *    Login token
   *
   * @param { Array.<CartItem } items
   *    Array of objects with complete data on products added to the cart
   *
   * @param { Addresses } addresses
   *    Contains data on array of addresses and selected address id
   *
   * @returns { Boolean }
   *    If checkout operation was successful
   *
   * API endpoint - "POST /cart/checkout"
   *
   * Example for successful response from backend:
   * HTTP 200
   * {
   *  "success": true
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *  "success": false,
   *  "message": "Wallet balance not sufficient to place order"
   * }
   *
   */
  const performCheckout = async (token, items, addresses) => {
     // Replace with actual wallet balance value
  // console.log(addresses,"qwertyuu")

  if (!validateRequest(items, addresses)||(!token)) {
    return;
  }
  try {
    // console.log(addresses.selected,"asf")
    const response = await axios.post(
      `${config.endpoint}/cart/checkout`,
      { addressId: addresses.selected },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    enqueueSnackbar("Order placed successfully!", { variant: "success" });
    history.push("/thanks");
  } catch (e) {
    enqueueSnackbar("Checkout failed. Please try again later.", {
      variant: "error",
    });
  }
  };

  // TODO: CRIO_TASK_MODULE_CHECKOUT - Fetch addressses if logged in, otherwise show info message and redirect to Products page

  // Fetch products and cart data on page load
  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await getProducts();

      const cartData = await fetchCart(token);

      if (productsData && cartData) {
        const cartDetails = await generateCartItemsFrom(cartData, productsData);
        setItems(cartDetails);
      }
    };
    onLoadHandler();
    if (!token) {
      enqueueSnackbar("You must be logged in to access checkout page", {
        variant: "error",
      });
      history.push("/login");
    }
    getAddresses(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(addresses.all);
  return (
    <>
      <Header handleLogout={handleLogout} />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <Box>
              {/* TODO: CRIO_TASK_MODULE_CHECKOUT - Display list of addresses and corresponding "Delete" buttons, if present, of which 1 can be selected */}
              {/* <Typography my="1rem">
                 No addresses found for this account. Please add one to proceed
               </Typography> */}
              <Box>
                {/* Display the list of addresses if available */}
                {addresses.all.length > 0 ? (
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={addresses.selected}
                      onChange={(e) => handleAddressChange(e.target.value)}
                    >
                      {addresses.all.map((address) => (
                        <Box
                          key={address._id}
                          my="1rem"
                          sx={{
                            width: "100%",
                            marginBottom: "1rem",
                            display: "block",
                            padding: "1rem",
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                            cursor: "pointer", // Make the whole div clickable
                            backgroundColor: addresses.selected === address._id ? "#e0f7fa" : "transparent",
                            "&:hover": {
                              backgroundColor: "#f5f5f5", // Optional: Add hover effect
                            },
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent={"space-between"}
                            sx={{ width: "100%" }}
                            spacing={1}
                          >
                            <FormControlLabel
                              value={address._id}
                              control={<Radio sx={{ display: "none" }} />}
                              label={address.address}
                            />
                            <Button
                              color="error"
                              sx={{ color: "#00a278" }}
                              startIcon={<DeleteIcon />}
                              onClick={() => deleteAddress(token, address._id)}
                            >
                              Delete
                            </Button>
                          </Stack>
                        </Box>
                      ))}
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <Typography my="1rem">
                    No addresses found for this account. Please add one to
                    proceed.
                  </Typography>
                )}
              </Box>
            </Box>

            {/* TODO: CRIO_TASK_MODULE_CHECKOUT - Dislay either "Add new address" button or the <AddNewAddressView> component to edit the currently selected address */}
            {!newAddress.isAddingNewAddress && (
              <Button
                color="primary"
                className="button"
                variant="contained"
                id="add-new-btn"
                size="large"
                onClick={() => {
                  setNewAddress((currNewAddress) => ({
                    ...currNewAddress,
                    isAddingNewAddress: true,
                  }));
                }}
              >
                Add new address
              </Button>
            )}
            {newAddress.isAddingNewAddress && (
              <AddNewAddressView
                token={token}
                newAddress={newAddress}
                handleNewAddress={handleNewAddress}
                addAddress={addAddress}
              />
            )}
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items,products)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>

            <Button
              className="button"
              startIcon={<CreditCard />}
              variant="contained"
              onClick={() => performCheckout(token, items, addresses)}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly={true} products={products} items={items} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
