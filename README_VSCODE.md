# Teatro El Mega — Aplicación de asistencia

Aplicación web completa para gestionar usuarios, estudiantes, registrar asistencia y consultar reportes del proyecto **Teatro El Mega**.

## Abrir en Visual Studio Code

1. Descarga y descomprime la carpeta del proyecto.
2. Abre Visual Studio Code.
3. Selecciona **Archivo → Abrir carpeta**.
4. Elige la carpeta `teatro-el-mega-asistencia`.
5. Abre la terminal integrada.

## Instalar dependencias

```bash
npm install
```

## Configurar base de datos

### 1. Crear archivo .env

Copia el archivo de ejemplo y configúralo:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de MySQL:

```env
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/teatro_el_mega
JWT_SECRET=tu-secreto-super-seguro-cambialo-en-produccion
PORT=3000
```

### 2. Crear la base de datos

Crea una base de datos MySQL llamada `teatro_el_mega`:

```sql
CREATE DATABASE teatro_el_mega;
```

### 3. Aplicar migraciones

Genera y aplica las tablas de la base de datos:

```bash
npm run db:push
```

### 4. Crear usuarios iniciales

Ejecuta el script de inicialización para crear usuarios por defecto:

```bash
npm run db:seed
```

Esto creará tres usuarios:
- **Administrador**: `admin` / `admin123`
- **Docente**: `docente` / `docente123`
- **Estudiante**: `estudiante` / `estudiante123`

## Ejecutar la aplicación

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

## Roles y permisos

### Administrador
- CRUD completo de usuarios (crear, listar, actualizar, eliminar)
- CRUD completo de estudiantes
- Crear y gestionar sesiones de asistencia
- Registrar asistencia
- Ver reportes y estadísticas

### Docente
- Ver lista de estudiantes
- Crear y gestionar sesiones de asistencia
- Registrar asistencia
- Ver reportes y estadísticas

### Estudiante
- Ver sus propias asistencias
- Ver estadísticas básicas

## Comandos útiles

```bash
npm run dev        # iniciar servidor de desarrollo
npm run check      # comprobar TypeScript
npm run test       # ejecutar pruebas unitarias
npm run build      # crear la versión de producción
npm start          # ejecutar versión de producción
npm run db:push    # generar y aplicar migraciones
npm run db:seed    # crear usuarios iniciales
```

## Estructura principal

- `client/src/pages/Home.tsx`: interfaz del panel.
- `client/src/index.css`: estilos y tema visual.
- `server/routers.ts`: procedimientos tRPC y rutas de la API.
- `server/auth.ts`: autenticación y gestión de usuarios.
- `server/db.ts`: consultas y mutaciones de base de datos.
- `drizzle/schema.ts`: tablas del sistema.
- `drizzle/migrations/`: migraciones SQL.
- `server/*.test.ts`: pruebas unitarias.

## Funciones incluidas

- Sistema de autenticación con usuarios y contraseñas
- Control de acceso basado en roles (administrador, docente, estudiante)
- Panel con estadísticas
- CRUD completo de usuarios (solo administradores)
- Registro y gestión de estudiantes
- Creación de sesiones de asistencia
- Estados de asistencia: presente, ausente, tardanza y excusa
- Historial de actividades y reportes básicos
