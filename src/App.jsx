import {useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from "./Components/SignUp";
import Login from "./Components/Login";
import Home from "./Components/Home";
import "./i18n/i18n";
import { Provider } from "react-redux";
import store from "./store/store";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

const RutasProtegidas = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <RutasProtegidas />
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="dark" // 👈 combina con tu diseño
      />
    </Provider>
    
  );
}


export default App;
