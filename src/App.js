/* eslint-disable */
import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import theme from "./theme";
import Thanks from "./components/Thanks"
import { ThemeProvider } from "@mui/material/styles";
import Checkout from "./components/Checkout"
export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8083/api/v1`,
};

function App() {
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
      {/* <Register /> */}
      {/* <ThemeProvider theme={theme}>
          <Login />
          </ThemeProvider> */}
      <Router>
        <Switch>
          <Route exact path="/" component={Products} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/thanks" component={Thanks} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
