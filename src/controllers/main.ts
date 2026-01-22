import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import type { ContextVariables } from "../constants";
import { API_PREFIX } from "../constants";
import { attachUserId, checkJWTAuth } from "../middlewares/auth";
import {
  ChatDBResource,
  MessageDBResource,
  UserDBResource,
} from "../storage/orm";
import {
  ChatD1Resource,
  MessageD1Resource,
  UserD1Resource,
} from "../storage/d1";
import { AUTH_PREFIX, createAuthApp } from "./auth";
import { CHAT_PREFIX, createChatApp } from "./chat";
import { cors } from "hono/cors";
import { rateLimitMiddleware } from "../middlewares/rateLimiting";
import { cacheMiddleware } from "../middlewares/cacheMiddleware";

export function createMainApp(
  authApp: Hono<ContextVariables>,
  chatApp: Hono<ContextVariables>,
) {
  const app = new Hono<ContextVariables>().basePath(API_PREFIX);

  // CORS configuration using env from context
  app.use("*", async (c, next) => {
    const { CORS_ORIGIN } = c.env as { CORS_ORIGIN?: string };
    const corsOptions = {
      origin: [CORS_ORIGIN || "*"],
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowHeaders: ["Content-Type", "Authorization"],
      maxAge: 86400,
    };
    return cors(corsOptions)(c, next);
  });
  app.use("*", timing());
  app.use("*", logger());
  app.use("*", checkJWTAuth);
  app.use("*", attachUserId);
  app.use("*", rateLimitMiddleware);
  app.use("*", cacheMiddleware());

  app.route(AUTH_PREFIX, authApp);
  app.route(CHAT_PREFIX, chatApp);

  showRoutes(app);
  return app;
}

export function createORMApp() {
  const prisma = new PrismaClient();
  prisma.$connect();
  return createMainApp(
    createAuthApp(new UserDBResource(prisma)),
    createChatApp(new ChatDBResource(prisma), new MessageDBResource(prisma)),
  );
}

// Cloudflare Workers D1 version
export function createD1App(db: any) {
  return createMainApp(
    createAuthApp(new UserD1Resource(db)),
    createChatApp(new ChatD1Resource(db), new MessageD1Resource(db)),
  );
}
