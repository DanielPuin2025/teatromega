# Guía de configuración - Teatro El Mega

## ✅ Cambios realizados

Se ha eliminado completamente el modo demostración y se ha implementado un sistema de autenticación completo con base de datos MySQL.

## 📋 Pasos para ejecutar el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar la base de datos

#### Crear la base de datos en MySQL:

```sql
CREATE DATABASE teatro_el_mega;
```

#### Crear archivo .env en la raíz del proyecto:

```env
DATABASE_URL=mysql://root:tu_contraseña@localhost:3306/teatro_el_mega
JWT_SECRET=cambia-este-secreto-por-algo-seguro
PORT=3000
```

### 3. Aplicar migraciones

```bash
npm run db:push
```

Este comando creará todas las tablas necesarias:
- users (usuarios del sistema)
- students (estudiantes)
- attendanceSessions (sesiones de asistencia)
- attendanceRecords (registros de asistencia)

### 4. Crear usuarios iniciales

```bash
npm run db:seed
```

Este comando creará tres usuarios por defecto:

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | Administrador |
| docente | docente123 | Docente |
| estudiante | estudiante123 | Estudiante |

### 5. Ejecutar la aplicación

```bash
npm run dev
```

Abre tu navegador en: http://localhost:3000

## 🔐 Roles y permisos

### Administrador
- ✅ Gestión completa de usuarios (CRUD)
- ✅ Gestión completa de estudiantes (CRUD)
- ✅ Crear sesiones de asistencia
- ✅ Registrar asistencia
- ✅ Ver reportes y estadísticas

### Docente
- ✅ Ver lista de estudiantes
- ✅ Crear sesiones de asistencia
- ✅ Registrar asistencia
- ✅ Ver reportes y estadísticas

### Estudiante
- ✅ Ver sus propias asistencias
- ✅ Ver estadísticas básicas

## 📦 Nuevos endpoints de API

### Autenticación
- `auth.login` - Iniciar sesión
- `auth.logout` - Cerrar sesión
- `auth.me` - Obtener usuario actual

### Usuarios (solo admin)
- `users.list` - Listar usuarios
- `users.create` - Crear usuario
- `users.update` - Actualizar usuario
- `users.delete` - Eliminar usuario

### Estudiantes
- `students.list` - Listar estudiantes
- `students.create` - Crear estudiante
- `students.update` - Actualizar estudiante
- `students.delete` - Eliminar estudiante (solo admin)

### Asistencia
- `attendance.sessions` - Listar sesiones
- `attendance.records` - Ver registros de una sesión
- `attendance.createSession` - Crear nueva sesión
- `attendance.updateRecord` - Actualizar estado de asistencia

## 🔧 Comandos disponibles

```bash
npm run dev         # Iniciar servidor de desarrollo
npm run build       # Compilar para producción
npm start           # Ejecutar versión de producción
npm run check       # Verificar TypeScript
npm run test        # Ejecutar pruebas
npm run db:push     # Aplicar migraciones a la base de datos
npm run db:seed     # Crear usuarios iniciales
```

## 🗂️ Archivos modificados/creados

### Nuevos archivos:
- `server/auth.ts` - Lógica de autenticación y gestión de usuarios
- `server/_core/jwt.ts` - Generación y verificación de tokens JWT
- `server/seed.ts` - Script para crear usuarios iniciales
- `.env.example` - Plantilla de variables de entorno

### Modificados:
- `drizzle/schema.ts` - Actualizado esquema de usuarios
- `server/db.ts` - Eliminado modo demostración
- `server/routers.ts` - Agregados endpoints de autenticación y usuarios
- `server/_core/context.ts` - Autenticación JWT en lugar de OAuth
- `server/_core/index.ts` - Eliminadas rutas OAuth
- `package.json` - Actualizado script dev y agregado db:seed
- `README_VSCODE.md` - Actualizada documentación

### Eliminados:
- Todas las referencias a `LOCAL_DEMO`
- Todas las referencias a OAuth
- Archivo `.local-demo-data.json` (ya no se usa)

## ⚠️ Notas importantes

1. **Cambiar JWT_SECRET**: En producción, usa un secreto fuerte y único
2. **Credenciales por defecto**: Cambia las contraseñas de los usuarios creados por el seed
3. **Base de datos**: Asegúrate de tener MySQL instalado y corriendo
4. **Puerto**: Si el puerto 3000 está ocupado, la app usará el siguiente disponible

## 🐛 Troubleshooting

### Error: "La base de datos no está disponible"
- Verifica que MySQL esté corriendo
- Verifica las credenciales en el archivo .env
- Asegúrate de haber creado la base de datos

### Error de npm install
- Intenta eliminar `node_modules` y ejecutar `npm install` nuevamente
- Verifica tu versión de Node.js (debe ser v18 o superior)

### No puedo iniciar sesión
- Verifica que hayas ejecutado `npm run db:seed`
- Verifica que las tablas se hayan creado con `npm run db:push`
