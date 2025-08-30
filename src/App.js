
// import { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Register from "./Auth/Register";
// import Login from "./Auth/Login";
// import Chatbot from "./Chatbot";
// import AudioRecorder from "./AudioRecorder";

// // Fake authentication function to check token (replace with actual logic)
// const isAuthenticated = () => {
//   return !!localStorage.getItem("access"); // Checks if the access token exists
// };

// // Private Route Component
// const PrivateRoute = ({ children }) => {
//   return isAuthenticated() ? children : <Navigate to="/login" />;
// };

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);



//   useEffect(() => {
//     const token = localStorage.getItem("access");
//     setIsAuthenticated(!!token);
//   }, []);

//   useEffect(() => {
//     const handleBeforeUnload = async () => {
//       try {
//         await fetch('/api/end-session/', {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('access')}`,
//             'Content-Type': 'application/json',
//           },
//         });
//       } catch (e) {
//         console.error('Failed to end session:', e);
//       }
//     };

//     // Attach the event listener
//     window.addEventListener('beforeunload', handleBeforeUnload);

//     // Cleanup on component unmount
//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);

//   // return (
//   //   <Router>
//   //     <div className="App">
//   //       <Routes>
//   //         {/* Public Routes */}
//   //         <Route path="/register" element={<Register />} />
//   //         <Route path="/login" element={<Login />} />

//   //         {/* Private Route */}
//   //         <Route
//   //           path="/chatbot"
//   //           element={
//   //             // <PrivateRoute>
//   //             <Chatbot />
//   //             // </PrivateRoute>
//   //           }
//   //         />

//   //         {/* Redirect to login by default */}
//   //         <Route path="*" element={<Navigate to="/login" />} />
//   //       </Routes>
//   //     </div>
//   //   </Router>
//   // );

//   return (
//     <Router>
//       <div className="App">
//         <Routes>

//           {isAuthenticated ? (
//             <>
//               <Route path="/chatbot" element={<Chatbot />} />
//               <Route path="*" element={<Navigate to="/chatbot" />} />
//             </>
//           ) : (
//             <>
//               <Route
//                 path="/register"
//                 element={<Register />}
//               />
//               <Route
//                 path="/login"
//                 element={<Login onLogin={() => setIsAuthenticated(isAuthenticated)} />}
//               />
//               <Route path="*" element={<Navigate to="/login" />} />
//               <Route path="audio" element={<AudioRecorder />} />
//             </>
//           )}
//         </Routes>
//       </div>
//     </Router>
//   );
// }


// export default App;


import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Chatbot from "./Chatbot";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import ChatbotSimple from "./ChatbotSimple";
import ChatbotPlacebo from "./ChatbotPlacebo";

const checkAuth = () => {
  return !!localStorage.getItem("access");
};

const getUserGroup = () => {
  return localStorage.getItem("userGroup") || "";
};

const getRouteByGroup = (group) => {
  const normalizedGroup = group.toLowerCase().trim();
  switch (normalizedGroup) {
    case "intervention":
      return "/alpha";
    case "control":
      return "/beta";
    case "placebo":
      return "/gamma";
    default:
      return "/alpha"; // fallback
  }
};



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(checkAuth());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      try {
        await fetch('/api/end-session/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (e) {
        console.error('Failed to end session:', e);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/alpha" element={
                getUserGroup().toLowerCase().trim() === "intervention"
                  ? <Chatbot />
                  : <Navigate to={getRouteByGroup(getUserGroup())} replace />
              } />
              <Route path="/beta" element={
                getUserGroup().toLowerCase().trim() === "control"
                  ? <ChatbotSimple />
                  : <Navigate to={getRouteByGroup(getUserGroup())} replace />
              } />
              <Route path="/gamma" element={
                getUserGroup().toLowerCase().trim() === "placebo"
                  ? <ChatbotPlacebo />
                  : <Navigate to={getRouteByGroup(getUserGroup())} replace />
              } />
              <Route path="/" element={<Navigate to={getRouteByGroup(getUserGroup())} replace />} />
              <Route path="*" element={<Navigate to={getRouteByGroup(getUserGroup())} replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
              <Route path="/register" element={<Register onRegister={() => setIsAuthenticated(true)} />} />
              <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
              {/* <Route path="/audio" element={<AudioRecorder />} /> */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
