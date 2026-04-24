<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <div class="hero card">
      <h1>Bienvenue sur BuildFlow</h1>
      <p>L'application de gestion de chantiers BTP nouvelle génération.</p>
      <div class="actions">
        <RouterLink to="/projects" class="btn btn-primary">Voir les chantiers en cours</RouterLink>
      </div>
    </div>
    
    <div class="features">
      <div class="card feature-card">
        <h3>📋 Gestion des tâches</h3>
        <p>Suivez l'avancement de chaque tâche dans vos différents projets grâce à un Kanban intuitif.</p>
      </div>
      <div class="card feature-card">
        <h3>🏗️ Suivi de chantiers</h3>
        <p>Gardez un oeil sur tous vos chantiers avec une vue globale et détaillée.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background-color: var(--white);
  margin-bottom: 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  color: var(--dark-grey);
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
}
</style>
