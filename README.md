# Chat App

Backend API para aplicación de chat construida con Hono. Soporta dos modos de despliegue:

- **Local**: Bun + PostgreSQL + Prisma
- **Cloudflare Workers**: D1 (SQLite) + Edge Runtime

## Tecnologías

| Tecnología | Local | Cloudflare |
|------------|-------|------------|
| Runtime | Bun | Cloudflare Workers |
| Framework | Hono | Hono |
| Base de datos | PostgreSQL | D1 (SQLite) |
| ORM | Prisma | D1 API nativa |
| Auth | bcryptjs + JWT | bcryptjs + JWT |

---

## Despliegue Local (Bun + PostgreSQL)

### Requisitos

- [Bun](https://bun.sh/) instalado
- PostgreSQL corriendo localmente o en Docker

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db
JWT_SECRET=tu_secreto_jwt
CORS_ORIGIN=*
ANTHROPIC_API_KEY=tu_api_key_de_anthropic
```

### Pasos

1. **Instalar dependencias:**
```bash
bun install
```

2. **Levantar PostgreSQL con Docker (opcional):**
```bash
docker compose -f docker_compose_test.yml up -d postgres
```

3. **Generar cliente Prisma y sincronizar base de datos:**
```bash
bunx prisma generate --schema=src/prisma/schema.prisma
bunx prisma db push --schema=src/prisma/schema.prisma
```

4. **Ejecutar en modo desarrollo:**
```bash
bun run dev
```

La aplicación estará disponible en http://localhost:3000

### Scripts Disponibles

```bash
bun run dev    # Ejecuta en modo desarrollo con hot reload
```

---

## Despliegue en Cloudflare Workers

### Requisitos

- Cuenta de [Cloudflare](https://cloudflare.com)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) instalado

### Pasos

#### 1. Instalar dependencias

```bash
bun install
```

#### 2. Autenticarse con Cloudflare

```bash
npx wrangler login
```

#### 3. Crear la base de datos D1

```bash
npx wrangler d1 create hono-chat-db
```

Esto devolverá un `database_id`. Actualiza el archivo `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "hono_chat_app",
      "database_name": "hono-chat-db",
      "database_id": "TU_DATABASE_ID_AQUI"
    }
  ]
}
```

#### 4. Ejecutar migraciones en D1

```bash
npx wrangler d1 execute hono-chat-db --file=./schema.sql --remote
```

#### 5. Configurar secretos

```bash
npx wrangler secret put JWT_SECRET
# Ingresa tu secreto JWT cuando se te solicite

npx wrangler secret put ANTHROPIC_API_KEY
# Ingresa tu API key de Anthropic cuando se te solicite
```

#### 6. Desplegar

```bash
npm run deploy
```

### Scripts de Cloudflare

```bash
npm run deploy    # Despliega a producción
npm run cf:dev    # Servidor de desarrollo local (simula Workers)
npm run cf:tail   # Ver logs en tiempo real
```

### Comandos útiles de D1

```bash
# Ver tablas
npx wrangler d1 execute hono-chat-db --command="SELECT name FROM sqlite_master WHERE type='table'" --remote

# Consultar usuarios
npx wrangler d1 execute hono-chat-db --command="SELECT * FROM users" --remote

# Ejecutar migraciones localmente
npx wrangler d1 execute hono-chat-db --file=./schema.sql --local
```

---

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/register/` | Registrar usuario |
| POST | `/api/v1/auth/login/` | Iniciar sesión |
| GET | `/api/v1/chat/` | Obtener chats del usuario |
| POST | `/api/v1/chat/` | Crear nuevo chat |
| GET | `/api/v1/chat/:id/` | Obtener detalle de chat |
| GET | `/api/v1/chat/:id/message/` | Obtener mensajes de chat |
| POST | `/api/v1/chat/:id/message/` | Enviar mensaje (integra con Claude) |

### Ejemplo de uso

```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Crear chat (requiere token)
curl -X POST http://localhost:3000/api/v1/chat/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Mi chat"}'
```

---

## Estructura del Proyecto

```
├── src/
│   ├── index.ts              # Entry point (Workers)
│   ├── constants.ts          # Constantes y tipos
│   ├── controllers/
│   │   ├── main.ts           # App principal
│   │   ├── auth.ts           # Autenticación
│   │   └── chat.ts           # Chat y mensajes
│   ├── middlewares/
│   │   ├── auth.ts           # JWT middleware
│   │   ├── cacheMiddleware.ts
│   │   └── rateLimiting.ts
│   ├── integrations/
│   │   ├── api.ts            # Claude API
│   │   ├── gpt.ts
│   │   └── generate_message.ts
│   ├── storage/
│   │   ├── orm.ts            # Prisma (local)
│   │   ├── d1.ts             # D1 (Cloudflare)
│   │   └── types.ts
│   ├── models/
│   │   └── db.ts
│   └── prisma/
│       └── schema.prisma
├── schema.sql                # Schema D1
├── wrangler.jsonc            # Config Cloudflare
├── docker_compose_test.yml
└── package.json
```

---

## Diferencias entre entornos

| Característica | Local (Bun) | Cloudflare Workers |
|----------------|-------------|-------------------|
| Base de datos | PostgreSQL | D1 (SQLite) |
| ORM | Prisma | SQL directo |
| Variables de entorno | `.env` | `wrangler secret` |
| Entry point | `createORMApp()` | `createD1App()` |
| Hashing passwords | bcryptjs | bcryptjs |

---

## Solución de Problemas

### Error: "no such table: users"

Ejecuta las migraciones:
```bash
# Local
bunx prisma db push --schema=src/prisma/schema.prisma

# Cloudflare
npx wrangler d1 execute hono-chat-db --file=./schema.sql --remote
```

### Error: "JWT_SECRET is not defined"

```bash
# Local: agregar a .env
JWT_SECRET=tu_secreto

# Cloudflare
npx wrangler secret put JWT_SECRET
```

### Error 500 en Cloudflare

Ver logs en tiempo real:
```bash
npm run cf:tail
```
