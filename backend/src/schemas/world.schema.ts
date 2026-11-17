import { z } from 'zod';

export const position3D = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

export const environmentSchema = z.object({
  temperature: z.number(),
  sunlight: z.number().min(0).max(100),
  waterLevel: z.number().min(0).max(100),
  timeOfDay: z.number().min(0).max(24),
  day: z.number().int().positive(),
});

export const simulationStateSchema = z.object({
  isRunning: z.boolean(),
  speed: z.number().positive(),
  currentTick: z.number().int().nonnegative(),
});

export const createWorldSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  dimensions: z.object({
    width: z.number().int().positive(),
    depth: z.number().int().positive(),
  }),
  environment: environmentSchema,
  organisms: z.array(z.any()), // General validation for entity payload
  simulation: simulationStateSchema,
});

export type CreateWorldInput = z.infer<typeof createWorldSchema>;
