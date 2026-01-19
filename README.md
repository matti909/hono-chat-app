# Chat App

Backend API para aplicación de chat construida con Bun y Hono.

## Tecnologías

| Tecnología | Versión |
|------------|---------|
| Bun | 1.x |
| Hono | ^4.6.20 |
| TypeScript | ^5 |
| Prisma | ^6.10.1 |
| PostgreSQL | latest |
| Zod | ^3.24.2 |
| Pino | ^9.6.0 |
| OpenAI SDK | ^5.8.2 |
| Axios | ^1.8.4 |

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db
JWT_SECRET=tu_secreto_jwt
CORS_ORIGIN=*
OPENAI_API_KEY=tu_api_key
```

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | Si |
| `JWT_SECRET` | Secreto para firmar tokens JWT | Si |
| `CORS_ORIGIN` | Origen permitido para CORS | Si |
| `OPENAI_API_KEY` | API Key de OpenAI | Si |

## Ejecución Local

### Requisitos
- [Bun](https://bun.sh/) instalado
- PostgreSQL corriendo localmente o remotamente

### Pasos

1. Instalar dependencias:
```sh
bun install
```

2. Configurar variables de entorno:
```sh
cp .env.example .env
# Editar .env con tus valores
```

3. Generar cliente Prisma y sincronizar base de datos:
```sh
bunx prisma generate --schema=src/prisma/schema.prisma
bunx prisma db push --schema=src/prisma/schema.prisma
```

> **Nota:** El schema de Prisma está en `src/prisma/schema.prisma`. Para evitar usar `--schema` en cada comando, agrega esto a tu `package.json`:
> ```json
> "prisma": {
>   "schema": "src/prisma/schema.prisma"
> }
> ```

4. Ejecutar en modo desarrollo:
```sh
bun run dev
```

La aplicación estará disponible en http://localhost:3000

## Ejecución con Docker Compose

### Requisitos
- Docker y Docker Compose instalados

### Pasos

1. Configurar variables de entorno (opcional, ya están definidas en docker-compose):
```sh
cp .env.example .env
```

2. Construir y ejecutar:
```sh
docker compose -f docker_compose_test.yml up --build
```

3. Para ejecutar en segundo plano:
```sh
docker compose -f docker_compose_test.yml up --build -d
```

4. Ver logs:
```sh
docker compose -f docker_compose_test.yml logs -f backend
```

5. Detener servicios:
```sh
docker compose -f docker_compose_test.yml down
```

6. Detener y eliminar volúmenes (borra datos de PostgreSQL):
```sh
docker compose -f docker_compose_test.yml down -v
```

### Servicios Docker

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `backend` | 3000 | API Hono |
| `postgres` | 5434 | Base de datos PostgreSQL |

## Scripts Disponibles

```sh
bun run dev    # Ejecuta en modo desarrollo con hot reload
```

## Estructura del Proyecto

```
├── src/
│   ├── index.ts           # Punto de entrada
│   ├── controllers/       # Controladores de rutas
│   ├── middlewares/       # Middlewares (auth, cache, rate limiting)
│   ├── integrations/      # Integraciones externas (OpenAI)
│   ├── storage/           # ORM y tipos de base de datos
│   ├── models/            # Modelos de datos
│   └── prisma/
│       └── schema.prisma  # Esquema de base de datos
├── Dockerfile
├── docker_compose_test.yml
└── package.json
```
