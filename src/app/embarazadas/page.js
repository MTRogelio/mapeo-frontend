"use client";
import { useEffect, useState } from "react";
import "./EmbarazadasPage.css";

export default function EmbarazadasPage() {
  // ======== ESTADOS ========
  const [embarazadas, setEmbarazadas] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [embarazadasConDireccion, setEmbarazadasConDireccion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editandoEmbarazada, setEditandoEmbarazada] = useState(null);
  const [editandoDireccion, setEditandoDireccion] = useState(null);

  // ======== COLAPSAR TABLAS ========
  const [mostrarTablaCombinada, setMostrarTablaCombinada] = useState(true);
  const [mostrarTablaEmbarazadas, setMostrarTablaEmbarazadas] = useState(false);
  const [mostrarTablaDirecciones, setMostrarTablaDirecciones] = useState(false);

  // ======== FETCH ========
  useEffect(() => {
    cargarEmbarazadas();
    cargarDirecciones();
    cargarEmbarazadasConDireccion();
  }, []);

  const cargarEmbarazadas = () => {
    fetch("https://mapeo-backend.vercel.app/embarazadas")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener embarazadas");
        return res.json();
      })
      .then((data) => {
        setEmbarazadas(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const cargarDirecciones = () => {
    fetch("https://mapeo-backend.vercel.app/direcciones")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener direcciones");
        return res.json();
      })
      .then((data) => setDirecciones(data))
      .catch((err) => console.error(err));
  };

  const cargarEmbarazadasConDireccion = () => {
    fetch("https://mapeo-backend.vercel.app/embarazadas-direcciones")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener embarazadas con dirección");
        return res.json();
      })
      .then((data) => setEmbarazadasConDireccion(data))
      .catch((err) => console.error(err));
  };

  // ======== CRUD EMBARAZADAS ========
  const eliminarEmbarazada = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este registro?")) return;
    const embarazada = embarazadas.find((e) => e.ID_Embarazada === id);
    const idDireccion = embarazada?.ID_Direccion;

    const res = await fetch(`https://mapeo-backend.vercel.app/embarazadas/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      if (idDireccion) {
        await fetch(`https://mapeo-backend.vercel.app/direcciones/${idDireccion}`, {
          method: "DELETE",
        });
      }
      alert("🗑️ Embarazada y dirección eliminadas correctamente");
      cargarEmbarazadas();
      cargarDirecciones();
      cargarEmbarazadasConDireccion();
    } else {
      alert("⚠ Error al eliminar");
    }
  };

  const guardarEdicionEmbarazada = async (e) => {
    e.preventDefault();
    const data = {
      Nombre: e.target.nombre.value,
      Edad: parseInt(e.target.edad.value),
      Telefono: e.target.telefono.value,
      ID_Direccion: e.target.direccion.value ? parseInt(e.target.direccion.value) : null,
    };

    const res = await fetch(
      `https://mapeo-backend.vercel.app/embarazadas/${editandoEmbarazada.ID_Embarazada}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      alert("✏️ Registro actualizado");
      setEditandoEmbarazada(null);
      cargarEmbarazadas();
      cargarEmbarazadasConDireccion();
    } else {
      alert("⚠ Error al editar");
    }
  };

  // ======== CRUD DIRECCIONES ========
  const eliminarDireccion = async (id) => {
    if (!confirm("¿Eliminar esta dirección?")) return;
    const res = await fetch(`https://mapeo-backend.vercel.app/direcciones/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("🗑️ Dirección eliminada");
      cargarDirecciones();
      cargarEmbarazadasConDireccion();
    } else {
      alert("⚠ Error al eliminar");
    }
  };

  const guardarEdicionDireccion = async (e) => {
    e.preventDefault();
    const data = {
      Calle: e.target.calle.value,
      Ciudad: e.target.ciudad.value,
      Municipio: e.target.Municipio.value,
      Departamento: e.target.departamento.value,
      Zona: e.target.zona.value || null,
      Avenida: e.target.avenida.value || null,
      NumeroCasa: e.target.numeroCasa.value || null,
    };

    const res = await fetch(
      `https://mapeo-backend.vercel.app/direcciones/${editandoDireccion.ID_Direccion}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      alert("✏️ Dirección actualizada");
      setEditandoDireccion(null);
      cargarDirecciones();
      cargarEmbarazadasConDireccion();
    } else {
      alert("⚠ Error al editar");
    }
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>⚠ {error}</p>;

  return (
    <div className="container">

      {/* =============== */}
      {/* TABLA COMBINADA */}
      {/* =============== */}
      <div className="table-section">
        <h1 className="title">
          👩‍🍼 Embarazadas con Dirección
          <button
            onClick={() => setMostrarTablaCombinada(!mostrarTablaCombinada)}
            className="btn-editar"
            style={{ marginLeft: "15px", fontSize: "14px" }}
          >
            {mostrarTablaCombinada ? "Ocultar" : "Mostrar"}
          </button>
        </h1>

        {mostrarTablaCombinada && (
          <table className="embarazada-table">
            <thead className="embarazada-thead">
              <tr className="embarazada-tr">
                <th className="embarazada-th">ID Embarazada</th>
                <th className="embarazada-th">Nombre</th>
                <th className="embarazada-th">Edad</th>
                <th className="embarazada-th">Teléfono</th>
                <th className="embarazada-th">Calle</th>
                <th className="embarazada-th">Ciudad</th>
                <th className="embarazada-th">Municipio</th>
                <th className="embarazada-th">Departamento</th>
                <th className="embarazada-th">Zona</th>
                <th className="embarazada-th">Avenida</th>
                <th className="embarazada-th">Número Casa</th>
              </tr>
            </thead>
            <tbody className="embarazada-tbody">
              {embarazadasConDireccion.map((item) => (
                <tr key={item.ID_Embarazada} className="embarazada-tr">
                  <td className="embarazada-td" data-label="ID">{item.ID_Embarazada}</td>
                  <td className="embarazada-td" data-label="Nombre">{item.Nombre}</td>
                  <td className="embarazada-td" data-label="Edad">{item.Edad}</td>
                  <td className="embarazada-td" data-label="Teléfono">{item.Telefono}</td>
                  <td className="embarazada-td" data-label="Calle">{item.Calle}</td>
                  <td className="embarazada-td" data-label="Ciudad">{item.Ciudad}</td>
                  <td className="embarazada-td" data-label="Municipio">{item.Municipio}</td>
                  <td className="embarazada-td" data-label="Departamento">{item.Departamento}</td>
                  <td className="embarazada-td" data-label="Zona">{item.Zona || "-"}</td>
                  <td className="embarazada-td" data-label="Avenida">{item.Avenida || "-"}</td>
                  <td className="embarazada-td" data-label="Número Casa">{item.NumeroCasa || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===================== */}
      {/* TABLA EMBARAZADAS */}
      {/* ===================== */}
      <div className="table-section">
        <h1 className="title">
          Lista de Embarazadas
          <button
            onClick={() => setMostrarTablaEmbarazadas(!mostrarTablaEmbarazadas)}
            className="btn-editar"
            style={{ marginLeft: "15px", fontSize: "14px" }}
          >
            {mostrarTablaEmbarazadas ? "Ocultar" : "Mostrar"}
          </button>
        </h1>

        {mostrarTablaEmbarazadas && (
          <table className="embarazada-table">
            <thead className="embarazada-thead">
              <tr className="embarazada-tr">
                <th className="embarazada-th">ID</th>
                <th className="embarazada-th">Nombre</th>
                <th className="embarazada-th">Edad</th>
                <th className="embarazada-th">Teléfono</th>
                <th className="embarazada-th">ID Dirección</th>
                <th className="embarazada-th">Acciones</th>
              </tr>
            </thead>
            <tbody className="embarazada-tbody">
              {embarazadas.map((e) => (
                <tr key={e.ID_Embarazada} className="embarazada-tr">
                  <td className="embarazada-td">{e.ID_Embarazada}</td>
                  <td className="embarazada-td">{e.Nombre}</td>
                  <td className="embarazada-td">{e.Edad}</td>
                  <td className="embarazada-td">{e.TELEFONO}</td>
                  <td className="embarazada-td">{e.ID_Direccion}</td>
                  <td className="embarazada-td acciones">
                    <button onClick={() => setEditandoEmbarazada(e)} className="btn-editar">Editar</button>
                    <button onClick={() => eliminarEmbarazada(e.ID_Embarazada)} className="btn-eliminar">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===================== */}
      {/* TABLA DIRECCIONES */}
      {/* ===================== */}
      <div className="table-section">
        <h1 className="title subtitulo">
          Direcciones
          <button
            onClick={() => setMostrarTablaDirecciones(!mostrarTablaDirecciones)}
            className="btn-editar"
            style={{ marginLeft: "15px", fontSize: "14px" }}
          >
            {mostrarTablaDirecciones ? "Ocultar" : "Mostrar"}
          </button>
        </h1>

        {mostrarTablaDirecciones && (
          <table className="embarazada-table">
            <thead className="embarazada-thead">
              <tr className="embarazada-tr">
                <th className="embarazada-th">ID</th>
                <th className="embarazada-th">Calle</th>
                <th className="embarazada-th">Ciudad</th>
                <th className="embarazada-th">Municipio</th>
                <th className="embarazada-th">Departamento</th>
                <th className="embarazada-th">Zona</th>
                <th className="embarazada-th">Avenida</th>
                <th className="embarazada-th">Número de Casa</th>
                <th className="embarazada-th">Acciones</th>
              </tr>
            </thead>
            <tbody className="embarazada-tbody">
              {direcciones.map((d) => (
                <tr key={d.ID_Direccion} className="embarazada-tr">
                  <td className="embarazada-td">{d.ID_Direccion}</td>
                  <td className="embarazada-td">{d.Calle}</td>
                  <td className="embarazada-td">{d.Ciudad}</td>
                  <td className="embarazada-td">{d.Municipio}</td>
                  <td className="embarazada-td">{d.Departamento}</td>
                  <td className="embarazada-td">{d.Zona || "-"}</td>
                  <td className="embarazada-td">{d.Avenida || "-"}</td>
                  <td className="embarazada-td">{d.NumeroCasa || "-"}</td>
                  <td className="embarazada-td acciones">
                    <button onClick={() => setEditandoDireccion(d)} className="btn-editar">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===================== */}
      {/* MODALES */}
      {/* ===================== */}
      {editandoEmbarazada && (
        <div className="modal-overlay">
          <form onSubmit={guardarEdicionEmbarazada} className="modal-box">
            <h2 className="title">Editar embarazada #{editandoEmbarazada.ID_Embarazada}</h2>
            <label className="modal-label">Nombre</label>
            <input name="nombre" defaultValue={editandoEmbarazada.Nombre} className="modal-input" required />
            <label className="modal-label">Edad</label>
            <input name="edad" type="number" defaultValue={editandoEmbarazada.Edad} className="modal-input" required />
            <label className="modal-label">Teléfono</label>
            <input name="telefono" type="number" defaultValue={editandoEmbarazada.TELEFONO} className="modal-input" required />
            <label className="modal-label">ID Dirección</label>
            <input name="direccion" type="number" defaultValue={editandoEmbarazada.ID_Direccion} className="modal-input" />
            <div className="modal-actions">
              <button type="button" onClick={() => setEditandoEmbarazada(null)} className="modal-btn modal-btn-cancelar">Cancelar</button>
              <button type="submit" className="modal-btn modal-btn-guardar">Guardar</button>
            </div>
          </form>
        </div>
      )}

      {editandoDireccion && (
        <div className="modal-overlay">
          <form onSubmit={guardarEdicionDireccion} className="modal-box">
            <h2 className="title">Editar Dirección #{editandoDireccion.ID_Direccion}</h2>
            <label className="modal-label">Calle</label>
            <input name="calle" defaultValue={editandoDireccion.Calle} className="modal-input" required />
            <label className="modal-label">Ciudad</label>
            <input name="ciudad" defaultValue={editandoDireccion.Ciudad} className="modal-input" required />
            <label className="modal-label">Municipio</label>
            <input name="Municipio" defaultValue={editandoDireccion.Municipio} className="modal-input" required />
            <label className="modal-label">Departamento</label>
            <input name="departamento" defaultValue={editandoDireccion.Departamento} className="modal-input" required />
            <label className="modal-label">Zona</label>
            <input name="zona" defaultValue={editandoDireccion.Zona} className="modal-input" />
            <label className="modal-label">Avenida</label>
            <input name="avenida" defaultValue={editandoDireccion.Avenida} className="modal-input" />
            <label className="modal-label">Número de Casa</label>
            <input name="numeroCasa" defaultValue={editandoDireccion.NumeroCasa} className="modal-input" />
            <div className="modal-actions">
              <button type="button" onClick={() => setEditandoDireccion(null)} className="modal-btn modal-btn-cancelar">Cancelar</button>
              <button type="submit" className="modal-btn modal-btn-guardar">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
