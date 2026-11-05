import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calcularEnviament,
  calcularResum,
  calcularTotal,
} from '../src/utils/carret.js';

test('calcula el total sense descompte', () => {
  const items = [
    { preu: 10, quantitat: 2 },
    { preu: 5.5, quantitat: 1 },
  ];
  assert.equal(calcularTotal(items), 25.5);
});

test('aplica un descompte percentual', () => {
  const items = [{ preu: 20, quantitat: 2 }];
  assert.equal(calcularTotal(items, 25), 30);
});

test('un carret buit val 0', () => {
  assert.equal(calcularTotal([]), 0);
});

test('llança un error si el descompte és fora de rang', () => {
  assert.throws(() => calcularTotal([], 120), RangeError);
});

test('calcula l’enviament per trams de pes i usa 0,5 kg per defecte', () => {
  assert.equal(calcularEnviament([{ quantitat: 2 }], 10), 3.9);
  assert.equal(calcularEnviament([{ quantitat: 3 }], 10), 5.9);
  assert.equal(calcularEnviament([{ quantitat: 11 }], 10), 9.9);
});

test('fa l’enviament gratuït amb un subtotal superior a 50 €', () => {
  assert.equal(calcularEnviament([{ quantitat: 20, pes: 10 }], 50.01), 0);
});

test('calcula el resum amb subtotal descomptat i total final', () => {
  assert.deepEqual(
    calcularResum([{ preu: 30, quantitat: 2, pes: 0.5 }], 10),
    { subtotal: 54, enviament: 0, total: 54 }
  );
});
