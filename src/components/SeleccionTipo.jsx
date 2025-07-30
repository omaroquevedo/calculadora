import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const SeleccionTipo = () => {
  const navigate = useNavigate();

  return (
    <div className="fondo-bienvenida">
      <Header />
      <div className="formulario-container" style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: "0.5rem", fontSize: "3rem", color: "#1a4381" }}>¡Bienvenido al SPAFE!</h1>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem", color: "#1a4381" }}>Sistema semiautomatizado de cálculos de PAFE</h2>

        <p style={{ marginBottom: "2rem", fontSize: "1rem", color: "#333" }}>
          A continuación selecciona el tipo de pensión para el que deseas calcular la PAFE
        </p>

        <select
          style={{ padding: "0.6rem", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "2rem" }}
          onChange={(e) => {
            if (e.target.value) navigate(`/formulario/${e.target.value}`);
          }}
        >
          <option value="">-- Selecciona un tipo de pensión --</option>
          <option value="vejez">Vejez</option>
          <option value="anticipada">Anticipada</option>
          <option value="invalidez">Invalidez</option>
          <option value="trabajo-pesado">Trabajo pesado</option>
        </select>

        <p style={{ fontSize: "1rem", color: "#333" }}>
          Este sistema es un desarrollo del Departamento de Atención al Usuario - DASU 08/2025.
        </p>
      </div>
    </div>
  );
};

export default SeleccionTipo;
