# 🎭 Teatro El Mega - Sistema de Asistencia

Sistema web de gestión de asistencia escolar desarrollado para el proyecto Teatro El Mega.

## 🚀 Características

- ✅ Sistema de autenticación con JWT
- ✅ Gestión de estudiantes multi-grado (6° a 11°)
- ✅ Registro de asistencia por sesiones
- ✅ Reportes y estadísticas
- ✅ Control de acceso por roles (Admin, Docente, Estudiante)
- ✅ Interfaz moderna y responsive

## 🛠️ Tecnologías

- **Frontend:** React 19, TypeScript, TailwindCSS
- **Backend:** Node.js, Express, tRPC
- **Base de datos:** MySQL
- **ORM:** Drizzle
- **Autenticación:** JWT

## 📋 Requisitos

- Node.js 18 o superior
- MySQL 8.0 o superior
- npm o yarn

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/DanielPuin2025/teatromega.git
cd teatromega
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/teatro_el_mega
JWT_SECRET=tu-secreto-seguro-aqui
PORT=3000
```

### 4. Crear la base de datos

```sql
CREATE DATABASE teatro_el_mega;
```

### 5. Ejecutar migraciones

```bash
npm run db:push
```

### 6. Crear usuarios iniciales

```bash
npm run db:seed
```

### 7. Iniciar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔑 Credenciales por defecto

- **Admin:** `admin` / `admin123`
- **Docente:** `docente` / `docente123`
- **Estudiante:** `estudiante` / `estudiante123`

⚠️ **Importante:** Cambia estas contraseñas en producción.

## 📦 Despliegue

### Variables de entorno para producción

```env
NODE_ENV=production
DATABASE_URL=mysql://usuario:contraseña@host:puerto/base_de_datos
JWT_SECRET=secreto-muy-seguro-de-produccion
PORT=3000
```

### Compilar para producción

```bash
npm run build
npm start
```

## 👨‍💻 Desarrollador

**Jhon Sebastian Macías Bohórquez**
- Grado 11A
- Año: 2026

## 📄 Licencia

© 2026 Teatro El Mega - Todos los derechos reservados

---

**Dominio:** teatromega.programamega.com
