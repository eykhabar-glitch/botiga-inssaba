import { Router } from 'express';

export function routerCategories(db) {
  const router = Router();

  // GET /api/categories
  router.get('/', (req, res) => {
    const categories = db
      .prepare(`
        SELECT categoria, COUNT(id) AS numProductes
        FROM productes
        GROUP BY categoria
        ORDER BY categoria
      `)
      .all();

    res.json(categories);
  });

  return router;
}
