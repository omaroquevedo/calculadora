import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Header from "./Header";

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
    { label: "Valor UF hoy", tipo: "auto" },
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
    { label: "PAFE en $", tipo: "calculado" },
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

      if (tipo === "formulario") {
        const lines = content.split("\n").filter((line) => line.trim() !== "");
        const delimitador = lines[0].includes(";")
          ? ";"
          : lines[0].includes("\t")
          ? "\t"
          : ",";
        const headers = lines[0].split(delimitador).map((h) => h.trim());
        const values = lines[1].split(delimitador).map((v) => v.trim());

        const headerMap = {};
        headers.forEach((h, i) => {
          headerMap[h] = values[i];
        });

        const newFormData = {
          "Tipo de pensión (BDA)": headerMap["tipo_pension"] || "",
          "Rut afiliado (BDA)": headerMap["rut_afiliado"] || "",
          "Sexo (BDA)": headerMap["sexo"] === "M" ? "masculino" : "femenino",
          "AFP (BDA)": headerMap["afp"] || "",
          "Fecha de nacimiento (BDA)": formatearFecha(headerMap["fecha_nacimiento"]),
          "Fecha solicitud de pensión (BDA)": formatearFecha(headerMap["fecha_de_solicitud"]),
          "Saldo en cuotas CCICO fondo 1 (BDA)": headerMap["saldo_fondo_1"] || "",
          "Saldo en cuotas CCICO fondo 2 (BDA)": headerMap["saldo_fondo_2"] || "",
          "Multifondo 1 (BDA)": headerMap["tipo_fondo_1"] || "",
          "Multifondo 2 (BDA)": headerMap["tipo_fondo_2"] || "",
          "Bono de reconocimiento nominal (BDA)": headerMap["br_nominal"] || "",
          "Saldo en pesos BR (BDA)": headerMap["br"] || "",
        };

        setFormData((prev) => ({ ...prev, ...newFormData }));
      }

      if (tipo === "cuotas") {
        const cuotas = content.split("\n").filter((l) => l.trim());
        const delimitador = cuotas[0].includes(";")
          ? ";"
          : cuotas[0].includes("\t")
          ? "\t"
          : ",";
        const datos = cuotas.map((l) => l.split(delimitador));
        const fila = datos[1] || [];

        const newFormData = {
          "Valor cuota fondo 1": fila[1] || "",
          "Valor cuota fondo 2": fila[3] || "",
          "Multifondo 1": fila[0] || "",
          "Multifondo 2": fila[2] || "",
          "Fecha fondo 1": fila[4] || "",
          "Fecha fondo 2": fila[5] || "",
        };

        setFormData((prev) => ({ ...prev, ...newFormData }));
      }

      if (tipo === "uf") {
        const lines = content.split("\n").filter((l) => l.trim());
        const delimitador = lines[0].includes(";")
          ? ";"
          : lines[0].includes("\t")
          ? "\t"
          : ",";
        const ufs = lines.map((l) => l.split(delimitador));

        const encabezados = ufs[0].map((h) =>
          h.replace(/^\uFEFF/, "").trim().toLowerCase()
        );
        const fila = ufs[1];

        console.log("Encabezados detectados (UF):", encabezados);

        const iValor = encabezados.findIndex((h) => h === "valor uf");

        if (iValor !== -1 && fila && fila[iValor]) {
          const valorUFOriginal = fila[iValor].trim();
          const valorUF = valorUFOriginal.replace(/\./g, "").replace(",", ".");
          const ufNum = parseFloat(valorUF);

          console.log("UF original:", valorUFOriginal);
          console.log("UF parseado:", ufNum);

          if (!isNaN(ufNum)) {
            setFormData((prev) => ({
              ...prev,
              "Valor UF solicitud pensión": ufNum.toFixed(2),
            }));
          } else {
            console.warn("⚠️ No se pudo parsear el valor UF:", valorUFOriginal);
          }
        } else {
          console.warn("⚠️ Encabezado 'valor uf' no encontrado o sin datos.");
        }
      }

      if (tipo === "tasas") {
        const tasas = content.split("\n").filter((l) => l.trim());
        const delimitador = tasas[0].includes(";")
          ? ";"
          : tasas[0].includes("\t")
          ? "\t"
          : ",";
        const filas = tasas.map((l) => l.split(delimitador));
        const encabezados = filas[0].map((h) => h.trim().toLowerCase());

        const iTasa = encabezados.indexOf("tasa");
        const iTipo = encabezados.indexOf("tipo");

        if (iTasa !== -1 && iTipo !== -1) {
          const fila = filas.find((fila, index) => {
            if (index === 0) return false;
            const tipoTexto = fila[iTipo]?.trim().toLowerCase();
            return tipoTexto === "pafe vejez";
          });

          if (fila && fila[iTasa]) {
            const tasa = fila[iTasa].replace(",", ".");
            setFormData((prev) => ({
              ...prev,
              "Tasa interés pensión": tasa,
            }));
          }
        }
      }
    };

    reader.readAsText(file);
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
      headStyles: { fillColor: [26, 67, 129] },
    });

    doc.save("PAFE_vejez.pdf");
  };

  return (
    <>
      <Header />
      <div className="fondo-bienvenida">
        <div className="formulario-container">
          <h1 style={{ color: "#1a4381", marginBottom: "1rem" }}>PAFE-Pensión de Vejez</h1>

          <div className="fila">
            <label>Cargar archivo semiestructurada</label>
            <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, "formulario")} />
          </div>
          <div className="fila">
            <label>Cargar archivo de valores cuota</label>
            <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, "cuotas")} />
          </div>
          <div className="fila">
            <label>Cargar archivo de tasas de interés</label>
            <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, "tasas")} />
          </div>
          <div className="fila">
            <label>Cargar archivo de valores UF</label>
            <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, "uf")} />
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

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
            <button className="boton-calcular" onClick={() => console.log("Calcular presionado")}>Calcular</button>
            <button
              className="boton-calcular"
              onClick={exportarPDF}
              style={{ backgroundColor: "#c0392b", color: "#fff", border: "none" }}
            >
              Exportar a PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormularioVejez;
