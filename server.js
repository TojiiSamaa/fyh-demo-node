// API de démo « Bibliothèque » : aucune dépendance, écoute sur PORT (fourni par le panel).
const http = require('http');

const livres = [
  { id: 1, titre: 'Les Chemins du vent', auteur: 'Claire Morel', annee: 2019, dispo: true },
  { id: 2, titre: 'Le Jardin de cuivre', auteur: 'Hugo Lambert', annee: 2021, dispo: false },
  { id: 3, titre: 'Nuit sur la lagune', auteur: 'Inès Garnier', annee: 2017, dispo: true },
  { id: 4, titre: 'La Carte des marées', auteur: 'Paul Renaud', annee: 2023, dispo: true },
];
const demarre = new Date();

const json = (res, code, data) => {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const m = url.pathname.match(/^\/api\/livres\/(\d+)$/);
    if (url.pathname === '/api/livres') return json(res, 200, livres);
    if (m) {
      const livre = livres.find((l) => l.id === Number(m[1]));
      return livre ? json(res, 200, livre) : json(res, 404, { erreur: 'Livre introuvable' });
    }
    if (url.pathname === '/sante') return json(res, 200, { ok: true, version: 'v1', depuis: demarre });
    if (url.pathname === '/') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return res.end(`<!doctype html><meta charset="utf-8"><title>Bibliothèque (démo)</title>
<body style="font-family:system-ui,sans-serif;max-width:860px;margin:40px auto;padding:0 16px">
<h1>Bibliothèque — API de démo</h1><p style="color:#666">Site de test Node pour ForYouHost · v1 · démarré le ${demarre.toLocaleString('fr-FR')}</p>
<ul><li><a href="/api/livres">/api/livres</a></li><li><a href="/api/livres/1">/api/livres/1</a></li><li><a href="/sante">/sante</a></li></ul>
<ul>${livres.map((l) => `<li>${l.titre} — ${l.auteur} (${l.annee})${l.dispo ? '' : ' · emprunté'}</li>`).join('')}</ul></body>`);
    }
    json(res, 404, { erreur: 'Route inconnue' });
  })
  .listen(process.env.PORT || 3000);
