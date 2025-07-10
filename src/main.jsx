import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.hydrateRoot(
  document.getElementById("root"),
  <App todos={window.__INITIAL_DATA__} />
);
