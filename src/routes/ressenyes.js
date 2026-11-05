import { Router } from 'express';

/**
 * Crea el router per gestionar les ressenyes dels productes.
 *
 * @param {import('better-sqlite3').Database} db Connexió amb la base de dades.
 * @returns {import('express').Router} Router d'Express per a les ressenyes.
 */
export function routerRessenyes(db) {
  const router = Router();

  // GET /api/ressenyes?producteId=1
  router.get('/', (req, res) => {
    const ressenyes = db
      .prepare('SELECT * FROM ressenyes WHERE producte_id = ? ORDER BY id DESC')
      .all(Number(req.query.producteId));
    res.json(ressenyes);
  });

  // POST /api/ressenyes
  router.post('/', (req, res) => {
    const { producteId, autor, text, puntuacio } = req.body;
    const resultat = db
      .prepare(
        'INSERT INTO ressenyes (producte_id, autor, text, puntuacio) VALUES (?, ?, ?, ?)'
      )
      .run(producteId, autor, text, puntuacio);
    res.status(201).json({ id: Number(resultat.lastInsertRowid) });
  });

  return router;
}
