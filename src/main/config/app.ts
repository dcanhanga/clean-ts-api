import express from 'express';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';

const app = express();

async function startServer(): Promise<void> {
  try {
    setupMiddlewares(app);
    await setupRoutes(app);
  } catch (error) {
    console.error('Erro ao configurar rotas:', error);
  }
}
startServer().catch(error => {
  console.error('Erro ao iniciar o servidor:', error);
});

export default app;
