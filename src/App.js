// import './App.css';
// import Chatbot from './Chatbot';

// function App() {
//   return (
//     <div className="App">
//       <Chatbot />
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Chatbot from "./Chatbot";

// Fake authentication function to check token (replace with actual logic)
const isAuthenticated = () => {
  return !!localStorage.getItem("access"); // Checks if the access token exists
};

// Private Route Component
const PrivateRoute = ({ children }) => {
  // return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Private Route */}
          <Route
            path="/chatbot"
            element={
              // <PrivateRoute>
                <Chatbot />
              // </PrivateRoute>
            }
          />

          {/* Redirect to login by default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
