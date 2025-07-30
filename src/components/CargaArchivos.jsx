// src/components/CargaArchivos.jsx
function CargaArchivos() {
  return (
    <div className="carga-archivos">
      <h2>Archivos</h2>
      <label>
        Cargar Formulario .txt:
        <input type="file" />
      </label>
      <label>
        Cargar Valores Cuota (.xlsx):
        <input type="file" />
      </label>
      <label>
        Cargar Tasas de Interés (.xlsx):
        <input type="file" />
      </label>
    </div>
  );
}

export default CargaArchivos;
