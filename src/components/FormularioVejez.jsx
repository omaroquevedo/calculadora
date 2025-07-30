import React, { useState } from "react";
import Header from "./Header";

const FormularioVejez = () => {
  const [formData, setFormData] = useState({});

  const campos = [
    { label: "Tipo de pensión", tipo: "auto" },
    { label: "Rut afiliado", tipo: "auto" },
    { label: "Sexo", tipo: "auto" },
    { label: "AFP", tipo: "auto" },
    { label: "Fecha de nacimiento", tipo: "auto" },
    { label: "Fecha solicitud de pensión", tipo: "auto" },
    { label: "Saldo en cuotas CCICO fondo 1", tipo: "auto" },
    { label: "Saldo en cuotas CCICO fondo 2", tipo: "auto" },
    { label: "Bono de reconocimiento nominal (BDA)", tipo: "auto" },
    { label: "Fecha de nac. cónyuge", tipo: "manual" },
    { label: "Fecha Nac. Hija/o 1", tipo: "manual" },
    { label: "Fecha Nac. Hija/o 2", tipo: "manual" },
    { label: "Fecha Nac. Hijo/a Invalido", tipo: "manual" },
    { label: "CNU", tipo: "manual" },
    { label: "Saldo en UF CCICO", tipo: "calculado" },
    { label: "Saldo en cuotas BR", tipo: "calculado" },
    { label: "Saldo en pesos BR", tipo: "calculado" },
    { label: "Saldo en UF BR", tipo: "calculado" },
    { label: "Saldo total en UF BR + CCICO", tipo: "calculado" },
    { label: "CNU x 12", tipo: "calculado" },
    { label: "Saldo para PAFE (menos mortuoria)", tipo: "calculado" },
    { label: "PAFE en UF", tipo: "calculado" },
    { label: "PAFE en $", tipo: "calculado" },
    { label: "Valor cuota fondo 1", tipo: "auto" },
    { label: "Valor cuota fondo 2", tipo: "auto" },
    { label: "Valor UF solicitud pensión", tipo: "auto" },
    { label: "Tasa interés pensión", tipo: "auto" },
  ];

  const formatearFecha = (yyyymmdd) => {
    if (!yyyymmdd || yyyymmdd.length !== 8) return "";
    const yyyy = yyyymmdd.substring(0, 4);
    const mm = yyyymmdd.substring(4, 6);
    const dd = yyyymmdd.substring(6, 8);
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleFileUpload = (e, tipo) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const lines = content.split("\n").filter((line) => line.trim() !== "");

      if (tipo === "formulario") {
        const headers = lines[0].split("\t").map((h) => h.trim());
        const values = lines[1].split("\t").map((v) => v.trim());

        const headerMap = {};
        headers.forEach((h, i) => {
          headerMap[h] = values[i];
        });

        const newFormData = {
          "Tipo de pensión": headerMap["tipo_pension"] || "",
          "Rut afiliado": headerMap["RUT del afiliado"] || "",
          "Sexo": headerMap["Sexo"] === "M" ? "masculino" : "femenino",
          "AFP": headerMap["AFP"] || "",
          "Fecha de nacimiento": formatearFecha(headerMap["Fecha de Nacimiento"]),
          "Fecha solicitud de pensión": formatearFecha(headerMap["Fecha de solicitud de pensión de vejez edad/anticipada"]),
          "Saldo en cuotas CCICO fondo 1": headerMap["Saldo CCICO cuotas"] || "",
          "Saldo en cuotas CCICO fondo 2": headerMap["saldo_cuotas_fondo_d"] || "",
          "Bono de reconocimiento nominal (BDA)": headerMap["bono_reconocimiento"] || "",
          "Valor cuota fondo 1": headerMap["valor_cuota_fondo_e"] || "",
          "Valor cuota fondo 2": headerMap["valor_cuota_fondo_d"] || "",
          "Valor UF solicitud pensión": headerMap["valor_uf_solicitud"] || "",
          "Tasa interés pensión": headerMap["tasa_interes"] || "",
        };

        setFormData((prev) => ({ ...prev, ...newFormData }));
      }

      if (tipo === "cuotas") {
        const cuotas = content.split("\n").filter((l) => l.trim()).map((l) => l.split("\t"));
        const [_, valorFondo1, valorFondo2] = cuotas[1] || [];
        setFormData((prev) => ({
          ...prev,
          "Valor cuota fondo 1": valorFondo1 || prev["Valor cuota fondo 1"] || "",
          "Valor cuota fondo 2": valorFondo2 || prev["Valor cuota fondo 2"] || "",
        }));
      }

      if (tipo === "tasas") {
        const tasas = content.split("\n").filter((l) => l.trim()).map((l) => l.split("\t"));
        const tasa = tasas[1]?.[1];
        setFormData((prev) => ({
          ...prev,
          "Tasa interés pensión": tasa || prev["Tasa interés pensión"] || "",
        }));
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="fondo-bienvenida">
      <Header />
      <div className="formulario-container">
        <h1 style={{ color: "#1a4381", marginBottom: "1rem" }}>Formulario - Pensión de Vejez</h1>

        <div className="fila">
          <label>Cargar archivo semiestructurada</label>
          <input type="file" accept=".txt" onChange={(e) => handleFileUpload(e, "formulario")} />
        </div>
        <div className="fila">
          <label>Cargar archivo de valores cuota</label>
          <input type="file" accept=".txt,.tsv" onChange={(e) => handleFileUpload(e, "cuotas")} />
        </div>
        <div className="fila">
          <label>Cargar archivo de tasas de interés</label>
          <input type="file" accept=".txt,.tsv" onChange={(e) => handleFileUpload(e, "tasas")} />
        </div>

        <div className="formulario-grid ajustado">
          {campos.map(({ label, tipo }, index) => (
            <div className="fila" key={index}>
              <label>{label}</label>
              <input
                type="text"
                className={tipo}
                value={formData[label] || ""}
                onChange={(e) =>
                  tipo === "manual" ? setFormData({ ...formData, [label]: e.target.value }) : null
                }
                readOnly={tipo !== "manual"}
              />
            </div>
          ))}
        </div>

        <button className="boton-calcular">Calcular</button>
      </div>
    </div>
  );
};

export default FormularioVejez;
