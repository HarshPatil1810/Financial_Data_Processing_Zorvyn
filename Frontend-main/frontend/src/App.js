import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Sidebar from './components/sidebar/Sidebar';
import UserManagement from './components/UserManagement';
import AddFinancialRecord from './components/DataManagement/AddFinancialRecord';
import ViewTransaction from './components/DataManagement/ViewTransaction';
import Dashboard from './components/Dashboard';
import Layout from './Layout';
import { useState } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      <BrowserRouter>
     <Routes>
      {/* Login without sidebar */}
      <Route path="/" element={<Login />} />

      {/* All pages with sidebar */}
      <Route path="/" element={<Layout />}>
        <Route path="usermanagement" element={<UserManagement />} />
        <Route path="add-transaction" element={<AddFinancialRecord />} />
        <Route path="view-transaction" element={<ViewTransaction />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
    </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
