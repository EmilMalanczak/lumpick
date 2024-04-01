import type { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fp from "fastify-plugin";
import { generateOpenApiDocument } from "trpc-openapi";

import { appRouter } from "../root";

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Lumpik OpenAPI",
  version: "1.0.0",
  description: "OpenAPI compliant REST API built using tRPC with Fastify",
  baseUrl: "http://localhost:3000/api",
  tags: ["auth"],
  securitySchemes: {
    Bearer: {
      description: 'Authorization header token, sample: "Bearer ******"',
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
});

export const swaggerPlugin = fp<FastifyDynamicSwaggerOptions>(
  async (fastify) => {
    fastify.get("/openapi.json", () => openApiDocument);

    await fastify.register(swagger, {
      prefix: "/docs",
      mode: "static",
      specification: { document: openApiDocument },
    });

    await fastify.register(swaggerUi, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "list",
        deepLinking: false,
        displayOperationId: true,
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject) => swaggerObject,
      transformSpecificationClone: true,
    });
  },
);
