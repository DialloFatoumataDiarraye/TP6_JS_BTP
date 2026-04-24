const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Données déplacées du frontend vers le serveur
let projects = [
  { id: "p1", nom: "Résidence Les Acacias", lieu: "Lyon 3e", chef: "Marie Durand", statut: "En cours", notes: "Terrain avec une légère pente, attention au drainage." },
  { id: "p2", nom: "Entrepôt Logistique Nord", lieu: "Lille", chef: "Sofia Marek", statut: "En cours", notes: "" }
];

let tasks = [
  { id: "t1", projetId: "p1", titre: "Fondations béton armé", responsable: "Théo Blanchet", echeance: "2026-05-15", priorite: "high", statut: "done", commentaires: [{ id: 1, auteur: "Théo Blanchet", texte: "Coulage terminé sans accroc", date: new Date().toISOString() }] },
  { id: "t2", projetId: "p1", titre: "Dallage RDC", responsable: "Théo Blanchet", echeance: "2026-06-10", priorite: "medium", statut: "todo", commentaires: [] }
];


// Routes API
app.get('/api/projects', (req, res) => res.json(projects));
app.get('/api/projects/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ error: 'Projet non trouvé' });
  }
});

app.get('/api/tasks', (req, res) => res.json(tasks));
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: 'Tâche non trouvée' });
  }
});

app.post('/api/tasks', (req, res) => {
  const newTask = { id: 't' + Date.now(), commentaires: [], ...req.body };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...req.body };
    res.json(tasks[index]);
  } else {
    res.status(404).json({ error: 'Tâche non trouvée' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    const deletedTask = tasks.splice(index, 1);
    res.json(deletedTask[0]);
  } else {
    res.status(404).json({ error: 'Tâche non trouvée' });
  }
});

app.put('/api/projects/:id', (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...req.body };
    res.json(projects[index]);
  } else {
    res.status(404).json({ error: 'Projet non trouvé' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur BuildFlow BTP actif sur http://localhost:${PORT}`);
});