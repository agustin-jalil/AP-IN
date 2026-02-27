# 🍎 Apple Stock Backend
> API REST profesional para gestión de inventario de productos Apple  
> Stack: NestJS · PostgreSQL · Prisma · pnpm · JWT

---

## 📁 Estructura del Proyecto

```
apple-stock-backend/
├── prisma/
│   ├── schema.prisma          # Modelos de base de datos
│   └── seed.ts                # Datos iniciales
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-access.guard.ts
│   │   │   └── jwt-refresh.guard.ts
│   │   ├── strategies/
│   │   │   ├── jwt-access.strategy.ts
│   │   │   └── jwt-refresh.strategy.ts
│   │   ├── interfaces/
│   │   │   └── jwt-payload.interface.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   ├── update-product.dto.ts
│   │   │   └── filter-products.dto.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── products.module.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/
│   │   │   └── response.interceptor.ts
│   │   └── middleware/
│   │       └── logging.middleware.ts
│   ├── config/
│   │   └── env.validation.ts
│   ├── app.module.ts
│   └── main.ts
├── frontend-integration/
│   └── api.ts                 # Cliente HTTP listo para React/Next.js
├── .env.example
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚡ Instalación Completa

### 1. Requisitos previos

```bash
# Node.js >= 18
node --version

# pnpm
npm install -g pnpm

# PostgreSQL corriendo localmente
```

### 2. Clonar e instalar dependencias

```bash
git clone <tu-repo>
cd apple-stock-backend

pnpm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
# Editá .env con tus datos reales
```

### 4. Configurar PostgreSQL y ejecutar migraciones

```bash
# Crear la base de datos (si no existe)
createdb apple_stock_db
# o desde psql:
# CREATE DATABASE apple_stock_db;

# Ejecutar migraciones
pnpm prisma migrate dev --name init

# Generar el cliente de Prisma
pnpm prisma:generate
```

### 5. Ejecutar el seed (datos iniciales)

```bash
pnpm prisma:seed
```

Crea:
- Usuario admin: `admin@applestock.com` / `Admin1234!`
- Usuario vendedor: `vendedor@applestock.com` / `Vendedor1234!`
- 8 productos de ejemplo
- 1 sucursal

### 6. Levantar el proyecto

```bash
# Desarrollo (con hot reload)
pnpm start:dev

# Producción
pnpm build
pnpm start:prod
```

La API estará disponible en: `http://localhost:3000/api/v1`

---

## 📦 Comandos pnpm Completos

```bash
# Instalar todo de cero
pnpm install

# Desarrollo
pnpm start:dev

# Build producción
pnpm build
pnpm start:prod

# Prisma
pnpm prisma migrate dev --name <nombre>    # Nueva migración
pnpm prisma migrate deploy                  # Migración en producción
pnpm prisma:generate                        # Regenerar cliente
pnpm prisma:studio                          # GUI de base de datos
pnpm prisma:seed                            # Datos iniciales
pnpm prisma db push                         # Sincronizar schema sin migración

# Linting
pnpm lint
pnpm format
```

---

## 🔌 Endpoints

### Auth
| Método | URL | Auth | Descripción |
|--------|-----|------|-------------|
| POST | `/api/v1/auth/register` | ❌ | Registrar usuario |
| POST | `/api/v1/auth/login` | ❌ | Iniciar sesión |
| POST | `/api/v1/auth/refresh` | refresh token | Renovar tokens |
| POST | `/api/v1/auth/logout` | ✅ access | Cerrar sesión |

### Products
| Método | URL | Auth | Rol | Descripción |
|--------|-----|------|-----|-------------|
| POST | `/api/v1/products` | ✅ | Cualquiera | Crear producto |
| GET | `/api/v1/products` | ✅ | Cualquiera | Listar con filtros |
| GET | `/api/v1/products/:id` | ✅ | Cualquiera | Obtener uno |
| PATCH | `/api/v1/products/:id` | ✅ | Cualquiera | Actualizar |
| DELETE | `/api/v1/products/:id` | ✅ | ADMIN | Eliminar |

---

## 📋 Ejemplos Request/Response

### POST /api/v1/auth/register

**Request:**
```json
{
  "email": "nuevo@email.com",
  "nombre": "María García",
  "password": "Segura1234!",
  "role": "VENDEDOR"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "nuevo@email.com",
      "nombre": "María García",
      "role": "VENDEDOR"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST /api/v1/auth/login

**Request:**
```json
{
  "email": "admin@applestock.com",
  "password": "Admin1234!"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "admin@applestock.com",
      "nombre": "Administrador",
      "role": "ADMIN"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

---

### POST /api/v1/auth/refresh

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

---

### POST /api/v1/products

**Headers:** `Authorization: Bearer <accessToken>`

**Request:**
```json
{
  "modelo": "iPhone 15 Pro Max",
  "categoria": "iPhone",
  "memoria": "256GB",
  "color": "Titanio Azul",
  "precio": 1399.99,
  "bateria": 100,
  "usado": false,
  "stock": 10
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-e5f6-...",
    "modelo": "iPhone 15 Pro Max",
    "categoria": "iPhone",
    "memoria": "256GB",
    "color": "Titanio Azul",
    "precio": "1399.99",
    "bateria": 100,
    "usado": false,
    "stock": 10,
    "proveedorId": null,
    "sucursalId": null,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### GET /api/v1/products?categoria=iPhone&stockDisponible=true&page=1&limit=5

**Headers:** `Authorization: Bearer <accessToken>`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "...",
        "modelo": "iPhone 15 Pro",
        "categoria": "iPhone",
        "memoria": "256GB",
        "color": "Titanio Negro",
        "precio": "1299.99",
        "bateria": 100,
        "usado": false,
        "stock": 15,
        "createdAt": "2025-01-10T08:00:00.000Z",
        "updatedAt": "2025-01-10T08:00:00.000Z"
      }
    ],
    "meta": {
      "total": 3,
      "page": 1,
      "limit": 5,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

### Filtros disponibles GET /products

```
?categoria=iPhone              # iPhone | iPad | Mac | Watch | AirPods | Accesorios
&modelo=iPhone 15              # Búsqueda parcial case-insensitive
&memoria=256GB
&color=Negro                   # Búsqueda parcial case-insensitive
&usado=false
&minPrice=500
&maxPrice=1500
&stockDisponible=true          # Solo productos con stock > 0
&page=1
&limit=10
```

---

### PATCH /api/v1/products/:id

**Request:**
```json
{
  "stock": 5,
  "precio": 1199.99
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "stock": 5,
    "precio": "1199.99",
    ...
  }
}
```

---

### DELETE /api/v1/products/:id (solo ADMIN)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "message": "Producto \"abc123\" eliminado correctamente"
  }
}
```

---

### Error response (ejemplo)

```json
{
  "success": false,
  "statusCode": 422,
  "message": "Error de validación",
  "errors": [
    "La categoría debe ser uno de: iPhone, iPad, Mac, Watch, AirPods, Accesorios",
    "El precio debe ser un número decimal válido"
  ],
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

---

## 🛡️ Seguridad JWT

El flujo es:
1. Login → recibe `accessToken` (15 min) + `refreshToken` (7 días)
2. Cada request → `Authorization: Bearer <accessToken>`
3. Al expirar el access → POST `/auth/refresh` con el `refreshToken` en el body
4. Obtenés nuevos tokens y seguís sin interrupciones

Los refresh tokens se **hashean con bcrypt** antes de guardarse en la DB, así aunque alguien robe la DB no puede usarlos.

---

## 🚀 Deploy en Producción

```bash
# 1. Variables de entorno (no commitear nunca el .env)
# Configurá en Railway, Render, DigitalOcean, etc.

# 2. Correr migraciones (nunca migrate dev en prod)
pnpm prisma migrate deploy

# 3. Build y arrancar
pnpm build
pnpm start:prod
```

### Docker (opcional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start:prod"]
```

---

## 🔮 Diseño Preparado Para Escalar

El schema de Prisma ya incluye las tablas base para:

- **Proveedores**: Tabla `Proveedor` con relación a `Producto`
- **Sucursales**: Tabla `Sucursal`, los productos pertenecen a una sucursal
- **Movimientos de stock**: Tabla `MovimientoStock` (ENTRADA, SALIDA, AJUSTE, TRANSFERENCIA)
- **Historial de cambios**: Tabla `HistorialProducto` para auditoría completa

Solo hace falta desarrollar los módulos correspondientes.

---

## 🔗 Integración con Frontend

Ver el archivo `frontend-integration/api.ts` para un cliente HTTP completo con:
- Auto-refresh de tokens
- TypeScript tipado
- Ejemplos con React Query
- Ejemplos con Next.js App Router
