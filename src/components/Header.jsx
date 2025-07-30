import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header>
      <img src={logo} alt="Logo" />
      <h1 onClick={() => navigate("/")} title="Volver al inicio">
        SPAFE - Calculadora PAFE
      </h1>
    </header>
  );
};

export default Header;
