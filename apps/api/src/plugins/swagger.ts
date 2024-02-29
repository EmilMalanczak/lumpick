import type { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fp from "fastify-plugin";

export default fp<FastifyDynamicSwaggerOptions>(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Fastify REST API",
        description: "Use JSON Schema & TypeScript for better DX",
        version: "0.1.0",
      },
      servers: [
        {
          url: "http://localhost",
        },
      ],
    },
    hideUntagged: true,
  });

  await fastify.register(swaggerUi);
});
