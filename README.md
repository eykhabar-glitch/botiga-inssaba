# Botiga Copilot

Botiga en línia d’exemple, amb un frontend estàtic i una API Express per
consultar productes, categories i ressenyes, i calcular el resum del carret.
Les dades es carreguen en una base de dades SQLite en memòria cada vegada que
s’inicia el servidor.

## Requisits

- Node.js 22.13 o superior (recomanat: Node.js 24 LTS).

## API

Per defecte, l’API està disponible a `http://localhost:3000`.

### Productes

#### `GET /api/productes`

Retorna una llista JSON de productes. Cada producte inclou les seves dades i
els camps calculats `mitjana` (puntuació mitjana, o `null` si no té ressenyes)
i `numRessenyes`.

Paràmetres de consulta opcionals:

- `categoria`: filtra els productes per categoria, per exemple
  `/api/productes?categoria=roba`.

#### `GET /api/productes/:id`

Retorna en format JSON el producte amb l’identificador indicat. Si no existeix,
retorna l’estat `404` i `{ "error": "Producte no trobat" }`.

### Categories

#### `GET /api/categories`

Retorna una llista JSON ordenada per categoria. Cada element té aquest format:

```json
{
  "categoria": "roba",
  "numProductes": 2
}
```

### Ressenyes

#### `GET /api/ressenyes?producteId=:id`

Retorna una llista JSON amb les ressenyes del producte indicat per
`producteId`, ordenades de més nova a més antiga.

#### `POST /api/ressenyes`

Crea una ressenya. Cal enviar una petició JSON amb `producteId`, `autor`,
`text` i `puntuacio`:

```json
{
  "producteId": 1,
  "autor": "Marta",
  "text": "Molt còmoda i de bona qualitat.",
  "puntuacio": 5
}
```

Retorna l’estat `201` i l’identificador assignat:

```json
{
  "id": 4
}
```

### Carret

#### `POST /api/carret/total`

Calcula el subtotal, el cost d’enviament i el total final. Cal enviar una
petició JSON amb `items`, una llista d’elements amb `preu` i `quantitat`; cada
element pot incloure també `pes`. El camp `descompte` és opcional i és un
percentatge entre 0 i 100.

```json
{
  "items": [
    { "preu": 10, "quantitat": 3, "pes": 0.5 }
  ],
  "descompte": 10
}
```

La resposta JSON té aquest format:

```json
{
  "subtotal": 27,
  "enviament": 5.9,
  "total": 32.9
}
```

Si el descompte no és vàlid, retorna l’estat `400` i un objecte amb el camp
`error`.

## Instal·lació i execució

1. Instal·la les dependències:

   ```bash
   npm install
   ```

2. Inicia el servidor:

   ```bash
   npm start
   ```

3. Obre <http://localhost:3000> al navegador.

Per canviar el port, defineix la variable d’entorn `PORT` abans d’executar
`npm start`.

## Tests

Executa tota la suite de proves amb:

```bash
npm test
```

Les proves s’executen amb el runner de tests integrat de Node.js.
