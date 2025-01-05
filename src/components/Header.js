/* eslint-disable */
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons, isLoggedIn, handleLogout }) => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children}
        {hasHiddenAuthButtons ? (
        // Hide all buttons for Register/Login pages
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
        </Button>
      ) : token ? (
        // Logged-in view
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar alt={username} src="avatar.png" />
          <span className="username">Hello, {username}</span>
          <Button className="button" variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      ) : (
        // Logged-out view
        <Stack direction="row" spacing={2}>
          <Button
            variant="text"
            className="explore-button"
            onClick={() => history.push("/login")}
          >
            Login
          </Button>
          <Button
            variant="contained"
            className="button"
            onClick={() => history.push("/register")}
          >
            Register
          </Button>
        </Stack>
      )}
      </Box>
    );
};

export default Header;
