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

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Chatbot from "./Chatbot";
import AudioRecorder from "./AudioRecorder";

// Fake authentication function to check token (replace with actual logic)
const isAuthenticated = () => {
  return !!localStorage.getItem("access"); // Checks if the access token exists
};

// Private Route Component
const PrivateRoute = ({ children }) => {
  // return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuthenticated(!!token);
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

    // Attach the event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // return (
  //   <Router>
  //     <div className="App">
  //       <Routes>
  //         {/* Public Routes */}
  //         <Route path="/register" element={<Register />} />
  //         <Route path="/login" element={<Login />} />

  //         {/* Private Route */}
  //         <Route
  //           path="/chatbot"
  //           element={
  //             // <PrivateRoute>
  //             <Chatbot />
  //             // </PrivateRoute>
  //           }
  //         />

  //         {/* Redirect to login by default */}
  //         <Route path="*" element={<Navigate to="/login" />} />
  //       </Routes>
  //     </div>
  //   </Router>
  // );

  return (
    <Router>
      <div className="App">
        <Routes>

          {isAuthenticated ? (
            <>
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="*" element={<Navigate to="/chatbot" />} />
            </>
          ) : (
            <>
              <Route
                path="/register"
                element={<Register />}
              />
              <Route
                path="/login"
                element={<Login onLogin={() => setIsAuthenticated(isAuthenticated)} />}
              />
              <Route path="*" element={<Navigate to="/login" />} />
              <Route path="audio" element={<AudioRecorder />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}


export default App;
