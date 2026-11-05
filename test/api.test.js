import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { crearApp } from '../src/app.js';
import { crearBaseDades } from '../src/db.js';

let servidor;
let base;

before(() => {
  servidor = crearApp(crearBaseDades()).listen(0);
  base = `http://localhost:${servidor.address().port}`;
});

after(() => servidor.close());

test('GET /api/productes retorna tots els productes', async () => {
  const resposta = await fetch(`${base}/api/productes`);
  assert.equal(resposta.status, 200);
  const productes = await resposta.json();
  assert.equal(productes.length, 6);

  const ambRessenyes = productes.find((p) => p.id === 1);
  assert.equal(ambRessenyes.mitjana, 4);
  assert.equal(ambRessenyes.numRessenyes, 2);

  const senseRessenyes = productes.find((p) => p.id === 2);
  assert.equal(senseRessenyes.mitjana, null);
  assert.equal(senseRessenyes.numRessenyes, 0);
});

test('GET /api/productes?categoria=roba filtra per categoria', async () => {
  const resposta = await fetch(`${base}/api/productes?categoria=roba`);
  const productes = await resposta.json();
  assert.ok(productes.every((p) => p.categoria === 'roba'));
  assert.ok(productes.every((p) => 'mitjana' in p && 'numRessenyes' in p));
});

test('GET /api/productes/:id retorna 404 si no existeix', async () => {
  const resposta = await fetch(`${base}/api/productes/999`);
  assert.equal(resposta.status, 404);
});

test('GET /api/categories retorna les categories amb el nombre de productes', async () => {
  const resposta = await fetch(`${base}/api/categories`);
  assert.equal(resposta.status, 200);
  assert.equal(resposta.headers.get('content-type'), 'application/json; charset=utf-8');

  const categories = await resposta.json();
  assert.deepEqual(categories, [
    { categoria: 'casa', numProductes: 2 },
    { categoria: 'papereria', numProductes: 2 },
    { categoria: 'roba', numProductes: 2 },
  ]);
});

test('GET /api/categories retorna una llista JSON', async () => {
  const resposta = await fetch(`${base}/api/categories`);
  const categories = await resposta.json();

  assert.ok(Array.isArray(categories));
  assert.ok(categories.every((categoria) => (
    typeof categoria.categoria === 'string'
    && Number.isInteger(categoria.numProductes)
  )));
});

test('POST /api/carret/total retorna el resum amb l’enviament', async () => {
  const resposta = await fetch(`${base}/api/carret/total`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ preu: 10, quantitat: 3 }],
      descompte: 10,
    }),
  });

  assert.equal(resposta.status, 200);
  assert.deepEqual(await resposta.json(), {
    subtotal: 27,
    enviament: 5.9,
    total: 32.9,
  });
});
