/**
 * Fastify Application Module
 * 
 * This module creates and configures the Fastify server instance.
 * The server is designed to be used via server.inject() from Next.js
 * API routes, keeping the deployment serverless-friendly for Vercel.
 */

import Fastify, { FastifyInstance } from 'fastify';

export interface HealthResponse {
  ok: boolean;
  timestamp: number;
  service: string;
  version: string;
}

/**
 * Creates and configures a Fastify server instance
 */
export async function createServer(): Promise<FastifyInstance> {
  const server = Fastify({
    logger: false,
  });

  server.get<{ Reply: HealthResponse }>('/health', async (request, reply) => {
    const response: HealthResponse = {
      ok: true,
      timestamp: Date.now(),
      service: 'pilar-backend',
      version: '1.0.0',
    };

    return reply.code(200).send(response);
  });

  return server;
}

let serverInstance: FastifyInstance | null = null;

/**
 * Gets or creates the Fastify server singleton
 */
export async function getServer(): Promise<FastifyInstance> {
  if (!serverInstance) {
    serverInstance = await createServer();
  }
  return serverInstance;
}
