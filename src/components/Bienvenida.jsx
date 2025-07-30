import React, { useState } from "react";
import logo from "../assets/logo.png"; // Ruta correcta del logo

const Bienvenida = ({ onIngresar }) => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const manejarLogin = () => {
    onIngresar(); // sin verificación
  };

  return (
    <div className="bienvenida">
      <div className="contenido">
        <img
          src={logo}
          alt="Logo Superintendencia"
          className="logo"
        />
        <h1>Sistema SPAFE</h1>
        <p style={{ marginBottom: "2rem", fontSize: "1rem", color: "#555" }}>
          inicie sesión con sus credenciales de Intranet.
        </p>
        <div className="formulario-login">
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={manejarLogin}>Ingresar</button>
        </div>
      </div>
    </div>
  );
};

export default Bienvenida;
