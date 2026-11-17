import { FastifyInstance } from 'fastify';
import { WorldController } from '../controllers/world.controller.js';
import { WorldService } from '../services/world.service.js';
import { inMemoryWorldRepository } from '../repositories/inMemoryWorld.repository.js';

const service = new WorldService(inMemoryWorldRepository);
const controller = new WorldController(service);

export async function worldsRoutes(fastify: FastifyInstance) {
  // Routes will be registered under '/api' prefix in app.ts
  fastify.get('/worlds', controller.getAllWorlds.bind(controller));
  fastify.get('/worlds/:id', controller.getWorldById.bind(controller));
  fastify.post('/worlds', controller.createWorld.bind(controller));
}
