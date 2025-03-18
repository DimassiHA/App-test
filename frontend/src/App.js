import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Events from "./Events";


const App = () => {
  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <h1>Event Manager</h1>
        <Routes>

          <Route path="/events" element={<Events />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
