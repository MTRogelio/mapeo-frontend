"use client";
import { useEffect, useState } from "react";
import "./registrar.css";

export default function RegistrarEmbarazada() {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState({ lat: "", lng: "" });

  const municipios = [
    "Chicacao",
    "Cuyotenango",
    "Mazatenango",
    "Patulul",
    "Pueblo Nuevo",
    "Río Bravo",
    "Samayac",
    "San Antonio Suchitepéquez",
    "San Bernardino",
    "San Francisco Zapotitlán",
    "San Gabriel",
    "San José El Ídolo",
    "San Juan Bautista",
    "San Lorenzo",
    "San Miguel Panán",
    "San Pablo Jocopilas",
    "Santa Bárbara",
    "Santo Domingo Suchitepéquez",
    "Santo Tomás La Unión",
    "Zunilito",
    "San Andrés Villa Seca",
  ];

  useEffect(() => {
    const lat = localStorage.getItem("lat");
    const lng = localStorage.getItem("lng");
    if (lat && lng) {
      setCoords({ lat, lng });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    // Obtener valores del formulario
    const formData = {
      Nombre: e.target.Nombre.value.trim(),
      DPI: e.target.DPI.value.trim(),
      Edad: e.target.Edad.value,
      Telefono: e.target.Telefono.value.trim(),
      Calle: e.target.Calle.value.trim(),
      Ciudad: e.target.Ciudad.value.trim(),
      Municipio: e.target.Municipio.value,
      Departamento: e.target.Departamento.value.trim(),
      Zona: e.target.Zona.value.trim() || null,
      Avenida: e.target.Avenida.value.trim() || null,
      NumeroCasa: e.target.NumeroCasa.value.trim(),
      Latitud: e.target.Latitud.value || null,
      Longitud: e.target.Longitud.value || null,
    };

    // ====== VALIDACIONES FRONTEND ======

    // 1. Validar que los campos obligatorios no estén vacíos
    const camposObligatorios = [
      { nombre: "Nombre", valor: formData.Nombre },
      { nombre: "DPI", valor: formData.DPI },
      { nombre: "Edad", valor: formData.Edad },
      { nombre: "Teléfono", valor: formData.Telefono },
      { nombre: "Calle", valor: formData.Calle },
      { nombre: "Ciudad", valor: formData.Ciudad },
      { nombre: "Municipio", valor: formData.Municipio },
      { nombre: "Departamento", valor: formData.Departamento },
      { nombre: "Número de Casa", valor: formData.NumeroCasa },
    ];

    for (const campo of camposObligatorios) {
      if (!campo.valor) {
        setError(`⚠ El campo "${campo.nombre}" es obligatorio`);
        return;
      }
    }

    // 2. Validar DPI (exactamente 13 dígitos numéricos)
    if (!/^\d{13}$/.test(formData.DPI)) {
      setError("⚠ El DPI debe tener exactamente 13 dígitos numéricos");
      return;
    }

    // 3. Validar Teléfono (exactamente 8 dígitos numéricos)
    if (!/^\d{8}$/.test(formData.Telefono)) {
      setError("⚠ El teléfono debe tener exactamente 8 dígitos numéricos");
      return;
    }

    // 4. Validar Número de Casa (solo números)
    if (!/^\d+$/.test(formData.NumeroCasa)) {
      setError("⚠ El número de casa debe contener solo números");
      return;
    }

    // 5. Validar Edad (número positivo)
    if (formData.Edad <= 0 || formData.Edad > 120) {
      setError("⚠ La edad debe ser un número válido entre 1 y 120");
      return;
    }

    // 6. Validar coordenadas si están presentes
    if (formData.Latitud && (formData.Latitud < -90 || formData.Latitud > 90)) {
      setError("⚠ La latitud debe estar entre -90 y 90");
      return;
    }
    if (formData.Longitud && (formData.Longitud < -180 || formData.Longitud > 180)) {
      setError("⚠ La longitud debe estar entre -180 y 180");
      return;
    }

    // ====== ENVIAR AL BACKEND ======
    try {
      const res = await fetch("https://mapeo-backend.vercel.app/embarazadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setMensaje(result.message || "✅ Embarazada registrada correctamente");
        e.target.reset();
        localStorage.removeItem("lat");
        localStorage.removeItem("lng");
        setCoords({ lat: "", lng: "" });
      } else {
        // El backend devuelve errores específicos
        setError(result.error || "⚠ Error al registrar embarazada");
      }
    } catch (err) {
      setError("⚠ Error de conexión con el servidor");
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Registrar Embarazada</h1>

      {mensaje && <p className="success-message">{mensaje}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input 
          name="Nombre" 
          placeholder="Nombre completo" 
          className="input" 
          required 
        />

        <input 
          type="number" 
          name="Edad" 
          placeholder="Edad" 
          className="input" 
          min="1"
          max="120"
          required 
        />

        <input 
          type="text" 
          name="Telefono" 
          placeholder="Teléfono (8 dígitos)" 
          className="input" 
          maxLength="8"
          pattern="\d{8}"
          title="El teléfono debe tener exactamente 8 dígitos"
          required 
        />

        <input 
          name="Calle" 
          placeholder="Calle" 
          className="input" 
          required 
        />

        <input 
          name="Ciudad" 
          placeholder="Ciudad" 
          className="input" 
          required 
        />

        <select name="Municipio" className="input" required>
          <option value="">Seleccione un municipio</option>
          {municipios.map((mun) => (
            <option key={mun} value={mun}>
              {mun}
            </option>
          ))}
        </select>

        <input 
          name="Departamento" 
          placeholder="Departamento" 
          className="input" 
          required 
        />

        <input 
          name="Zona" 
          placeholder="Zona (opcional)" 
          className="input" 
        />

        <input 
          name="Avenida" 
          placeholder="Avenida (opcional)" 
          className="input" 
        />

        <input 
          type="text" 
          name="NumeroCasa" 
          placeholder="Número de casa" 
          className="input"
          pattern="\d+"
          title="El número de casa debe contener solo números"
          required 
        />

        <div className="coord-grid">
          <input
            type="number"
            step="0.000001"
            name="Latitud"
            placeholder="Latitud (opcional)"
            className="input"
            min="-90"
            max="90"
            value={coords.lat}
            onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
          />
          <input
            type="number"
            step="0.000001"
            name="Longitud"
            placeholder="Longitud (opcional)"
            className="input"
            min="-180"
            max="180"
            value={coords.lng}
            onChange={(e) => setCoords({ ...coords, lng: e.target.value })}
          />
        </div>

        <button type="submit" className="btn-submit">
          Guardar
        </button>
      </form>
    </div>
  );
}