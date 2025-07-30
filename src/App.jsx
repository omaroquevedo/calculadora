import './App.css';
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Bienvenida from "./components/Bienvenida";
import FormularioVejez from "./components/FormularioVejez";
import SeleccionTipo from "./components/SeleccionTipo";


function App() {
  const [autenticado, setAutenticado] = useState(false);

  return (
    <Router>
      <Routes>
        {!autenticado ? (
          <Route
            path="*"
            element={<Bienvenida onIngresar={() => setAutenticado(true)} />}
          />
        ) : (
          <>
            <Route path="/" element={<SeleccionTipo />} />
            <Route path="/formulario/vejez" element={<FormularioVejez />} />
            {/* Aquí puedes agregar: FormularioAnticipada, FormularioInvalidez, etc */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
