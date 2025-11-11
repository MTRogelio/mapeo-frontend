import React, { useState, useEffect } from "react";
import "./Embarazadas.css"; // tu archivo CSS

const EmbarazadasPage = () => {
  // ============================
  // 📦 ESTADOS DE DATOS
  // ============================
  const [embarazadas, setEmbarazadas] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [embarazadasConDireccion, setEmbarazadasConDireccion] = useState([]);

  // ============================
  // ⚙️ ESTADOS DE MODALES
  // ============================
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalDireccion, setModalDireccion] = useState(false);
  const [registroActual, setRegistroActual] = useState(null);
  const [direccionActual, setDireccionActual] = useState(null);

  // ============================
  // 🔽 ESTADOS PARA DESPLEGAR TABLAS
  // ============================
  const [mostrarTablaCombinada, setMostrarTablaCombinada] = useState(false);
  const [mostrarTablaEmbarazadas, setMostrarTablaEmbarazadas] = useState(false);
  const [mostrarTablaDirecciones, setMostrarTablaDirecciones] = useState(false);

  // ============================
  // 🔄 CARGA DE DATOS
  // ============================
  const cargarEmbarazadas = () => {
    fetch("https://mapeo-backend.vercel.app/embarazadas")
      .then((res) => res.json())
      .then((data) => setEmbarazadas(data))
      .catch((err) => console.error(err));
  };

  const cargarDirecciones = () => {
    fetch("https://mapeo-backend.vercel.app/direcciones")
      .then((res) => res.json())
      .then((data) => setDirecciones(data))
      .catch((err) => console.error(err));
  };

  const cargarEmbarazadasConDireccion = () => {
    fetch("https://mapeo-backend.vercel.app/embarazadas-direcciones")
      .then((res) => res.json())
      .then((data) => setEmbarazadasConDireccion(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    cargarEmbarazadas();
    cargarDirecciones();
    cargarEmbarazadasConDireccion();
  }, []);

  // ============================
  // ✏️ FUNCIONES DE EDICIÓN
  // ============================
  const abrirModal = (embarazada) => {
    setRegistroActual(embarazada);
    setModalAbierto(true);
  };

  const abrirModalDireccion = (direccion) => {
    setDireccionActual(direccion);
    setModalDireccion(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setRegistroActual(null);
  };

  const cerrarModalDireccion = () => {
    setModalDireccion(false);
    setDireccionActual(null);
  };

  const guardarCambiosEmbarazada = () => {
    fetch(`https://mapeo-backend.vercel.app/embarazadas/${registroActual.ID_Embarazada}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registroActual),
    })
      .then(() => {
        cargarEmbarazadas();
        cerrarModal();
      })
      .catch((err) => console.error(err));
  };

  const guardarCambiosDireccion = () => {
    fetch(`https://mapeo-backend.vercel.app/direcciones/${direccionActual.ID_Direccion}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(direccionActual),
    })
      .then(() => {
        cargarDirecciones();
        cerrarModalDireccion();
      })
      .catch((err) => console.error(err));
  };

  // ============================
  // 🧱 RENDER
  // ============================
  return (
    <div className="embarazadas-page">
      {/* =============================== */}
      {/* TABLA COMBINADA */}
      {/* =============================== */}
      <div className="tabla-header">
        <h1 className="title">👩‍🍼 Embarazadas con Dirección</h1>
        <button
          className="toggle-btn"
          onClick={() => setMostrarTablaCombinada(!mostrarTablaCombinada)}
        >
          {mostrarTablaCombinada ? "Ocultar datos" : "Mostrar datos"}
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

      {/* =============================== */}
      {/* TABLA DE EMBARAZADAS */}
      {/* =============================== */}
      <div className="tabla-header">
        <h1 className="title">Lista de Embarazadas</h1>
        <button
          className="toggle-btn"
          onClick={() => setMostrarTablaEmbarazadas(!mostrarTablaEmbarazadas)}
        >
          {mostrarTablaEmbarazadas ? "Ocultar datos" : "Mostrar datos"}
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
              <th className="embarazada-th">Acciones</th>
            </tr>
          </thead>
          <tbody className="embarazada-tbody">
            {embarazadas.map((e) => (
              <tr key={e.ID_Embarazada} className="embarazada-tr">
                <td className="embarazada-td" data-label="ID">{e.ID_Embarazada}</td>
                <td className="embarazada-td" data-label="Nombre">{e.Nombre}</td>
                <td className="embarazada-td" data-label="Edad">{e.Edad}</td>
                <td className="embarazada-td" data-label="Teléfono">{e.Telefono}</td>
                <td className="embarazada-td" data-label="Acciones">
                  <button className="btn-editar" onClick={() => abrirModal(e)}>Editar</button>
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
        <h1 className="title">Lista de Direcciones</h1>
        <button
          className="toggle-btn"
          onClick={() => setMostrarTablaDirecciones(!mostrarTablaDirecciones)}
        >
          {mostrarTablaDirecciones ? "Ocultar datos" : "Mostrar datos"}
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
                <td className="embarazada-td" data-label="Acciones">
                  <button className="btn-editar" onClick={() => abrirModalDireccion(d)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* =============================== */}
      {/* MODAL EMBARAZADA */}
      {/* =============================== */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-contenido">
              <h2>Editar Embarazada</h2>
              <label className="modal-label">Nombre:</label>
              <input
                className="modal-input"
                value={registroActual.Nombre}
                onChange={(e) =>
                  setRegistroActual({ ...registroActual, Nombre: e.target.value })
                }
              />
              <label className="modal-label">Edad:</label>
              <input
                className="modal-input"
                value={registroActual.Edad}
                onChange={(e) =>
                  setRegistroActual({ ...registroActual, Edad: e.target.value })
                }
              />
              <label className="modal-label">Teléfono:</label>
              <input
                className="modal-input"
                value={registroActual.Telefono}
                onChange={(e) =>
                  setRegistroActual({ ...registroActual, Telefono: e.target.value })
                }
              />
              <div className="modal-actions">
                <button className="modal-btn modal-btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button className="modal-btn modal-btn-guardar" onClick={guardarCambiosEmbarazada}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =============================== */}
      {/* MODAL DIRECCIÓN */}
      {/* =============================== */}
      {modalDireccion && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-contenido">
              <h2>Editar Dirección</h2>
              <label className="modal-label">Calle:</label>
              <input
                className="modal-input"
                value={direccionActual.Calle}
                onChange={(e) =>
                  setDireccionActual({ ...direccionActual, Calle: e.target.value })
                }
              />
              <label className="modal-label">Ciudad:</label>
              <input
                className="modal-input"
                value={direccionActual.Ciudad}
                onChange={(e) =>
                  setDireccionActual({ ...direccionActual, Ciudad: e.target.value })
                }
              />
              <label className="modal-label">Municipio:</label>
              <input
                className="modal-input"
                value={direccionActual.Municipio}
                onChange={(e) =>
                  setDireccionActual({ ...direccionActual, Municipio: e.target.value })
                }
              />
              <label className="modal-label">Departamento:</label>
              <input
                className="modal-input"
                value={direccionActual.Departamento}
                onChange={(e) =>
                  setDireccionActual({ ...direccionActual, Departamento: e.target.value })
                }
              />
              <div className="modal-actions">
                <button
                  className="modal-btn modal-btn-cancelar"
                  onClick={cerrarModalDireccion}
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
