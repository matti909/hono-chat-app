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
import { AUTH_PREFIX, createAuthApp } from "./auth";
import { CHAT_PREFIX, createChatApp } from "./chat";
import { cors } from "hono/cors";
import { rateLimitMiddleware } from "../middlewares/rateLimiting";

export function createMainApp(
  authApp: Hono<ContextVariables>,
  chatApp: Hono<ContextVariables>,
) {
  const app = new Hono<ContextVariables>().basePath(API_PREFIX);

  const corsOptions = {
    origin: [Bun.env.CORS_ORIGIN as string],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  };

  app.use("*", cors(corsOptions));
  app.use("*", timing());
  app.use("*", logger());
  app.use("*", checkJWTAuth);
  app.use("*", attachUserId);
  app.use("*", rateLimitMiddleware);

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
