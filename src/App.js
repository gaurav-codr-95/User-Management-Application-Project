import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserList from "./components/UserList";
import UserDetails from "./components/UserDetails";



function App() {
  return (
    <Router>
      <Routes>
        {/* Route for listing all users */}
        <Route path="/" element={<UserList />} />
        {/* Route for showing detailed view of a user */}
        <Route path="/user/:id" element={<UserDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
