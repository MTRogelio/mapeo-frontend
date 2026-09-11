"use client";
import { useEffect, useState } from "react";
import "./Direcciones.css";

export default function DireccionesPage() {
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);

  const cargarDirecciones = () => {
    fetch("/api/direcciones")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener direcciones");
        return res.json();
      })
      .then((data) => {
        setDirecciones(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarDirecciones();
  }, []);

  const eliminarDireccion = async (id) => {
    if (!confirm("¿Eliminar esta dirección?")) return;
    const res = await fetch(`/api/direcciones/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("🗑️ Dirección eliminada");
      cargarDirecciones();
    } else {
      alert("⚠ Error al eliminar");
    }
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();

    const data = {
      Calle: e.target.calle.value,
      Ciudad: e.target.ciudad.value,
      Departamento: e.target.departamento.value,
      Zona: e.target.zona.value || null,
      Avenida: e.target.avenida.value || null,
      NumeroCasa: e.target.numeroCasa.value || null,
    };

    const res = await fetch(`/api/direcciones/${editando.ID_Direccion}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("✏️ Dirección actualizada");
      setEditando(null);
      cargarDirecciones();
    } else {
      alert("⚠ Error al editar");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-600">⚠ {error}</p>;

  return (
    <div className="direcciones-container">
      <h1 className="direcciones-title">Direcciones</h1>
      <table className="direcciones-table">
        <thead className="direcciones-thead">
          <tr>
            <th className="direcciones-th">ID</th>
            <th className="direcciones-th">Calle</th>
            <th className="direcciones-th">Ciudad</th>
            <th className="direcciones-th">Departamento</th>
            <th className="direcciones-th">Zona</th>
            <th className="direcciones-th">Avenida</th>
            <th className="direcciones-th">Número de Casa</th>
            <th className="direcciones-th acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {direcciones.map((d) => (
            <tr key={d.ID_Direccion} className="direcciones-tr">
              <td className="direcciones-td" data-label="ID">{d.ID_Direccion}</td>
              <td className="direcciones-td" data-label="Calle">{d.Calle}</td>
              <td className="direcciones-td" data-label="Ciudad">{d.Ciudad}</td>
              <td className="direcciones-td" data-label="Departamento">{d.Departamento}</td>
              <td className="direcciones-td" data-label="Zona">{d.Zona || "-"}</td>
              <td className="direcciones-td" data-label="Avenida">{d.Avenida || "-"}</td>
              <td className="direcciones-td" data-label="Número de Casa">{d.NumeroCasa || "-"}</td>
              <td className="direcciones-td acciones" data-label="Acciones">
                <button onClick={() => setEditando(d)} className="btn-editar">Editar</button>
                <button onClick={() => eliminarDireccion(d.ID_Direccion)} className="btn-eliminar">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editando && (
        <div className="modal-overlay">
          <form onSubmit={guardarEdicion} className="modal-box">
            <h2 className="modal-title">Editar Dirección #{editando.ID_Direccion}</h2>
            <label className="modal-label">Calle</label>
            <input name="calle" defaultValue={editando.Calle} className="modal-input" required />
            <label className="modal-label">Ciudad</label>
            <input name="ciudad" defaultValue={editando.Ciudad} className="modal-input" required />
            <label className="modal-label">Departamento</label>
            <input name="departamento" defaultValue={editando.Departamento} className="modal-input" required />
            <label className="modal-label">Zona</label>
            <input name="zona" defaultValue={editando.Zona} className="modal-input" />
            <label className="modal-label">Avenida</label>
            <input name="avenida" defaultValue={editando.Avenida} className="modal-input" />
            <label className="modal-label">Número de Casa</label>
            <input name="numeroCasa" defaultValue={editando.NumeroCasa} className="modal-input" />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setEditando(null)} className="modal-btn modal-btn-cancelar">
                Cancelar
              </button>
              <button type="submit" className="modal-btn modal-btn-guardar">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
