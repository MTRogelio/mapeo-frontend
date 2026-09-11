"use client";
import { useEffect, useState } from "react";
import "./registrar.css";

export default function RegistrarEmbarazada() {
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

    const data = {
      Nombre: e.target.Nombre.value,
      Edad: e.target.Edad.value,
      Telefono: e.target.Telefono.value,
      NumSemanas: e.target.NumSemanas.value,
      DPI: e.target.DPI.value,
      Calle: e.target.Calle.value,
      Ciudad: e.target.Ciudad.value,
      Municipio: e.target.Municipio.value,
      Departamento: e.target.Departamento.value,
      Zona: e.target.Zona.value || null,
      Avenida: e.target.Avenida.value || null,
      NumeroCasa: e.target.NumeroCasa.value,
      Latitud: e.target.Latitud.value || null,
      Longitud: e.target.Longitud.value || null,
    };

    if (!/^\d{8}$/.test(data.Telefono)) {
      alert("⚠ El teléfono debe tener exactamente 8 dígitos numéricos");
      return;
    }

    try {
      const res = await fetch("/api/embarazadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        alert(result.message || "✅ Embarazada registrada correctamente");
        e.target.reset();
        localStorage.removeItem("lat");
        localStorage.removeItem("lng");
        setCoords({ lat: "", lng: "" });
      } else {
        const result = await res.json();
        alert(result.error || "⚠ Error al registrar embarazada");
      }
    } catch (err) {
      alert("⚠ Error de conexión con el servidor");
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Registrar Embarazada</h1>

      <form onSubmit={handleSubmit} className="form">
        <input name="Nombre" placeholder="Nombre" className="input" required />
        <input type="number" name="Edad" placeholder="Edad" className="input" required />
        <input type="text" name="Telefono" placeholder="Teléfono" className="input" required />
        <input type="text" inputMode="numeric" pattern="\d{13}" name="DPI" placeholder="DPI (13 dígitos)" className="input" required />
        <input type="number" name="NumSemanas" placeholder="NumSemanas" className="input" required />

        <input name="Calle" placeholder="Calle" className="input" required />
        <input name="Ciudad" placeholder="Ciudad" className="input" required />

        {/* 🔹 ComboBox de Municipio */}
        <select name="Municipio" className="input" required>
          <option value="">Seleccione un municipio</option>
          {municipios.map((mun) => (
            <option key={mun} value={mun}>
              {mun}
            </option>
          ))}
        </select>

        <input name="Departamento" placeholder="Departamento" className="input" required />

        {/* 🔹 Campos opcionales */}
        <input name="Zona" placeholder="Zona (opcional)" className="input" />
        <input name="Avenida" placeholder="Avenida (opcional)" className="input" />
        <input name="NumeroCasa" placeholder="Número de casa" className="input" required />

        <div className="coord-grid">
          <input
            type="number"
            step="0.000001"
            name="Latitud"
            placeholder="Latitud"
            className="input"
            value={coords.lat}
            onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
          />
          <input
            type="number"
            step="0.000001"
            name="Longitud"
            placeholder="Longitud"
            className="input"
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