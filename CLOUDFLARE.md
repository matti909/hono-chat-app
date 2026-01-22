# Despliegue a Cloudflare Workers

Esta guía explica cómo desplegar la aplicación de chat en Cloudflare Workers con D1 (SQLite).

## Requisitos

- Cuenta de Cloudflare
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) instalado
- Node.js o Bun instalado

## Pasos para el Despliegue

### 1. Instalar dependencias

```bash
bun install
```

### 2. Autenticarse con Cloudflare

```bash
npx wrangler login
```

### 3. Crear la base de datos D1

```bash
npx wrangler d1 create hono-chat-db
```

Este comando devolverá un `database_id`. Cópialo y pégalo en `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "hono-chat-db"
database_id = "TU_DATABASE_ID_AQUI"
```

### 4. Ejecutar las migraciones

```bash
npx wrangler d1 execute hono-chat-db --file=./schema.sql
```

### 5. Configurar secretos

Configura las variables secretas necesarias:

```bash
npx wrangler secret put JWT_SECRET
# Ingresa tu secreto JWT cuando se te solicite

npx wrangler secret put ANTHROPIC_API_KEY
# Ingresa tu API key de Anthropic cuando se te solicite
```

### 6. Probar localmente

```bash
npm run cf:dev
```

Esto iniciará un servidor de desarrollo local que simula el entorno de Cloudflare Workers.

### 7. Desplegar a producción

```bash
npm run deploy
```

## Variables de Entorno

| Variable | Descripción | Cómo configurar |
|----------|-------------|-----------------|
| `DB` | Binding de D1 Database | Configurado en `wrangler.toml` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | `wrangler secret put JWT_SECRET` |
| `ANTHROPIC_API_KEY` | API Key de Anthropic | `wrangler secret put ANTHROPIC_API_KEY` |
| `CORS_ORIGIN` | Origen permitido para CORS | Configurado en `wrangler.toml` (vars) |

## Comandos Útiles

```bash
# Ver logs en tiempo real
npm run cf:tail

# Ejecutar migraciones en producción
npx wrangler d1 execute hono-chat-db --file=./schema.sql --remote

# Ver información de la base de datos
npx wrangler d1 info hono-chat-db

# Consultar la base de datos
npx wrangler d1 execute hono-chat-db --command="SELECT * FROM users"
npx wrangler d1 execute hono-chat-db --command="SELECT * FROM users" --remote
```

## Diferencias con la Versión Bun

Esta rama (`cloudflare-workers`) tiene las siguientes adaptaciones:

1. **Base de datos**: Usa D1 (SQLite) en lugar de PostgreSQL con Prisma
2. **Autenticación**: Usa `bcryptjs` en lugar de `Bun.password`
3. **Variables de entorno**: Usa `c.env` de Hono en lugar de `Bun.env`
4. **Entry point**: `src/index.ts` exporta un Worker compatible con CF

## Limitaciones de Cloudflare Workers

- **CPU Time**: Máximo 50ms por request (puede extenderse a 30s en planes pagos)
- **Memory**: Máximo 128MB
- **Database**: D1 tiene límites de consultas/día según el plan
- **Cold starts**: Puede haber latencia inicial

## Solución de Problemas

### Error: "Database not found"

Verifica que el `database_id` en `wrangler.toml` sea correcto y que la base de datos exista:

```bash
npx wrangler d1 list
```

### Error: "JWT_SECRET is not defined"

Asegúrate de haber configurado el secreto:

```bash
npx wrangler secret put JWT_SECRET
```

### Error: "Table does not exist"

Ejecuta las migraciones:

```bash
npx wrangler d1 execute hono-chat-db --file=./schema.sql --remote
```

## Recursos

- [Documentación de Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Documentación de D1](https://developers.cloudflare.com/d1/)
- [Documentación de Hono](https://hono.dev/)
