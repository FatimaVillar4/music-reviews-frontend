import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import "../styles/Header.css";

const Header = () => {
  const [username, setUsername] = useState("");
  const [plan, setPlan] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); 

  useEffect(() => {
    const loadUserData = () => {
      const storedUsername = localStorage.getItem("usuario");
      const storedPlan = localStorage.getItem("plan");

      if (storedUsername) setUsername(storedUsername);
      if (storedPlan) setPlan(storedPlan.toUpperCase());
    };

    loadUserData();

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      loadUserData();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("plan");
    navigate("/login");
  };

  return (
    <header className="app-header container-fluid">
      <div className="header-inner d-flex align-items-center justify-content-between">
        <div className="brand d-flex align-items-center gap-3">
          <div className="brand-square" />
          <div>
            <h1 className="mb-0">{t("form.musicrreviews")}</h1>
          </div>
        </div>

  
        <div className="header-actions d-flex align-items-center gap-3">
       <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => i18n.changeLanguage("es")}
            >
              {t("form.es")}
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => i18n.changeLanguage("en")}
            >
              {t("form.en")}
            </button>
          </div>

          <span className="badge-plan">{`PLAN ${plan}`}</span>
          <div className="user-circle">{username.charAt(0).toUpperCase()}</div>

          <button
            className="btn btn-outline-danger btn-logout"
            onClick={handleLogout}
          >
            {t("form.logout") || "Salir"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
