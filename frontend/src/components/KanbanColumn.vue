<script setup>
import { defineProps } from 'vue'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  title: String,
  tasks: Array,
  columnId: String
})
</script>

<template>
  <div class="kanban-column">
    <div class="column-header">
      <h3>{{ title }}</h3>
      <span class="task-count">{{ tasks.length }}</span>
    </div>
    <div class="column-content">
      <TaskCard 
        v-for="task in tasks" 
        :key="task.id" 
        :task="task" 
      />
      <div v-if="tasks.length === 0" class="empty-msg">
        Aucune tâche
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-column {
  background-color: #EDF2F7;
  border-radius: 8px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
}

.column-header {
  padding: 1rem;
  border-bottom: 2px solid var(--border-grey);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--primary-blue);
}

.task-count {
  background-color: var(--border-grey);
  color: var(--dark-grey);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
}

.column-content {
  padding: 1rem;
  flex-grow: 1;
  min-height: 200px;
}

.empty-msg {
  text-align: center;
  color: #A0AEC0;
  font-style: italic;
  padding: 2rem 0;
}
</style>
