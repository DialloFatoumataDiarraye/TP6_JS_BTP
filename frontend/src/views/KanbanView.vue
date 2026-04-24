<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import KanbanColumn from '../components/KanbanColumn.vue'
import TaskForm from '../components/TaskForm.vue'

const route = useRoute()
const projectId = route.params.id

const project = ref(null)
const tasks = ref([])
const loading = ref(true)
const error = ref(null)

// Filtrage
const filterText = ref('')
const filterPriority = ref('')

const fetchProjectData = async () => {
  try {
    const [projectRes, tasksRes] = await Promise.all([
      fetch(`http://localhost:3000/api/projects/${projectId}`),
      fetch(`http://localhost:3000/api/tasks`)
    ])
    
    if (!projectRes.ok) throw new Error('Projet non trouvé')
    
    project.value = await projectRes.json()
    const allTasks = await tasksRes.json()
    // Filtrer les tâches par projet
    tasks.value = allTasks.filter(t => t.projetId === projectId)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchProjectData)

const handleTaskAdded = (newTask) => {
  tasks.value.push(newTask)
}

// Tâches filtrées
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const matchText = task.titre.toLowerCase().includes(filterText.value.toLowerCase()) || 
                      task.responsable.toLowerCase().includes(filterText.value.toLowerCase())
    const matchPriority = filterPriority.value ? task.priorite === filterPriority.value : true
    return matchText && matchPriority
  })
})

const columns = [
  { id: 'todo', title: 'À faire' },
  { id: 'in-progress', title: 'En cours' },
  { id: 'blocked', title: 'Bloqué' },
  { id: 'done', title: 'Terminé' }
]

const getTasksByStatus = (status) => {
  return filteredTasks.value.filter(t => t.statut === status)
}
</script>

<template>
  <div class="kanban-view">
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else>
      <header class="kanban-header">
        <h2>{{ project.nom }} <span class="badge">{{ project.statut }}</span></h2>
        <p>Chef de projet: <strong>{{ project.chef }}</strong> | Lieu: <strong>{{ project.lieu }}</strong></p>
      </header>
      
      <TaskForm :projectId="projectId" @task-added="handleTaskAdded" />
      
      <div class="filters card">
        <div class="filter-group">
          <label>Rechercher :</label>
          <input type="text" v-model="filterText" placeholder="Titre ou responsable..." />
        </div>
        <div class="filter-group">
          <label>Priorité :</label>
          <select v-model="filterPriority">
            <option value="">Toutes</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>
        </div>
      </div>
      
      <div class="kanban-board">
        <KanbanColumn 
          v-for="col in columns" 
          :key="col.id"
          :title="col.title"
          :columnId="col.id"
          :tasks="getTasksByStatus(col.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-grey);
}

.kanban-header h2 {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge {
  font-size: 0.9rem;
  background-color: var(--secondary-blue);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}

.filters {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group input, 
.filter-group select {
  padding: 0.4rem;
  border: 1px solid var(--border-grey);
  border-radius: 4px;
}

.kanban-board {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

/* Scrollbar styling for board */
.kanban-board::-webkit-scrollbar {
  height: 8px;
}
.kanban-board::-webkit-scrollbar-track {
  background: var(--light-grey);
  border-radius: 4px;
}
.kanban-board::-webkit-scrollbar-thumb {
  background: var(--border-grey);
  border-radius: 4px;
}
.kanban-board::-webkit-scrollbar-thumb:hover {
  background: var(--dark-grey);
}
</style>
