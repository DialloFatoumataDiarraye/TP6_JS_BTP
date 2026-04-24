<script setup>
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  task: Object
})

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'var(--danger)';
    case 'medium': return 'var(--orange)';
    case 'low': return 'var(--success)';
    default: return 'var(--dark-grey)';
  }
}
</script>

<template>
  <div class="card task-card">
    <h4>{{ task.titre }}</h4>
    <div class="task-details">
      <p class="resp">👤 {{ task.responsable }}</p>
      <p class="date">📅 {{ new Date(task.echeance).toLocaleDateString() }}</p>
      <p class="priority">
        Priorité: 
        <span class="prio-badge" :style="{ backgroundColor: getPriorityColor(task.priorite) }">
          {{ task.priorite }}
        </span>
      </p>
    </div>
    <div class="actions">
      <RouterLink :to="`/tasks/${task.id}`" class="btn btn-sm">Détails</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid var(--secondary-blue);
  background-color: var(--white);
}

.task-card h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--dark-grey);
}

.task-details {
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 0.8rem;
}

.task-details p {
  margin-bottom: 0.2rem;
}

.prio-badge {
  color: white;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-size: 0.75rem;
}

.btn-sm {
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  background-color: var(--light-grey);
  color: var(--dark-grey);
  border: 1px solid var(--border-grey);
}

.btn-sm:hover {
  background-color: var(--border-grey);
  color: var(--primary-blue);
}
</style>
