<script setup>
import { defineProps, defineEmits } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  task: Object
})

const emit = defineEmits(['dragstart', 'edit-task', 'delete-task'])

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'var(--danger)';
    case 'medium': return 'var(--orange)';
    case 'low': return 'var(--success)';
    default: return 'var(--dark-grey)';
  }
}

const onDragStart = (event) => {
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  emit('dragstart', props.task, event)
}

const isOverdue = (dateString) => {
  const taskDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return taskDate < today && props.task.statut !== 'done'
}
</script>

<template>
  <div 
    class="card task-card" 
    :class="{ 'overdue': isOverdue(task.echeance) }"
    draggable="true" 
    @dragstart="onDragStart"
  >
    <h4>{{ task.titre }} <span v-if="isOverdue(task.echeance)" class="warning-icon" title="En retard">⚠️</span></h4>
    <div class="task-details">
      <p class="resp">👤 {{ task.responsable }}</p>
      <p class="date" :class="{ 'text-danger': isOverdue(task.echeance) }">📅 {{ new Date(task.echeance).toLocaleDateString() }}</p>
      <p class="priority">
        Priorité: 
        <span class="prio-badge" :style="{ backgroundColor: getPriorityColor(task.priorite) }">
          {{ task.priorite }}
        </span>
      </p>
    </div>
    <div class="actions">
      <RouterLink :to="`/tasks/${task.id}`" class="btn btn-sm">Détails</RouterLink>
      <button @click="emit('edit-task', task)" class="btn btn-sm btn-outline">✏️</button>
      <button @click="emit('delete-task', task.id)" class="btn btn-sm btn-danger">🗑️</button>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid var(--secondary-blue);
  background-color: var(--white);
  cursor: grab;
}

.task-card:active {
  cursor: grabbing;
}

.task-card.overdue {
  border-left-color: var(--danger);
  background-color: #FFF5F5;
}

.warning-icon {
  font-size: 0.9rem;
}

.text-danger {
  color: var(--danger);
  font-weight: bold;
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

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--border-grey);
}

.btn-outline:hover {
  background-color: var(--light-grey);
}

.btn-danger {
  background-color: transparent;
  color: var(--danger);
  border: 1px solid var(--danger);
}

.btn-danger:hover {
  background-color: var(--danger);
  color: white;
}
</style>
