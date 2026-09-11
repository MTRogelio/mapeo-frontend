# 🚀 Ejecutar el Frontend en Local

## Paso 1 — Desvincular de GitHub (sin borrar tu historial)

Abre la terminal en la carpeta del frontend y ejecuta:

```bash
# Ver a qué remoto estás conectado (probablemente "origin")
git remote -v

# Eliminar el remoto (esto NO borra tu código ni el historial local)
git remote remove origin

# Verificar que ya no hay remoto
git remote -v   # debe salir vacío
```

> ✅ Tu código sigue intacto localmente. Solo se desconecta de GitHub.
> Cuando quieras volver a conectarlo a otro repo, usa:
> `git remote add origin https://github.com/tuusuario/nuevo-repo.git`

---

## Paso 2 — Instalar dependencias

```bash
npm install
```

---

## Paso 3 — Asegurarte que el backend está corriendo

Antes de abrir el frontend, levanta el backend en otra terminal:

```bash
# En la carpeta del backend
node index.js
# Debes ver: ✅ Conectado a SQL Server LOCAL
#            🚀 Servidor corriendo en http://localhost:3001
```

---

## Paso 4 — Levantar el frontend

```bash
npm run dev
```

Abre el navegador en: **http://localhost:3000**

---

## Cómo funciona el proxy

El frontend corre en `localhost:3000`.
Cuando hace `fetch("/api/login")`, Next.js lo redirige automáticamente a:
`http://localhost:3001/login`

Esto está configurado en `next.config.mjs` — no necesitas tocar nada más.

---

## Credenciales de prueba

| Campo      | Valor     |
|------------|-----------|
| Usuario    | `admin`   |
| Contraseña | `admin123`|

(Creadas por el script SQL que ejecutaste en SSMS)

---

## Archivos modificados en esta entrega

| Archivo | Cambio |
|---------|--------|
| `src/app/page.js` | `/api/login` (era Vercel) |
| `src/app/ClientLayout.js` | `/api/check-session`, `/api/logout` |
| `src/app/mapa/page.js` | `/api/embarazadas-con-direccion` |
| `src/app/embarazadas/page.js` | Todas las rutas → `/api/...` |
| `src/app/direcciones/page.js` | Todas las rutas → `/api/...` |
| `src/app/usuarios/page.js` | Todas las rutas → `/api/...` |
| `src/app/riesgos/page.js` | Todas las rutas → `/api/...` |
| `src/app/seguimiento/page.js` | Variable `API = "/api"` |
| `src/app/ubicaciones/page.js` | Todas las rutas → `/api/...` (era Vercel + DigitalOcean) |
| `src/app/registro/page.js` | `/api/embarazadas` |
| `src/app/reportes/page.js` | `/api/embarazadas-con-direccion` |
| `next.config.mjs` | Proxy `/api/*` → `localhost:3001` |
| `.gitignore` | Protege `.next/`, `node_modules/`, `.env` |
