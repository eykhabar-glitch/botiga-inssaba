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

test('GET / mostra un footer amb enllaç de contacte', async () => {
  const resposta = await fetch(`${base}/`);
  assert.equal(resposta.status, 200);
  const html = await resposta.text();
  assert.match(html, /<footer[^>]*class="peu-pagina"[\s\S]*<\/footer>/);
  assert.match(html, /mailto:contacte@botiga\.example\.com/);
  assert.match(html, /id="any-actual"/);
});

test('app.js calcula l’any actual amb JavaScript', async () => {
  const resposta = await fetch(`${base}/app.js`);
  assert.equal(resposta.status, 200);
  const script = await resposta.text();
  assert.match(script, /new Date\(\)\.getFullYear\(\)/);
});

test('styles.css defineix estils del footer', async () => {
  const resposta = await fetch(`${base}/styles.css`);
  assert.equal(resposta.status, 200);
  const css = await resposta.text();
  assert.match(css, /\.peu-pagina\s*\{/);
});
