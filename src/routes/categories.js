import { Router } from 'express';

/**
 * Crea el router per consultar les categories de productes.
 *
 * @param {import('better-sqlite3').Database} db Connexió amb la base de dades.
 * @returns {import('express').Router} Router d'Express amb les rutes de categories.
 */
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
