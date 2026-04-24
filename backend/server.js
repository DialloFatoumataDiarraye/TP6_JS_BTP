const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Données déplacées du frontend vers le serveur
let projects = [
  { id: "p1", nom: "Résidence Les Acacias", lieu: "Lyon 3e", chef: "Marie Durand", statut: "En cours" },
  { id: "p2", nom: "Entrepôt Logistique Nord", lieu: "Lille", chef: "Sofia Marek", statut: "En cours" }
];

let tasks = [
  { id: "t1", projetId: "p1", titre: "Fondations béton armé", responsable: "Théo Blanchet", echeance: "2026-05-15", priorite: "high", statut: "done" },
  { id: "t2", projetId: "p1", titre: "Dallage RDC", responsable: "Théo Blanchet", echeance: "2026-06-10", priorite: "medium", statut: "todo" }
];


// Routes API
app.get('/api/projects', (req, res) => res.json(projects));
app.get('/api/tasks', (req, res) => res.json(tasks));

app.post('/api/tasks', (req, res) => {
  const newTask = { id: 't' + Date.now(), ...req.body };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.listen(PORT, () => {
  console.log(`✅ Serveur BuildFlow BTP actif sur http://localhost:${PORT}`);
});