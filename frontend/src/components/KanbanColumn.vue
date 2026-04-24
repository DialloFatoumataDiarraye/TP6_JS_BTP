<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  title: String,
  tasks: Array,
  columnId: String
})

const emit = defineEmits(['task-dropped', 'dragstart', 'edit-task', 'delete-task'])

const isDragOver = ref(false)

const onDrop = (event) => {
  isDragOver.value = false
  const taskId = event.dataTransfer.getData('taskId')
  if (taskId) {
    emit('task-dropped', { taskId, newStatus: props.columnId })
  }
}
</script>

<template>
  <div 
    class="kanban-column"
    :class="{ 'drag-over': isDragOver }"
    @dragover.prevent="isDragOver = true"
    @dragleave.prevent="isDragOver = false"
    @drop="onDrop"
  >
    <div class="column-header">
      <h3>{{ title }}</h3>
      <span class="task-count" :class="{ 'count-active': tasks.length > 0 }">{{ tasks.length }}</span>
    </div>
    <div class="column-content">
      <TaskCard 
        v-for="task in tasks" 
        :key="task.id" 
        :task="task"
        @dragstart="(t, e) => { e.dataTransfer.setData('taskId', t.id); emit('dragstart', t, e); }"
        @edit-task="(t) => emit('edit-task', t)"
        @delete-task="(id) => emit('delete-task', id)"
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
  transition: background-color 0.2s;
}

.kanban-column.drag-over {
  background-color: #E2E8F0;
  border: 2px dashed var(--secondary-blue);
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

.task-count.count-active {
  background-color: var(--secondary-blue);
  color: white;
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
