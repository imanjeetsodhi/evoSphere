import { buildApp } from './app.js';
import { env } from './config/env.js';

const app = buildApp();

const start = async () => {
  try {
    // Listen on 0.0.0.0 to enable sandbox network queries inside Docker or local VMs if needed
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`🚀 EvoSphere Backend API listening on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
