# 🎭 Teatro El Mega - Sistema de Asistencia
### Desarrollado por Jhon Sebastian Macías Bohórquez - Grado 11A
### © 2026 - Todos los derechos reservados

---

## ✅ CAMBIOS COMPLETADOS

### ✨ Eliminado completamente:
- ❌ Modo demostración local
- ❌ OAuth (Manus App)
- ❌ Dependencias de plataformas externas
- ❌ Archivos .local-demo-data.json

### ✨ Implementado:
- ✅ Sistema de autenticación con usuario y contraseña
- ✅ Base de datos MySQL
- ✅ Control de acceso por roles (Admin, Docente, Estudiante)
- ✅ CRUD completo de usuarios (solo admin)
- ✅ CRUD completo de estudiantes
- ✅ Sistema de asistencia
- ✅ Página de login con información del desarrollador
- ✅ Créditos en toda la aplicación

---

## 🚀 PASOS PARA EJECUTAR

### 1. Asegúrate de tener instalado:
- **Node.js** (v18 o superior)
- **MySQL** (v8.0 o superior)

### 2. Crear la base de datos

Abre MySQL y ejecuta:

```sql
CREATE DATABASE teatro_el_mega;
```

### 3. Configurar variables de entorno

El archivo `.env` ya está creado. Si usas root sin contraseña está listo. Si tienes contraseña, edita el archivo `.env`:

```env
DATABASE_URL=mysql://root:TU_CONTRASEÑA@localhost:3306/teatro_el_mega
JWT_SECRET=teatro-el-mega-secret-2026-change-in-production
PORT=3000
```

### 4. Instalar dependencias

```bash
npm install --legacy-peer-deps
```

### 5. Aplicar migraciones (crear tablas)

```bash
npm run db:push
```

Esto creará las tablas:
- `users` - Usuarios del sistema
- `students` - Estudiantes
- `attendanceSessions` - Sesiones de asistencia
- `attendanceRecords` - Registros de asistencia

### 6. Crear usuarios iniciales

```bash
npm run db:seed
```

Esto creará 3 usuarios:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |
| docente | docente123 | Docente |
| estudiante | estudiante123 | Estudiante |

### 7. Ejecutar la aplicación

```bash
npm run dev
```

### 8. Abrir en el navegador

```
http://localhost:3000
```

---

## 👤 CREDENCIALES DE ACCESO

Para probar el sistema:

**Administrador (acceso completo):**
- Usuario: `admin`
- Contraseña: `admin123`

**Docente (gestión de asistencia):**
- Usuario: `docente`
- Contraseña: `docente123`

**Estudiante (solo lectura):**
- Usuario: `estudiante`
- Contraseña: `estudiante123`

---

## 🎨 CARACTERÍSTICAS

### Página de Login
- ✅ Formulario de autenticación
- ✅ Botón para ver información del desarrollador
- ✅ Foto de perfil (iniciales)
- ✅ Descripción del proyecto
- ✅ Créditos © 2026

### Panel Principal
- ✅ Dashboard con estadísticas
- ✅ Gestión de estudiantes
- ✅ Registro de asistencia
- ✅ Reportes
- ✅ Footer con créditos del desarrollador

### Roles y Permisos

**Administrador:**
- CRUD completo de usuarios
- CRUD completo de estudiantes
- Gestionar sesiones de asistencia
- Ver todos los reportes

**Docente:**
- Ver estudiantes
- Crear sesiones de asistencia
- Registrar asistencia
- Ver reportes

**Estudiante:**
- Ver estadísticas básicas
- Ver sus propias asistencias

---

## 📁 ESTRUCTURA DEL PROYECTO

```
teatro-el-mega-asistencia/
├── client/               # Frontend React + TypeScript
│   └── src/
│       ├── pages/       # Páginas (Home con Login)
│       └── components/  # Componentes UI
├── server/              # Backend Node.js + Express
│   ├── auth.ts         # Autenticación y usuarios
│   ├── db.ts           # Operaciones de base de datos
│   ├── routers.ts      # Endpoints tRPC
│   └── seed.ts         # Script para crear usuarios
├── drizzle/            # Esquema de base de datos
│   └── schema.ts       # Definición de tablas
├── .env                # Variables de entorno
└── package.json        # Dependencias
```

---

## 🛠️ COMANDOS DISPONIBLES

```bash
npm run dev         # Iniciar servidor de desarrollo
npm run build       # Compilar para producción
npm start           # Ejecutar versión de producción
npm run check       # Verificar TypeScript
npm run test        # Ejecutar pruebas
npm run db:push     # Aplicar migraciones
npm run db:seed     # Crear usuarios iniciales
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "La base de datos no está disponible"
- Verifica que MySQL esté corriendo
- Verifica las credenciales en `.env`
- Asegúrate de haber creado la base de datos

### Error al instalar dependencias
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

### No puedo iniciar sesión
- Verifica que hayas ejecutado `npm run db:seed`
- Verifica que las tablas existan con `npm run db:push`

### El puerto 3000 está ocupado
- La aplicación buscará automáticamente el siguiente puerto disponible
- O cambia el puerto en `.env`: `PORT=3001`

---

## 📝 TECNOLOGÍAS UTILIZADAS

- **Frontend:** React 19, TypeScript, TailwindCSS
- **Backend:** Node.js, Express, tRPC
- **Base de datos:** MySQL con Drizzle ORM
- **Autenticación:** JWT (JSON Web Tokens)
- **Encriptación:** PBKDF2 para contraseñas

---

## 👨‍💻 DESARROLLADOR

**Jhon Sebastian Macías Bohórquez**
- Grado 11A
- Proyecto: Sistema de Asistencia - Teatro El Mega
- Año: 2026

---

## 📄 LICENCIA

© 2026 Teatro El Mega - Todos los derechos reservados

Este proyecto fue desarrollado como parte de un proyecto escolar de tecnología.

---

## 🎯 PRÓXIMOS PASOS

1. Cambia las contraseñas por defecto de los usuarios
2. Cambia el `JWT_SECRET` en producción
3. Agrega estudiantes desde el panel
4. Crea sesiones de asistencia
5. Registra la asistencia diaria

---

## 📞 SOPORTE

Si encuentras algún problema:
1. Revisa la sección "Solución de problemas"
2. Verifica que todos los pasos se ejecutaron correctamente
3. Asegúrate de tener las versiones correctas de Node.js y MySQL

---

**¡Listo para usar! 🎉**
