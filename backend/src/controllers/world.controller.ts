import { FastifyReply, FastifyRequest } from 'fastify';
import { WorldService } from '../services/world.service.js';
import { createWorldSchema } from '../schemas/world.schema.js';
import { World } from '../types/index.js';

export class WorldController {
  private service: WorldService;

  constructor(service: WorldService) {
    this.service = service;
  }

  async getAllWorlds(request: FastifyRequest, reply: FastifyReply) {
    try {
      const worlds = await this.service.getAllWorlds();
      return reply.status(200).send(worlds);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async getWorldById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const world = await this.service.getWorldById(id);

      if (!world) {
        return reply.status(404).send({ error: 'World not found' });
      }

      return reply.status(200).send(world);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async createWorld(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parseResult = createWorldSchema.safeParse(request.body);

      if (!parseResult.success) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Validation failed',
          details: parseResult.error.format(),
        });
      }

      const created = await this.service.createWorld(parseResult.data as World);
      return reply.status(201).send(created);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
