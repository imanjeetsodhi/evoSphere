import Fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health.routes.js';
import { worldsRoutes } from './routes/worlds.routes.js';
import { logger } from './utils/logger.js';

export function buildApp() {
  const app = Fastify({
    logger: {
      level: 'info',
    },
  });

  // Enable CORS for frontend cross-origin requests
  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  // Mount health check at root
  app.register(healthRoutes);

  // Mount API endpoints under '/api'
  app.register(worldsRoutes, { prefix: '/api' });

  return app;
}
export default buildApp;
