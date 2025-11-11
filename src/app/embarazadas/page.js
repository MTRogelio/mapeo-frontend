"use client";
import { useEffect, useState } from "react";
import "./EmbarazadasPage.css";

const EmbarazadasPage = () => {
  // ======== ESTADOS ========
  const [embarazadas, setEmbarazadas] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [embarazadasConDireccion, setEmbarazadasConDireccion] = useState([]);

  const [editandoEmbarazada, setEditandoEmbarazada] = useState(null);
  const [editandoDireccion, setEditandoDireccion] = useState(null);

  // ======== MOSTRAR / OCULTAR TABLAS ========
  const [mostrarTablaCombinada, setMostrarTablaCombinada] = useState(false);
  const [mostrarTablaEmbarazadas, setMostrarTablaEmbarazadas] = useState(false);
  const [mostrarTablaDirecciones, setMostrarTablaDirecciones] = useState(false);
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

  // ======== CARGA DE DATOS ========
  const cargarEmbarazadas = () => {
    fetch("https://mapeo-backend.vercel.app/embarazadas")
      .then((res) => res.json())
      .then(setEmbarazadas)
      .catch(console.error);
  };

  const cargarDirecciones = () => {
    fetch("https://mapeo-backend.vercel.app/direcciones")
      .then((res) => res.json())
      .then(setDirecciones)
      .catch(console.error);
  };

  const cargarEmbarazadasConDireccion = () => {
    fetch("https://mapeo-backend.vercel.app/embarazadas-direcciones")
      .then((res) => res.json())
      .then(setEmbarazadasConDireccion)
      .catch(console.error);
  };

  useEffect(() => {
    cargarEmbarazadas();
    cargarDirecciones();
    cargarEmbarazadasConDireccion();
  }, []);

  // ======== ELIMINAR ========
  const eliminarEmbarazada = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      fetch(`https://mapeo-backend.vercel.app/embarazadas/${id}`, {
        method: "DELETE",
      }).then(() => cargarEmbarazadas());
    }
  };

  // ======== GUARDAR CAMBIOS ========
  const guardarCambiosEmbarazada = () => {
    fetch(
      `https://mapeo-backend.vercel.app/embarazadas/${editandoEmbarazada.ID_Embarazada}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editandoEmbarazada),
      }
    ).then(() => {
      setEditandoEmbarazada(null);
      cargarEmbarazadas();
    });
  };

  const guardarCambiosDireccion = () => {
    fetch(
      `https://mapeo-backend.vercel.app/direcciones/${editandoDireccion.ID_Direccion}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editandoDireccion),
      }
    ).then(() => {
      setEditandoDireccion(null);
      cargarDirecciones();
    });
  };

  return (
    <div className="contenedor">
      {/* =============================== */}
      {/* TABLA COMBINADA */}
      {/* =============================== */}
      <div className="tabla-header">
        <h1 className="title">👩‍🍼 Embarazadas con Dirección</h1>
        <button
          className="toggle-btn"
          onClick={() => setMostrarTablaCombinada(!mostrarTablaCombinada)}
        >
          {mostrarTablaCombinada ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {mostrarTablaCombinada && (
        <table className="embarazada-table">
          <thead className="embarazada-thead">
            <tr className="embarazada-tr">
              <th className="embarazada-th">ID</th>
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
            {embarazadasConDireccion.map((e) => (
              <tr key={e.ID_Embarazada} className="embarazada-tr">
                <td className="embarazada-td" data-label="ID">{e.ID_Embarazada}</td>
                <td className="embarazada-td" data-label="Nombre">{e.Nombre}</td>
                <td className="embarazada-td" data-label="Edad">{e.Edad}</td>
                <td className="embarazada-td" data-label="Teléfono">{e.Telefono}</td>
                <td className="embarazada-td" data-label="Calle">{e.Calle}</td>
                <td className="embarazada-td" data-label="Ciudad">{e.Ciudad}</td>
                <td className="embarazada-td" data-label="Municipio">{e.Municipio}</td>
                <td className="embarazada-td" data-label="Departamento">{e.Departamento}</td>
                <td className="embarazada-td" data-label="Zona">{e.Zona || "-"}</td>
                <td className="embarazada-td" data-label="Avenida">{e.Avenida || "-"}</td>
                <td className="embarazada-td" data-label="Número Casa">{e.NumeroCasa || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* =============================== */}
      {/* TABLA DE EMBARAZADAS */}
      {/* =============================== */}
      <div className="tabla-header">
        <h1 className="title">Lista de Embarazadas</h1>
        <button
          className="toggle-btn"
          onClick={() => setMostrarTablaEmbarazadas(!mostrarTablaEmbarazadas)}
        >
          {mostrarTablaEmbarazadas ? "Ocultar" : "Mostrar"}
        </button>
      </div>

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
                <td className="embarazada-td" data-label="ID">{e.ID_Embarazada}</td>
                <td className="embarazada-td" data-label="Nombre">{e.Nombre}</td>
                <td className="embarazada-td" data-label="Edad">{e.Edad}</td>
                <td className="embarazada-td" data-label="Teléfono">{e.TELEFONO}</td>
                <td className="embarazada-td" data-label="ID Dirección">{e.ID_Direccion}</td>
                <td className="embarazada-td" data-label="Acciones">
                  <button
                    onClick={() => setEditandoEmbarazada(e)}
                    className="btn-editar"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarEmbarazada(e.ID_Embarazada)}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* =============================== */}
      {/* TABLA DE DIRECCIONES */}
      {/* =============================== */}
      <div className="tabla-header">
        <h1 className="title">Direcciones</h1>
        <button
          className="toggle-btn"
          onClick={() => setMostrarTablaDirecciones(!mostrarTablaDirecciones)}
        >
          {mostrarTablaDirecciones ? "Ocultar" : "Mostrar"}
        </button>
      </div>

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
              <th className="embarazada-th">Número Casa</th>
              <th className="embarazada-th">Acciones</th>
            </tr>
          </thead>
          <tbody className="embarazada-tbody">
            {direcciones.map((d) => (
              <tr key={d.ID_Direccion} className="embarazada-tr">
                <td className="embarazada-td" data-label="ID">{d.ID_Direccion}</td>
                <td className="embarazada-td" data-label="Calle">{d.Calle}</td>
                <td className="embarazada-td" data-label="Ciudad">{d.Ciudad}</td>
                <td className="embarazada-td" data-label="Municipio">{d.Municipio}</td>
                <td className="embarazada-td" data-label="Departamento">{d.Departamento}</td>
                <td className="embarazada-td" data-label="Zona">{d.Zona || "-"}</td>
                <td className="embarazada-td" data-label="Avenida">{d.Avenida || "-"}</td>
                <td className="embarazada-td" data-label="Número Casa">{d.NumeroCasa || "-"}</td>
                <td className="embarazada-td" data-label="Acciones">
                  <button
                    onClick={() => setEditandoDireccion(d)}
                    className="btn-editar"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* =============================== */}
      {/* MODAL DE EDICIÓN EMBARAZADA */}
      {/* =============================== */}
      {editandoEmbarazada && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-contenido">
              <h2>Editar Embarazada</h2>
              <label className="modal-label">Nombre:</label>
              <input
                className="modal-input"
                value={editandoEmbarazada.Nombre}
                onChange={(e) =>
                  setEditandoEmbarazada({
                    ...editandoEmbarazada,
                    Nombre: e.target.value,
                  })
                }
              />
              <label className="modal-label">Edad:</label>
              <input
                className="modal-input"
                value={editandoEmbarazada.Edad}
                onChange={(e) =>
                  setEditandoEmbarazada({
                    ...editandoEmbarazada,
                    Edad: e.target.value,
                  })
                }
              />
              <label className="modal-label">Teléfono:</label>
              <input
                className="modal-input"
                value={editandoEmbarazada.TELEFONO}
                onChange={(e) =>
                  setEditandoEmbarazada({
                    ...editandoEmbarazada,
                    TELEFONO: e.target.value,
                  })
                }
              />
              <div className="modal-actions">
                <button
                  className="modal-btn modal-btn-cancelar"
                  onClick={() => setEditandoEmbarazada(null)}
                >
                  Cancelar
                </button>
                <button
                  className="modal-btn modal-btn-guardar"
                  onClick={guardarCambiosEmbarazada}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =============================== */}
      {/* MODAL DE EDICIÓN DIRECCIÓN */}
      {/* =============================== */}
      {editandoDireccion && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-contenido">
              <h2>Editar Dirección</h2>
              <label className="modal-label">Calle:</label>
              <input
                className="modal-input"
                value={editandoDireccion.Calle}
                onChange={(e) =>
                  setEditandoDireccion({
                    ...editandoDireccion,
                    Calle: e.target.value,
                  })
                }
              />
              <label className="modal-label">Ciudad:</label>
              <input
                className="modal-input"
                value={editandoDireccion.Ciudad}
                onChange={(e) =>
                  setEditandoDireccion({
                    ...editandoDireccion,
                    Ciudad: e.target.value,
                  })
                }
              />
              <label className="modal-label">Municipio:</label>
              {/* 🔹 ComboBox de Municipio */}
              <select name="Municipio" className="modal-input" required>
                <option value="">Seleccione un municipio</option>
                {municipios.map((mun) => (
                  <option key={mun} value={mun}>
                    {mun}
                  </option>
                ))}
              </select>

              <label className="modal-label">Departamento:</label>
              <input
                className="modal-input"
                value={editandoDireccion.Departamento}
                onChange={(e) =>
                  setEditandoDireccion({
                    ...editandoDireccion,
                    Departamento: e.target.value,
                  })
                }
              />
              <label className="modal-label">Zona:</label>
              <input
                className="modal-input"
                value={editandoDireccion.Zona || ""}
                onChange={(e) =>
                  setEditandoDireccion({
                    ...editandoDireccion,
                    Zona: e.target.value,
                  })
                }
              />
              <label className="modal-label">Avenida:</label>
              <input
                className="modal-input"
                value={editandoDireccion.Avenida || ""}
                onChange={(e) =>
                  setEditandoDireccion({
                    ...editandoDireccion,
                    Avenida: e.target.value,
                  })
                }
              />
              <label className="modal-label">Número Casa:</label>
              <input
                className="modal-input"
                value={editandoDireccion.NumeroCasa || ""}
                onChange={(e) =>
                  setEditandoDireccion({
                    ...editandoDireccion,
                    NumeroCasa: e.target.value,
                  })
                }
              />

              <div className="modal-actions">
                <button
                  className="modal-btn modal-btn-cancelar"
                  onClick={() => setEditandoDireccion(null)}
                >
                  Cancelar
                </button>
                <button
                  className="modal-btn modal-btn-guardar"
                  onClick={guardarCambiosDireccion}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbarazadasPage;