import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Header from "./Header";
import calcularCampos from "../utils/calcularFormularioVejez";
import Papa from "papaparse";

const FormularioVejez = () => {
  const [formData, setFormData] = useState({});

  const campos = [
    { label: "Tipo de pensión (BDA)", tipo: "auto" },
    { label: "Rut afiliado (BDA)", tipo: "auto" },
    { label: "Sexo (BDA)", tipo: "auto" },
    { label: "AFP (BDA)", tipo: "auto" },
    { label: "Fecha de nacimiento (BDA)", tipo: "auto" },
    { label: "Fecha solicitud de pensión (BDA)", tipo: "auto" },
    { label: "Fecha de nac. cónyuge (SCOMP)", tipo: "manual" },
    { label: "Fecha Nac. Hija/o 1 (SCOMP)", tipo: "manual" },
    { label: "Fecha Nac. Hija/o 2 (SCOMP)", tipo: "manual" },
    { label: "Fecha Nac. Hijo/a Invalido (SCOMP)", tipo: "manual" },
    { label: "Saldo en cuotas CCICO fondo 1 (BDA)", tipo: "auto" },
    { label: "Saldo en cuotas CCICO fondo 2 (BDA)", tipo: "auto" },
    { label: "Multifondo 1 (BDA)", tipo: "auto" },
    { label: "Multifondo 2 (BDA)", tipo: "auto" },
    { label: "Valor cuota fondo 1", tipo: "auto" },
    { label: "Valor cuota fondo 2", tipo: "auto" },
    { label: "Fecha fondo 1", tipo: "auto" },
    { label: "Fecha fondo 2", tipo: "auto" },
    { label: "Valor UF solicitud pensión", tipo: "auto" },
    { label: "Valor UF hoy", tipo: "manual" },
    { label: "Saldo en UF CCICO", tipo: "calculado" },
    { label: "Saldo en cuotas BR", tipo: "auto" },
    { label: "Saldo en UF BR", tipo: "calculado" },
    { label: "Saldo en pesos BR (BDA)", tipo: "auto" },
    { label: "Bono de reconocimiento nominal (BDA)", tipo: "auto" },
    { label: "Saldo total en UF BR + CCICO", tipo: "calculado" },
    { label: "Tasa interés pensión", tipo: "auto" },
    { label: "CNU", tipo: "manual" },
    { label: "CNU x 12", tipo: "calculado" },
    { label: "Saldo para PAFE (menos mortuoria)", tipo: "calculado" },
    { label: "PAFE en UF", tipo: "calculado" },
    { label: "PAFE en $", tipo: "calculado" }
  ];

  const handleArchivoFormularioBase = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const fila = results.data[0];
        if (fila) {
          const nuevo = {
            "Tipo de pensión (BDA)": fila["tipo_pension"] || "",
            "Rut afiliado (BDA)": fila["rut_afiliado"] || "",
            "Sexo (BDA)": fila["sexo"]?.toLowerCase() === "m" ? "masculino" : "femenino",
            "AFP (BDA)": fila["afp"] || "",
            "Fecha de nacimiento (BDA)": fila["fecha_nacimiento"] || "",
            "Fecha solicitud de pensión (BDA)": fila["fecha_de_solicitud"] || "",
            "Saldo en cuotas CCICO fondo 1 (BDA)": fila["saldo_fondo_1"] || "",
            "Saldo en cuotas CCICO fondo 2 (BDA)": fila["saldo_fondo_2"] || "",
            "Multifondo 1 (BDA)": fila["tipo_fondo_1"] || "",
            "Multifondo 2 (BDA)": fila["tipo_fondo_2"] || "",
            "Bono de reconocimiento nominal (BDA)": fila["br_nominal"] || "",
            "Saldo en pesos BR (BDA)": fila["br"] || "",
            "Saldo en cuotas BR": fila["saldo_cuotas_br"] || ""
          };
          setFormData((prev) => ({ ...prev, ...nuevo }));
        }
      }
    });
  };

  const handleArchivoValoresCuota = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const fila = results.data[0];
        setFormData((prev) => ({
          ...prev,
          "Valor cuota fondo 1": fila["vc_fondo_1"]?.replace(",", "."),
          "Valor cuota fondo 2": fila["vc_fondo_2"]?.replace(",", "."),
          "Fecha fondo 1": fila["fecha_fondo_1"],
          "Fecha fondo 2": fila["fecha_fondo_2"],
          "Multifondo 1 (BDA)": fila["fondo_1"],
          "Multifondo 2 (BDA)": fila["fondo_2"]
        }));
      }
    });
  };

  const handleArchivoUF = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data;
        const fila = data[data.length - 1];
        const valorSolicitud = fila["Valor_UF_solicitud_pensión"];

        setFormData((prev) => ({
          ...prev,
          "Valor UF solicitud pensión": valorSolicitud?.replace(",", ".")
        }));
      }
    });
  };

  const handleArchivoTasaInteres = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const fila = results.data.find((f) => f.tipo?.toLowerCase() === "pafe vejez" || f.Tipo?.toLowerCase() === "pafe vejez");
        const tasa = fila?.tasa || fila?.Tasa;
        setFormData((prev) => ({
          ...prev,
          "Tasa interés pensión": tasa?.replace(",", ".")
        }));
      }
    });
  };

  const handleCalcular = () => {
    const nuevosValores = calcularCampos(formData);
    setFormData((prev) => ({ ...prev, ...nuevosValores }));
  };

  const limpiarFormulario = () => {
    setFormData({});
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Resumen del formulario - Pensión de Vejez", 14, 20);
    const rows = campos.map(({ label }) => [label, formData[label] || ""]);
    doc.autoTable({
      startY: 30,
      head: [["Campo", "Valor"]],
      body: rows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [26, 67, 129] }
    });
    doc.save("PAFE_vejez.pdf");
  };

  return (
    <>
      <Header />
      <div className="fondo-bienvenida">
        <div className="formulario-container">
          <h1 className="titulo-formulario">PAFE-Pensión de Vejez</h1>

          <div className="boton-separado-grid">
            <div className="fila">
              <label>Cargar archivo Formulario Base (.csv)</label>
              <input type="file" accept=".csv" onChange={handleArchivoFormularioBase} />
            </div>
            <div className="fila">
              <label>Cargar archivo Valores Cuota</label>
              <input type="file" accept=".csv" onChange={handleArchivoValoresCuota} />
            </div>
            <div className="fila">
              <label>Cargar archivo Tasa de Interés</label>
              <input type="file" accept=".csv" onChange={handleArchivoTasaInteres} />
            </div>
            <div className="fila">
              <label>Cargar archivo UF</label>
              <input type="file" accept=".csv" onChange={handleArchivoUF} />
            </div>
          </div>

          <div className="formulario-grid-horizontal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {campos.map(({ label, tipo }, index) => (
              <div className="campo-formulario" key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label className="etiqueta" style={{ width: '50%' }}>{label}</label>
                <input
                  type="text"
                  className={`input-campo ${tipo}`}
                  value={formData[label] || ""}
                  onChange={(e) => tipo === "manual" ? setFormData({ ...formData, [label]: e.target.value }) : null}
                  readOnly={tipo !== "manual"}
                  style={{ flex: 1 }}
                />
              </div>
            ))}
          </div>

          <div className="botonera" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="boton-calcular" onClick={handleCalcular} style={{ backgroundColor: '#1a4381', color: 'white' }}>Calcular</button>
            <button className="boton-calcular" onClick={exportarPDF} style={{ backgroundColor: '#009688', color: 'white' }}>Exportar a PDF</button>
            <button className="boton-calcular" onClick={limpiarFormulario} style={{ backgroundColor: '#888', color: 'white' }}>Limpiar formulario</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormularioVejez;
