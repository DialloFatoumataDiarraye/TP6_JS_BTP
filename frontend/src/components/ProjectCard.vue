<script setup>
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  project: Object
})
</script>

<template>
  <div class="card project-card">
    <h3>{{ project.nom }}</h3>
    <div class="details">
      <p><strong>Lieu :</strong> {{ project.lieu }}</p>
      <p><strong>Chef de projet :</strong> {{ project.chef }}</p>
      <p><strong>Statut :</strong> <span class="badge">{{ project.statut }}</span></p>
    </div>
    <div class="actions">
      <RouterLink :to="`/kanban/${project.id}`" class="btn btn-primary">Voir le Kanban</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.details {
  flex-grow: 1;
  margin-bottom: 1rem;
}

.details p {
  margin-bottom: 0.5rem;
}

.badge {
  background-color: var(--secondary-blue);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.actions {
  margin-top: auto;
}
</style>
