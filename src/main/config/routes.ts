import { type Express, Router } from 'express';
import fg from 'fast-glob';

export default async (app: Express): Promise<void> => {
  const router = Router();
  app.use('/api', router);

  const files = fg.sync('**/src/main/routes/**routes.ts');

  await Promise.all(
    files.map(async file => {
      const module = await import(`../../../${file}`);
      const route = module.default;
      if (typeof route === 'function') {
        route(router);
      }
    })
  );
};
