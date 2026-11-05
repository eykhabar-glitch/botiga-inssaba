function validarDescompte(descompte) {
  if (descompte < 0 || descompte > 100) {
    throw new RangeError('El descompte ha de ser entre 0 i 100');
  }
}

function arrodonir(valor) {
  return Math.round(valor * 100) / 100;
}

/**
 * Calcula el subtotal del carret aplicant un descompte percentual.
 * @param {Array<{preu: number, quantitat: number}>} items
 * @param {number} descompte Percentatge entre 0 i 100.
 * @returns {number} Subtotal arrodonit a 2 decimals.
 * @throws {RangeError} Si el descompte és fora de rang.
 */
export function calcularSubtotal(items, descompte = 0) {
  validarDescompte(descompte);
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.preu * item.quantitat;
  }
  return arrodonir(subtotal * (1 - descompte / 100));
}

/**
 * Calcula el cost d'enviament segons les tarifes d'Enviaments Express.
 * @param {Array<{quantitat: number, pes?: number}>} items
 * @param {number} subtotal Subtotal després del descompte.
 * @returns {number} Cost d'enviament arrodonit a 2 decimals.
 */
export function calcularEnviament(items, subtotal) {
  if (subtotal > 50) {
    return 0;
  }

  const pesTotal = items.reduce(
    (total, item) => total + (item.pes ?? 0.5) * item.quantitat,
    0
  );
  if (pesTotal <= 1) {
    return 3.9;
  }
  if (pesTotal <= 5) {
    return 5.9;
  }
  return 9.9;
}

/**
 * Calcula el subtotal, l'enviament i el total final del carret.
 * @param {Array<{preu: number, quantitat: number, pes?: number}>} items
 * @param {number} descompte Percentatge entre 0 i 100.
 * @returns {{subtotal: number, enviament: number, total: number}}
 */
export function calcularResum(items, descompte = 0) {
  const subtotal = calcularSubtotal(items, descompte);
  const enviament = calcularEnviament(items, subtotal);
  return {
    subtotal,
    enviament,
    total: arrodonir(subtotal + enviament),
  };
}

/**
 * Calcula el total del carret aplicant un descompte percentual.
 * @param {Array<{preu: number, quantitat: number}>} items
 * @param {number} descompte Percentatge entre 0 i 100.
 * @returns {number} Total arrodonit a 2 decimals.
 * @throws {RangeError} Si el descompte és fora de rang.
 */
export function calcularTotal(items, descompte = 0) {
  return calcularSubtotal(items, descompte);
}
