import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from './utils/ProtectedRoute.js';
import AuthProvider from './utils/AuthContext.js';
import SignUpUser from "./pages/SignUpUser";
import SignUpCompany from "./pages/SignUpCompany";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/" element={<HomePage />} />
          <Route path="signup-user" element={<SignUpUser />} />
          <Route path="signup-company" element={<SignUpCompany />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
