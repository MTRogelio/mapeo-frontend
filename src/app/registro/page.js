app.post("/embarazadas", async (req, res) => {
  const {
    Nombre,
    DPI,
    Edad,
    Telefono,
    Calle,
    Ciudad,
    Municipio,
    Departamento,
    Zona,
    Avenida,
    NumeroCasa,
    Latitud,
    Longitud,
  } = req.body;

  // ====== VALIDACIONES BACKEND ======
  
  // Validar campos obligatorios
  if (!Nombre || !DPI || !Edad || !Telefono || !Calle || !Ciudad || 
      !Municipio || !Departamento || !NumeroCasa) {
    return res.status(400).json({ 
      error: "⚠ Todos los campos obligatorios deben estar completos" 
    });
  }

  // Validar DPI (13 dígitos)
  if (!/^\d{13}$/.test(DPI)) {
    return res.status(400).json({ 
      error: "⚠ El DPI debe tener exactamente 13 dígitos numéricos" 
    });
  }

  // Validar Teléfono (8 dígitos)
  if (!/^\d{8}$/.test(Telefono)) {
    return res.status(400).json({ 
      error: "⚠ El teléfono debe tener exactamente 8 dígitos numéricos" 
    });
  }

  // Validar Número de Casa (solo números)
  if (!/^\d+$/.test(NumeroCasa)) {
    return res.status(400).json({ 
      error: "⚠ El número de casa debe contener solo números" 
    });
  }

  try {
    const pool = getConnection();
    const transaction = pool.transaction();

    await transaction.begin();

    try {
      // ====== VERIFICAR DUPLICADOS ======
      
      // 1. Verificar DPI duplicado
      const checkDPI = await transaction
        .request()
        .input("DPI", DPI)
        .query("SELECT 1 FROM Embarazada WHERE DPI = @DPI");

      if (checkDPI.recordset.length > 0) {
        await transaction.rollback();
        return res.status(409).json({ 
          error: "⚠ Ya existe una embarazada registrada con ese DPI" 
        });
      }

      // 2. Verificar Teléfono duplicado
      const checkTelefono = await transaction
        .request()
        .input("Telefono", Telefono)
        .query("SELECT 1 FROM Embarazada WHERE Telefono = @Telefono");

      if (checkTelefono.recordset.length > 0) {
        await transaction.rollback();
        return res.status(409).json({ 
          error: "⚠ Ya existe una embarazada registrada con ese teléfono" 
        });
      }

      // 3. Verificar dirección duplicada (Nombre + NumeroCasa)
      const checkDireccion = await transaction
        .request()
        .input("Nombre", Nombre)
        .input("NumeroCasa", NumeroCasa)
        .query(`
          SELECT 1 FROM Embarazada e
          INNER JOIN Direccion d ON e.ID_Direccion = d.ID_Direccion
          WHERE e.Nombre = @Nombre AND d.NumeroCasa = @NumeroCasa
        `);

      if (checkDireccion.recordset.length > 0) {
        await transaction.rollback();
        return res.status(409).json({ 
          error: "⚠ Ya existe una embarazada con ese nombre y número de casa" 
        });
      }

      // ====== INSERTAR DIRECCIÓN ======
      const direccionResult = await transaction
        .request()
        .input("Calle", Calle)
        .input("Ciudad", Ciudad)
        .input("Municipio", Municipio)
        .input("Departamento", Departamento)
        .input("Zona", Zona || null)
        .input("Avenida", Avenida || null)
        .input("NumeroCasa", NumeroCasa)
        .input("Latitud", Latitud || null)
        .input("Longitud", Longitud || null)
        .query(`
          INSERT INTO Direccion (Calle, Ciudad, Municipio, Departamento, Zona, Avenida, NumeroCasa, Latitud, Longitud)
          OUTPUT INSERTED.ID_Direccion
          VALUES (@Calle, @Ciudad, @Municipio, @Departamento, @Zona, @Avenida, @NumeroCasa, @Latitud, @Longitud)
        `);

      const idDireccion = direccionResult.recordset[0].ID_Direccion;

      // ====== INSERTAR EMBARAZADA ======
      await transaction
        .request()
        .input("Nombre", Nombre)
        .input("DPI", DPI)
        .input("Edad", Edad)
        .input("Telefono", Telefono)
        .input("ID_Direccion", idDireccion)
        .query(`
          INSERT INTO Embarazada (Nombre, DPI, Edad, Telefono, ID_Direccion)
          VALUES (@Nombre, @DPI, @Edad, @Telefono, @ID_Direccion)
        `);

      // Confirmar transacción
      await transaction.commit();

      res.status(201).json({ 
        message: "✅ Embarazada registrada correctamente" 
      });

    } catch (err) {
      // Si hay error, deshacer todo
      await transaction.rollback();
      throw err;
    }

  } catch (err) {
    console.error("Error al registrar embarazada:", err);
    res.status(500).json({ 
      error: "⚠ Error interno del servidor: " + err.message 
    });
  }
});