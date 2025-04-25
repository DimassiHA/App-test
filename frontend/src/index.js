import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/antd@5.13.2/dist/reset.css" />

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router> {/* Only one Router here */}
      <App />
    </Router>
  </React.StrictMode>
);